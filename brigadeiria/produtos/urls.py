from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('cardapio/', views.cardapio, name='cardapio'),

    path('perfil/', views.perfil, name='perfil'),
    path('registrar/', views.registrar, name='registrar'),
    path('verificar_email/', views.verificar_email, name='verificar_email'),
    path('reenviar_codigo/', views.reenviar_codigo, name='reenviar_codigo'),
    path('logar/', views.logar, name='logar'),
    path('sair/', views.sair, name='sair'),
    path('verificar-login/', views.verificar_login, name='verificar-login'),

    path('carrinho/', views.carrinho, name='carrinho'),
    path('carrinho/adicionar/<int:produto_id>/', views.adicionar_ao_carrinho, name='adicionar_ao_carrinho'),
    path('api/carrinho/', views.api_carrinho, name='api-carrinho'),
   
    path('buscar/', views.buscar, name='buscar'),
    path('categorias/', views.CategoriaList.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', views.CategoriaDetail.as_view(), name='categoria-detail'),
    path('produtos/', views.ProdutoList.as_view(), name='produto-list'),
    path('produtos/<int:pk>/', views.produto_detalhe, name='produto-detalhe'),
    path('api/produtos/<int:pk>/', views.ProdutoDetail.as_view(), name='produto-detail'),
    
    path('verificar-login/', views.verificar_login, name='verificar-login'),
    
    
]
