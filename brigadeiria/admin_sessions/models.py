from django.db import models
from django.contrib.sessions.models import AbstractBaseSession
from django.contrib.sessions.base_session import BaseSessionManager


class AdminSessionManager(BaseSessionManager):
    pass


class AdminSession(AbstractBaseSession):
    objects = AdminSessionManager()

    class Meta:
        db_table = 'admin_sessions'
        verbose_name = 'Admin Session'
        verbose_name_plural = 'Admin Sessions'
