from django.contrib.sessions.backends.db import SessionStore as DBStore
from admin_sessions.models import AdminSession

class SessionStore(DBStore):
    @classmethod
    def get_model_class(cls):
        return AdminSession
