import secrets
from django.core.mail import send_mail
from .models import User
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from django.contrib.auth import update_session_auth_hash
from .serializers import ChangePasswordSerializer, UserSerializer, UserCreateSerializer, GroupSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from django.conf import settings
from rest_framework.views import APIView
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth.models import Group
from .utils import group_permission_map, can_delete_user_from_group_map
from rest_framework.exceptions import PermissionDenied
from .permissions import ViewCreatedUserPermission
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode


class UserDetail(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = self.get_object()
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)
        return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.IsAuthenticated]  # ou IsAdminUser

    def can_create_user_in_group(self, request_user, target_group_name):
        print(f'request user : {request_user}')
        print(f'Target group : {target_group_name}')
        required_perm = group_permission_map.get(target_group_name)
        print(f'required perm : {required_perm}')
        if not required_perm:
            raise ValueError("Unknown group")

        app_label = 'users'  # Replace with your actual app label

        full_permission = f'{app_label}.{required_perm}'
        permission = request_user.has_perm(full_permission)
        if permission :
            print("Droit de création de l'utilliateur")
        else : 
            print("Pas de droit de création d'un utilisateur pour ce groupe")
        return permission
    

    def perform_create(self, serializer):
        #1. Verifie la possibilité de créer un utilisateur 
   
        target_group_name = self.request.data.get('groups')[0]
        
        if not self.can_create_user_in_group(self.request.user, target_group_name):
            raise PermissionDenied ("Vous n'avez pas la permission de créer un utilisateur dans ce groupe.")

        # 2. Générer un mot de passe sécurisé
        print(f"Creating user with no superadmin status")       
        password = secrets.token_urlsafe(10)
        user = serializer.save(created_by=self.request.user)
        user.set_password(password)
        user.is_active = True  # TODO : Set to false and activate on password changed Désactiver le compte par défaut
        user.save()
        
        # 2. Envoyer un email de bienvenue
        try:
            send_mail(
                subject="Bienvenue sur Qualilead",
                message=(
                f"Bonjour {user.first_name},\n\n"
                f"Votre compte a été créé avec succès.\n"
                f"Email : {user.email}\n"
                f"Mot de passe provisoire : {password}\n\n"
                "Merci de vous connecter et de changer votre mot de passe dès votre première connexion.\n"
                "Lien de connexion : http://188.165.234.16/login\n\n"
                "L’équipe Qualilead"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        except Exception as e:
            # Gérer l'erreur d'envoi d'email
            print(f"Erreur lors de l'envoi de l'email : {e}")
            # Vous pouvez aussi lever une exception ou enregistrer l'erreur dans un log

class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    lookup_field = 'id'
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        user_id = self.kwargs.get('id')
        if not self.request.user.is_superuser : 
            user_list = User.objects.filter(created_by=self.request.user)
       
            if not user_list.filter(id=user_id) : 
                raise PermissionDenied("You are not authorized to update this user.")
        
        return obj
    
    def update(self, request, *args, **kwargs):
        
        if not self.request.user.has_perm('users.can_change_user_data') and request.user.id != int(kwargs.get('id')):
            raise PermissionDenied("You do not have permission to change user data.")
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            "message": "User updated successfully.",
            "user": serializer.data
        }, status=status.HTTP_200_OK)
    
     
class UserDelete(generics.DestroyAPIView): 
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = 'id'
    queryset = User.objects.all()
    
    @swagger_auto_schema(
        tags=["users"],
        operation_description="Deactivate (soft‑delete) a user by ID",
        manual_parameters=[
            openapi.Parameter(
                name="id",
                in_=openapi.IN_PATH,
                description="ID of the user to deactivate",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            204: "User deactivated successfully",
            404: "User not found"
        }
    )
    
    def can_delete_user_from_group(self, request_user, target_user_group): 
        print(f'target user gorup : {target_user_group}')
        required_perm =  can_delete_user_from_group_map.get(target_user_group)
        print(f'Required perm : {required_perm}')
        if not required_perm : 
            raise PermissionDenied("You can not delete a User from this group")
        
        app_label = 'users'
        full_permission = f'{app_label}.{required_perm}'
        permission = request_user.has_perm(full_permission)
        
        if(permission) : 
            print("Permission to delete")
        else : 
            print('Deletion forbidden ')
        return permission
        
    
    def destroy(self, request,id, *args, **kwargs):
        
        try:
            user = User.objects.get(pk=id)
        except User.DoesNotExist: 
            return Response({"detail" : "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        print(user) 
        
        
        user_groups = user.groups.all()
        if(user_groups):
            user_group = user_groups[0]
        else : 
            raise ValueError("This user has no group, delete it manually via admin panel")
        
      
        if not self.can_delete_user_from_group(self.request.user, user_group.id):
            raise PermissionDenied("You do not have permission to delete this user.")
        else:  
            user.is_active = False
            user.save()
    
       
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return user.objects.all()
        return user.objects.filter(created_by=user)

    def perform_create(self, serializer):
        
        serializer.save(created_by=self.request.user)
        
        
class MyUsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, ViewCreatedUserPermission]
    

    def get_queryset(self):
        # Return users created by the current user
        return User.objects.filter(created_by=self.request.user)
    
    
class UserGroups(generics.ListAPIView): 
    serializer_class=GroupSerializer
    permission_classes= [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Group.objects.all()
    
    
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        request_body=ForgotPasswordSerializer,
        responses={200: openapi.Response("Reset email sent")}
    )
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "If the email exists, a reset link will be sent."}, status=status.HTTP_200_OK)

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f"http://yourfrontend.com/reset-password/{uid}/{token}/"

        send_mail(
            subject="Reset Your Password",
            message=f"Bonjour {user.first_name},\nVous pouvez changer votre mot de passe en cliquant sur le lien suivant :\n{reset_url}\n\nL’équipe Qualilead",
            from_email="no-reply@example.com",
            recipient_list=[user.email],
        )

        return Response({"message": "If the email exists, a reset link will be sent."}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        request_body=ResetPasswordSerializer,
        responses={200: openapi.Response("Password reset successfully")}
    )
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"error": "Invalid or expired reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)