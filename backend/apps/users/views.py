import secrets
from django.core.mail import send_mail
from .models import User
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from django.contrib.auth import update_session_auth_hash
from .serializers import ChangePasswordSerializer, UserSerializer, UserCreateSerializer, GroupSerializer
from django.conf import settings
from rest_framework.views import APIView
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth.models import Group
from .utils import group_permission_map
from rest_framework.exceptions import PermissionDenied

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
    permission_classes = [permissions.IsAuthenticated]
    

    def get_queryset(self):
        # Return users created by the current user
        return User.objects.filter(created_by=self.request.user)
    
    

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
    def destroy(self, request, *args, **kwargs):
        user_id = kwargs.get('id')
        try : 
            user = self.get_queryset().get(id=user_id)
           
        except User.DoesNotExist: 
            return Response({"detail" : "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if self.request.user != user.created_by and not self.request.user.is_superuser : 
            raise Exception("Vous ne pouvez pas supprimer cet utilisateur.")
        
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class UserGroups(generics.ListAPIView): 
    serializer_class=GroupSerializer
    permission_classes= [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Group.objects.all()
