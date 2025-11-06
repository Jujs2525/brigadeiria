from django.db import models
from django.contrib.auth.models import User


# ==========================
#   CATEGORIA
# ==========================
class Categoria(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome


# ==========================
#   PRODUTO
# ==========================
class Produto(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField(blank=True)
    categoria = models.ForeignKey(
        Categoria,
        related_name='produtos',
        on_delete=models.SET_NULL,  # Evita perder o produto se a categoria for deletada
        null=True,
        blank=True
    )
    imagem = models.ImageField(upload_to='produtos/', blank=True, null=True)

    def __str__(self):
        return self.nome


# ==========================
#   BANNER
# ==========================
class Banner(models.Model):
    imagem = models.ImageField(upload_to='banners/')
    titulo = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.titulo or f"Banner {self.id}"


# ==========================
#   GALERIA DE FOTOS
# ==========================
class FotoGaleria(models.Model):
    imagem = models.ImageField(upload_to='galeria/')
    descricao = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.descricao or f"Foto {self.id}"


# ==========================
#   CARRINHO
# ==========================
class Carrinho(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    preco_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        editable=False,
        default=0
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """Garante que o preço do produto é salvo no momento da compra"""
        if not self.preco_unitario:
            self.preco_unitario = self.produto.preco
        super().save(*args, **kwargs)

    def subtotal(self):
        return self.preco_unitario * self.quantidade

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome} ({self.usuario.username})"

# ==========================
#   CARRINHO TEMPORÁRIO (JSON)
# ==========================
class CarrinhoTemporario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='carrinho_temporario')
    dados = models.JSONField(default=list)  # Aqui salvamos o conteúdo do carrinho (JSON)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Carrinho de {self.usuario.username}"
