from django.urls import path
from . import views

urlpatterns = [
    # ===================== PÁGINAS PRINCIPAIS =====================
    path('', views.index, name='index'),
    path('cardapio/', views.cardapio, name='cardapio'),

    # ===================== PERFIL / AUTENTICAÇÃO =====================
    path('perfil/', views.perfil, name='perfil'),
    path('registrar/', views.registrar, name='registrar'),
    path('verificar_email/', views.verificar_email, name='verificar_email'),
    path('reenviar_codigo/', views.reenviar_codigo, name='reenviar_codigo'),
    path('logar/', views.logar, name='logar'),
    path('sair/', views.sair, name='sair'),
    path('verificar-login/', views.verificar_login, name='verificar-login'),
    path('atualizar-perfil/', views.atualizar_perfil, name='atualizar_perfil'),
    path('excluir-conta/', views.excluir_conta, name='excluir_conta'),

    # ===================== CARRINHO =====================
    path('carrinho/', views.carrinho, name='carrinho'),
    path('carrinho/adicionar/<int:produto_id>/', views.adicionar_ao_carrinho, name='adicionar_ao_carrinho'),
    path('api/carrinho/', views.api_carrinho, name='api-carrinho'),

    # ===================== BUSCA =====================
    path('buscar/', views.buscar, name='buscar'),

    # ===================== API REST =====================
    path('categorias/', views.CategoriaList.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', views.CategoriaDetail.as_view(), name='categoria-detail'),

    # API de produtos
    path('api/produtos/', views.ProdutoList.as_view(), name='produto-list'),
    path('api/produtos/<int:pk>/', views.ProdutoDetail.as_view(), name='produto-detail'),

    # ===================== PÁGINAS DE PRODUTO =====================
    # Esta URL é a página normal do produto, com a view 'produto_detalhe'
    path('produtos/<int:pk>/', views.produto_detalhe, name='produto-detalhe'),

    path('api/check-auth/', views.check_auth, name='check_auth'),
]
