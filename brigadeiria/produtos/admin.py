from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import Perfil, User, Produto, Categoria, Banner, FotoGaleria

# Registra os modelos no admin
admin.site.register(Banner)
admin.site.register(FotoGaleria)

# Registra o modelo Categoria no admin
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')
    search_fields = ('nome',)

# Registra o modelo Produto no admin
@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'preco', 'categoria', 'mostrar_imagem')
    list_filter = ('categoria',)
    search_fields = ('nome', 'descricao')

    def mostrar_imagem(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" width="50" style="border-radius:5px;" />', obj.imagem.url)
        return "Sem imagem"

    mostrar_imagem.short_description = 'Preview'

# =====================
# Custom User Admin
# =====================

# Inline do Perfil para ser mostrado dentro da página de usuário
class PerfilInline(admin.StackedInline):  # Pode usar StackedInline ou TabularInline
    model = Perfil
    can_delete = False
    verbose_name_plural = 'Perfil'

# Customizando a exibição do User
class CustomUserAdmin(UserAdmin):
    inlines = (PerfilInline,)  # Adiciona o perfil dentro da edição do usuário

    # Para mostrar alguns campos do perfil diretamente
    def get_list_display(self, request):
        return (
            'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff',
            'is_superuser', 'date_joined', 'last_login', 'telefone', 'cep', 'endereco', 'numero'
        )

    def telefone(self, obj):
        return obj.perfil.telefone if obj.perfil else 'Não informado'

    def cep(self, obj):
        return obj.perfil.cep if obj.perfil else 'Não informado'

    def endereco(self, obj):
        return obj.perfil.endereco if obj.perfil else 'Não informado'

    def numero(self, obj):
        return obj.perfil.numero if obj.perfil else 'Não informado'

# Remover o registro padrão do User e adicionar o User customizado
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
