from rest_framework import serializers 
from .models import Categoria, Produto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta 