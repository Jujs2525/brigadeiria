from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages, auth

# 🔹 IMPORTA O MODELO E A FUNÇÃO DE ENVIO
from .models import EmailVerification
from .utils import send_verification_email


def registrar(request):
    if request.method == "POST":
        nome = request.POST.get("nome")
        email = request.POST.get("email")
        senha = request.POST.get("senha")
        confirmar = request.POST.get("confirmar")

        if senha != confirmar:
            messages.error(request, "As senhas não coincidem.")
            return redirect("perfil")

        if User.objects.filter(email=email).exists():
            messages.warning(request, "E-mail já cadastrado.")
            return redirect("perfil")

        # Cria o usuário como inativo até verificar o e-mail
        user = User.objects.create_user(username=email, email=email, password=senha, first_name=nome)
        user.is_active = False
        user.save()

        # Cria código de verificação e envia por e-mail
        verif = EmailVerification.objects.create(user=user)
        verif.generate_code()

        send_verification_email(user, verif.code)

        messages.success(request, "Cadastro realizado! Verifique seu e-mail para confirmar.")
        return redirect("/verificar_email/")

    return render(request, "perfil.html")


def verificar_email(request):
    if request.method == "POST":
        email = request.POST.get("email")
        codigo = request.POST.get("codigo")

        try:
            user = User.objects.get(email=email)
            verif = EmailVerification.objects.get(user=user)

            if verif.code == codigo:
                verif.is_verified = True
                verif.save()
                user.is_active = True
                user.save()
                messages.success(request, "E-mail verificado com sucesso! Agora você pode entrar.")
                return redirect("perfil")
            else:
                messages.error(request, "Código incorreto.")
        except:
            messages.error(request, "Usuário não encontrado.")

    return render(request, "verificar_email.html")
