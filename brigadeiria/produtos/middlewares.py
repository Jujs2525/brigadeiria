from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from importlib import import_module

class SplitSessionMiddleware(MiddlewareMixin):
    """
    Middleware que separa as sessões do admin e do site
    sem misturar os logins.
    """
    def process_request(self, request):
        if request.path.startswith('/admin'):
            # Usa o mecanismo e cookie do admin
            engine = import_module(settings.ADMIN_SESSION_ENGINE)
            request.session = engine.SessionStore(
                session_key=request.COOKIES.get(settings.ADMIN_SESSION_COOKIE_NAME)
            )
            request.session_cookie_name = settings.ADMIN_SESSION_COOKIE_NAME
        else:
            # Usa o mecanismo e cookie do site
            engine = import_module(settings.SESSION_ENGINE)
            request.session = engine.SessionStore(
                session_key=request.COOKIES.get(settings.SESSION_COOKIE_NAME)
            )
            request.session_cookie_name = settings.SESSION_COOKIE_NAME

    def process_response(self, request, response):
        if hasattr(request, "session") and request.session.modified:
            request.session.save()
            response.set_cookie(
                getattr(request, "session_cookie_name", settings.SESSION_COOKIE_NAME),
                request.session.session_key,
                httponly=True,
                samesite="Lax",
                secure=False,
            )
        return response
