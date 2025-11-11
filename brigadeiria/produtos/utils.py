import threading
from django.core.mail import send_mail
from django.conf import settings

def send_verification_email(user, code):
    assunto = "Confirme seu e-mail 🍫"
    mensagem = f"Olá {user.first_name},\n\nSeu código de verificação é: {code}\n\nDigite-o no site para ativar sua conta."
    remetente = settings.DEFAULT_FROM_EMAIL
    destinatarios = [user.email]

    def _send():
        send_mail(assunto, mensagem, remetente, destinatarios, fail_silently=True)

    threading.Thread(target=_send).start()
