from django.shortcuts import render
from .models import Banner, FotoGaleria

from django.http import JsonResponse
from .models import FotoGaleria

from rest_framework import generics
from .models import Categoria, Produto
from .serializers import CategoriaSerializer, ProdutoSerializer

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


def carrinho(request):
    itens_carrinho = Carrinho.objects.all()
    total = sum(item.produto.preco * item.quantidade for item in itens_carrinho)
    return render(request, 'carrinho.html', {'itens_carrinho': itens_carrinho, 'total': total})

def index(request):
    banners = Banner.objects.all()[:3]  # 3 imagens do carrossel
    fotos = FotoGaleria.objects.all()   # todas as imagens da galeria
    return render(request, 'index.html', {'banners': banners, 'fotos': fotos})

def cardapio(request):
    produtos = Produto.objects.all().order_by('categoria__nome')
    produtos_por_categoria = {}

    for produto in produtos:
        categoria_nome = produto.categoria.nome
        if categoria_nome not in produtos_por_categoria:
            produtos_por_categoria[categoria_nome] = []
        produtos_por_categoria[categoria_nome].append(produto)

    return render(request, 'cardapio.html', {'produtos_por_categoria': produtos_por_categoria})

    
def produto_detalhe(request, pk):
    produto = get_object_or_404(Produto, pk=pk)
    return render(request, 'produto_detalhe.html', {'produto': produto})


def perfil(request):
    return render(request, 'perfil.html')

def carrinho(request):
    return render(request, 'carrinho.html')

from django.shortcuts import render, get_object_or_404
from .models import Produto

from django.shortcuts import render, get_object_or_404
from .models import Produto

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
