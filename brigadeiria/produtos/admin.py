from django.contrib import admin
from django.utils.html import format_html
from .models import Categoria, Produto
from .models import Banner, FotoGaleria


admin.site.register(Banner)
admin.site.register(FotoGaleria)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome')
    search_fields = ('nome',)


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

