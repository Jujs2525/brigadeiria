from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class AdminSessionBackend(ModelBackend):
    def user_can_authenticate(self, user):
        return user.is_active and user.is_staff
