from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User

from django.contrib import messages, auth
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

from .models import Banner, FotoGaleria, Categoria, Carrinho, Produto, CarrinhoTemporario, EmailVerification
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


# ===================== PÁGINAS =====================
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
    from .models import CarrinhoTemporario  # importa o novo modelo

    # ======== GET → Carregar carrinho salvo ========
    if request.method == "GET":
        carrinho, _ = CarrinhoTemporario.objects.get_or_create(usuario=user)
        return JsonResponse(carrinho.dados, safe=False)

    # ======== POST → Salvar carrinho recebido do JS ========
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



# ===================== LOGIN CHECK (para JS) =====================
def verificar_login(request):
    return JsonResponse({'autenticado': request.user.is_authenticated})


# ===================== PRODUTO =====================
def produto_detalhe(request, pk):
    produto = get_object_or_404(Produto, pk=pk)
    return render(request, 'produto_detalhe.html', {'produto': produto})


# ===================== PERFIL / AUTENTICAÇÃO =====================
def perfil(request):
    return render(request, 'perfil.html')


def registrar(request):
    if request.method == "POST":
        nome = request.POST.get("nome", "").strip()
        email = request.POST.get("email", "").strip().lower()
        senha = request.POST.get("senha", "")
        confirmar = request.POST.get("confirmarSenha", "")

        # === 1️⃣ Verifica se todos os campos foram preenchidos ===
        if not nome or not email or not senha or not confirmar:
            messages.error(request, "Preencha todos os campos.")
            return redirect("perfil")

        # === 2️⃣ Verifica se as senhas coincidem ===
        if senha != confirmar:
            messages.error(request, "As senhas não coincidem.")
            return redirect("perfil")

        # === 3️⃣ Verifica se o e-mail já está cadastrado ===
        if User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
            messages.warning(request, "E-mail já cadastrado.")
            return redirect("perfil")

        # === 4️⃣ Cria o usuário ===
        user = User.objects.create_user(
            username=email,
            email=email,
            password=senha,
            first_name=nome
        )
        user.is_active = False
        user.save()

        # === 5️⃣ Gera e envia o código de verificação ===
        verif, _ = EmailVerification.objects.get_or_create(user=user)
        verif.generate_code()
        send_verification_email(user, verif.code)

        messages.success(request, "Cadastro realizado! Verifique seu e-mail para confirmar.")
        return redirect(f"/verificar_email/?email={email}")

    # === GET ===
    return render(request, "perfil.html")

@csrf_exempt
def verificar_email(request):
    email = request.GET.get("email", "")  # ← pega o e-mail da URL
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

    return render(request, "verificar_email.html", {"email": email})

def reenviar_codigo(request):
    email = request.GET.get("email")
    try:
        user = User.objects.get(email=email)
        verif, _ = EmailVerification.objects.get_or_create(user=user)
        verif.generate_code()
        send_verification_email(user, verif.code)
        messages.success(request, "Um novo código foi enviado para seu e-mail.")
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
                messages.warning(request, "Verifique seu e-mail antes de fazer login.")
                return redirect("perfil")
            auth.login(request, user)
            return redirect("cardapio")
        else:
            messages.error(request, "E-mail ou senha incorretos.")
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


