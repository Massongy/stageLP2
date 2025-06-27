import secrets
from django.core.mail import send_mail
from .models import User
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from django.contrib.auth import update_session_auth_hash
from .serializers import ChangePasswordSerializer, UserSerializer
from django.conf import settings
from rest_framework.views import APIView


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
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # ou IsAdminUser

    def perform_create(self, serializer):
        # 1. Générer un mot de passe sécurisé
        password = secrets.token_urlsafe(10)
        user = serializer.save()
        user.set_password(password)
        user.save()

        # 2. Envoyer un email de bienvenue
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
        
    
class QuestionnaireList(APIView):
    def get(self, request):
        return Response({"message": "Questionnaire list works!"})

class QuestionnaireDetail(APIView):
    def get(self, request, pk):
        return Response({"message": f"Questionnaire detail works for ID {pk}!"})