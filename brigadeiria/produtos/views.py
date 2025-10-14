from django.shortcuts import render
from .models import Banner, FotoGaleria


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


def index(request):
    banners = Banner.objects.all()[:3]  # 3 imagens do carrossel
    fotos = FotoGaleria.objects.all()   # todas as imagens da galeria
    return render(request, 'index.html', {'banners': banners, 'fotos': fotos})

def cardapio(request):
    produtos = Produto.objects.all()
    return render(request, 'cardapio.html', {'produtos': produtos})

def perfil(request):
    return render(request, 'perfil.html')

def carrinho(request):
    return render(request, 'carrinho.html')