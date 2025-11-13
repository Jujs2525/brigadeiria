import datetime
from django.utils import timezone
from django.conf import settings

ADMIN_SESSION_DURATION = getattr(settings, "ADMIN_SESSION_DURATION", 2 * 60 * 60)

class AdminSessionExpiryMiddleware:
    """
    Expira a sessão SOMENTE de usuários do admin
    e envia um aviso se estiver perto da expiração.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # Apenas para admin logado
        if request.user.is_authenticated and request.user.is_staff:

            now = timezone.now().timestamp()

            # Criar timestamp inicial
            if not request.session.get("admin_last_activity"):
                request.session["admin_last_activity"] = now

            last = request.session["admin_last_activity"]
            elapsed = now - last
            remaining = ADMIN_SESSION_DURATION - elapsed

            # Expirar se passou do limite
            if elapsed > ADMIN_SESSION_DURATION:
                from django.contrib.auth import logout
                logout(request)
            else:
                # Atualizar atividade
                request.session["admin_last_activity"] = now

            # Enviar tempo restante para o template/admin
            request.admin_time_remaining = remaining

        return self.get_response(request)
