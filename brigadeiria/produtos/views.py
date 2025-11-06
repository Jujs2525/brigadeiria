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
        nome = request.POST['nome']
        email = request.POST['email']
        senha = request.POST['senha']
        confirmar = request.POST['confirmar']

        if senha != confirmar:
            messages.error(request, "As senhas não coincidem.")
            return redirect('perfil')

        if User.objects.filter(username=email).exists():
            messages.error(request, "E-mail já cadastrado.")
            return redirect('perfil')

        user = User.objects.create_user(username=email, email=email, password=senha, first_name=nome)
        user.save()
        messages.success(request, "Cadastro realizado com sucesso! Faça login.")
        return redirect('perfil')

    return redirect('perfil')


def logar(request):
    if request.method == "POST":
        email = request.POST['email']
        senha = request.POST['senha']
        user = auth.authenticate(username=email, password=senha)

        if user is not None:
            auth.login(request, user)
            return redirect('cardapio')
        else:
            messages.error(request, "E-mail ou senha incorretos.")
            return redirect('perfil')


def sair(request):
    auth.logout(request)
    return redirect('/')  # Vai pra home 


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


