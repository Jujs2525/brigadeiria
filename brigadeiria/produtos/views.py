from django.shortcuts import render, redirect
from .models import Banner, FotoGaleria, Categoria, Carrinho, Produto
from django.contrib.auth.models import User
from django.contrib import messages, auth

from django.contrib.auth.decorators import login_required

from django.http import JsonResponse
from .models import FotoGaleria

from rest_framework import generics
from .models import Categoria, Produto
from .serializers import CategoriaSerializer, ProdutoSerializer

from django.shortcuts import render, get_object_or_404
from .models import Produto

from django.http import JsonResponse


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

def verificar_login(request):
    if request.user.is_authenticated:
        return JsonResponse({'autenticado': True})
    else:
        return JsonResponse({'autenticado': False})

def index(request):
    banners = Banner.objects.all()[:3]  # 3 imagens do carrossel
    fotos = FotoGaleria.objects.all()   # todas as imagens da galeria
    return render(request, 'index.html', {'banners': banners, 'fotos': fotos})


@login_required(login_url='perfil')
def cardapio(request):
    produtos = Produto.objects.all().order_by('categoria__nome')
    produtos_por_categoria = {}

    for produto in produtos:
        categoria_nome = produto.categoria.nome
        if categoria_nome not in produtos_por_categoria:
            produtos_por_categoria[categoria_nome] = []
        produtos_por_categoria[categoria_nome].append(produto)

    return render(request, 'cardapio.html', {'produtos_por_categoria': produtos_por_categoria})


@login_required(login_url='perfil')
def carrinho(request):
    itens_carrinho = Carrinho.objects.all()
    total = sum(item.produto.preco * item.quantidade for item in itens_carrinho)
    return render(request, 'carrinho.html', {'itens_carrinho': itens_carrinho, 'total': total})

@login_required(login_url='perfil')
def adicionar_ao_carrinho(request, produto_id):
    produto = get_object_or_404(Produto, id=produto_id)

    if request.method == 'POST':
        quantidade = int(request.POST.get('quantidade', 1))

        # se o item já existe no carrinho, atualiza quantidade
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

    
def produto_detalhe(request, pk):
    produto = get_object_or_404(Produto, pk=pk)
    return render(request, 'produto_detalhe.html', {'produto': produto})


def perfil(request):
    return render(request, 'perfil.html')


def produto_detalhe(request, pk):
    produto = get_object_or_404(Produto, pk=pk)
    return render(request, 'produto_detalhe.html', {'produto': produto})


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
                'url': f"/produtos/{produto.id}/"  # link direto pro produto
            }
            for produto in produtos
        ]

    return JsonResponse({'results': resultados})

    # Página principal de perfil (login/cadastro)
def perfil(request):
    return render(request, 'perfil.html')

# Cadastro
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

# Login
def logar(request):
    if request.method == "POST":
        email = request.POST['email']
        senha = request.POST['senha']
        user = auth.authenticate(username=email, password=senha)

        if user is not None:
            auth.login(request, user)
            return redirect('cardapio')  # redireciona pro cardápio, por exemplo
        else:
            messages.error(request, "E-mail ou senha incorretos.")
            return redirect('perfil')

# Logout
def sair(request):
    auth.logout(request)
    return redirect('perfil')
