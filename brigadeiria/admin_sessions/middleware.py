import time
from django.contrib.auth import logout
from django.conf import settings

ADMIN_SESSION_DURATION = getattr(settings, "ADMIN_SESSION_DURATION", 2 * 60 * 60)

class AdminSessionExpiryMiddleware:
    """
    Expira somente a sessão do admin e envia o tempo restante ao template.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # Só administra sessão de usuários do admin
        if request.user.is_authenticated and request.user.is_staff:

            now = time.time()

            last = request.session.get("admin_last_activity")

            # Primeira requisição
            if not last:
                request.session["admin_last_activity"] = now
                request.admin_time_remaining = ADMIN_SESSION_DURATION
                return self.get_response(request)

            elapsed = now - float(last)
            remaining = ADMIN_SESSION_DURATION - elapsed

            # Expirou
            if remaining <= 0:
                logout(request)
                request.admin_time_remaining = 0
            else:
                # Atualiza timestamp
                request.session["admin_last_activity"] = now
                request.admin_time_remaining = int(remaining)

        return self.get_response(request)
