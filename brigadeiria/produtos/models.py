from django.db import models

class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField()
    categoria = models.ForeignKey(Categoria, related_name='produtos', on_delete=models.CASCADE, null=True, blank=True)
    imagem = models.ImageField(upload_to = 'produtos/', blank = True, null = True)

    def __str__(self):
        return self.nome


class Banner(models.Model):
    imagem = models.ImageField(upload_to='banners/')
    titulo = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.titulo or f"Banner {self.id}"


class FotoGaleria(models.Model):
    imagem = models.ImageField(upload_to='galeria/')
    descricao = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.descricao or f"Foto {self.id}"