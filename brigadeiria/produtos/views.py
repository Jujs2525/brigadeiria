from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import auth, messages
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

from .models import (
    Banner, FotoGaleria, Categoria,
    Carrinho, Produto, CarrinhoTemporario,
    EmailVerification, Perfil
)
from .serializers import CategoriaSerializer, ProdutoSerializer
from .utils import send_verification_email

from rest_framework import generics


# ===================== API REST =====================
class CategoriaList(generics.ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class CategoriaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProdutoList(generics.ListCreateAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


class ProdutoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer


# ===================== PÁGINAS PRINCIPAIS =====================
def index(request):
    banners = Banner.objects.all()[:3]
    fotos = FotoGaleria.objects.all()
    return render(request, 'index.html', {'banners': banners, 'fotos': fotos})


def cardapio(request):
    produtos = Produto.objects.all().order_by('categoria__nome')
    produtos_por_categoria = {}

    for produto in produtos:
        categoria_nome = produto.categoria.nome if produto.categoria else 'Outros'
        produtos_por_categoria.setdefault(categoria_nome, []).append(produto)

    return render(request, 'cardapio.html', {'produtos_por_categoria': produtos_por_categoria})


def carrinho(request):
    itens_carrinho = Carrinho.objects.all()
    total = sum(item.produto.preco * item.quantidade for item in itens_carrinho)
    return render(request, 'carrinho.html', {'itens_carrinho': itens_carrinho, 'total': total})


@login_required(login_url='perfil')
def adicionar_ao_carrinho(request, produto_id):
    produto = get_object_or_404(Produto, id=produto_id)

    if request.method == 'POST':
        quantidade = int(request.POST.get('quantidade', 1))

        item, criado = Carrinho.objects.get_or_create(
            usuario=request.user,
            produto=produto,
            defaults={'quantidade': quantidade}
        )
        if not criado:
            item.quantidade += quantidade
            item.save()

        messages.success(request, f'{produto.nome} adicionado ao carrinho!')
        return redirect('carrinho')


@csrf_exempt
@login_required
def api_carrinho(request):
    user = request.user

    if request.method == "GET":
        carrinho, _ = CarrinhoTemporario.objects.get_or_create(usuario=user)
        return JsonResponse(carrinho.dados, safe=False)

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
            carrinho, _ = CarrinhoTemporario.objects.get_or_create(usuario=user)
            carrinho.dados = body
            carrinho.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Método não permitido'}, status=405)


# ===================== LOGIN CHECK =====================
def verificar_login(request):
    return JsonResponse({'autenticado': request.user.is_authenticated})


# ===================== PRODUTO =====================
def produto_detalhe(request, pk):
    produto = get_object_or_404(Produto, pk=pk)
    return render(request, 'produto_detalhe.html', {'produto': produto})


# ===================== PERFIL =====================
def perfil(request):
    if request.user.is_authenticated:
        Perfil.objects.get_or_create(user=request.user)
    return render(request, "perfil.html")

def registrar(request):
    if request.method == "POST":
        nome = request.POST.get("nome", "").strip()
        email = request.POST.get("email", "").strip().lower()
        senha = request.POST.get("senha", "")
        confirmar = request.POST.get("confirmarSenha", "")

        if not nome or not email or not senha or not confirmar:
            messages.error(request, "Preencha todos os campos.")
            return redirect("perfil")

        if senha != confirmar:
            messages.error(request, "As senhas não coincidem.")
            return redirect("perfil")

        if auth.models.User.objects.filter(email=email).exists():
            messages.warning(request, "E-mail já cadastrado.")
            return redirect("perfil")

        user = auth.models.User.objects.create_user(
            username=email,
            email=email,
            password=senha,
            first_name=nome
        )
        user.is_active = False
        user.save()

        verif, _ = EmailVerification.objects.get_or_create(user=user)
        verif.generate_code()
        send_verification_email(user, verif.code)

        messages.success(request, "Cadastro realizado! Verifique seu e-mail.")
        return redirect(f"/verificar_email/?email={email}")

    return render(request, "perfil.html")


@csrf_exempt
def verificar_email(request):
    email = request.GET.get("email", "")
    if request.method == "POST":
        codigo = request.POST.get("codigo")

        try:
            user = auth.models.User.objects.get(email=email)
            verif = EmailVerification.objects.get(user=user)

            if verif.code == codigo:
                verif.is_verified = True
                verif.save()
                user.is_active = True
                user.save()
                messages.success(request, "E-mail verificado!")
                return redirect("perfil")
            else:
                messages.error(request, "Código incorreto.")
        except:
            messages.error(request, "Usuário não encontrado.")

    return render(request, "verificar_email.html", {"email": email})


def reenviar_codigo(request):
    email = request.GET.get("email")
    try:
        user = auth.models.User.objects.get(email=email)
        verif, _ = EmailVerification.objects.get_or_create(user=user)
        verif.generate_code()
        send_verification_email(user, verif.code)
        messages.success(request, "Código reenviado!")
    except:
        messages.error(request, "Usuário não encontrado.")

    return redirect(f"/verificar_email/?email={email}")


def logar(request):
    if request.method == "POST":
        email = request.POST["email"]
        senha = request.POST["senha"]
        user = auth.authenticate(username=email, password=senha)

        if user is not None:
            if not user.is_active:
                messages.warning(request, "Verifique seu e-mail antes.")
                return redirect("perfil")
            auth.login(request, user)
            return redirect("cardapio")
        else:
            messages.error(request, "Credenciais inválidas.")
            return redirect("perfil")


def sair(request):
    auth.logout(request)
    return redirect("/")


# ===================== BUSCA =====================
def buscar(request):
    termo = request.GET.get('q', '').strip()
    resultados = []

    if termo:
        produtos = Produto.objects.filter(nome__icontains=termo)[:10]
        resultados = [
            {
                'title': produto.nome,
                'image': produto.imagem.url if produto.imagem else '',
                'price': f"R$ {produto.preco:.2f}",
                'url': f"/produtos/{produto.id}/"
            }
            for produto in produtos
        ]

    return JsonResponse({'results': resultados})


def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "logged": True,
            "username": request.user.username,
            "email": request.user.email
        })
    return JsonResponse({"logged": False})


# ===================== EXCLUIR CONTA =====================
def excluir_conta(request):
    if not request.user.is_authenticated:
        return redirect("perfil")

    user = request.user
    auth.logout(request)
    user.delete()

    return redirect("/")


# ===================== ATUALIZAR PERFIL =====================
@login_required
def atualizar_perfil(request):
    if request.method == "POST":
        user = request.user
        user.first_name = request.POST.get("nome")
        user.email = request.POST.get("email")
        user.username = request.POST.get("email")  # mantém login pelo email
        user.save()

        # garante que SEMPRE exista um perfil para esse usuário
        perfil, created = Perfil.objects.get_or_create(user=user)

        perfil.telefone = request.POST.get("telefone")
        perfil.cep = request.POST.get("cep")
        perfil.endereco = request.POST.get("endereco")
        perfil.complemento = request.POST.get("complemento")
        perfil.save()

        messages.success(request, "Perfil atualizado com sucesso!")
        return redirect("perfil")
