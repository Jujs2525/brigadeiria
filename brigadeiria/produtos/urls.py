from django.urls import path
from . import views
from django.conf import settings


urlpatterns = [
    path('', views.index, name='index'),
    path('cardapio/', views.cardapio, name='cardapio'),
    path('perfil/', views.perfil, name='perfil'),  # 🔹 ADICIONE ESTA LINHA
    path('carrinho/', views.carrinho, name='carrinho'),  # 🔹 e esta também se ainda não tiver
    path('buscar/', views.buscar, name='buscar'),
    path('categorias/', views.CategoriaList.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', views.CategoriaDetail.as_view(), name='categoria-detail'),
    path('produtos/', views.ProdutoList.as_view(), name='produto-list'),
    path('produtos/<int:pk>/', views.produto_detalhe, name='produto-detalhe'),
    path('api/produtos/<int:pk>/', views.ProdutoDetail.as_view(), name='produto-detail'),

]
