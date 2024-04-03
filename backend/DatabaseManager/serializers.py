from rest_framework import serializers
from .models import *

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class ComunidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunidades
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculos
        fields = '__all__'

class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificaciones
        fields = '__all__'

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'

class RutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rutas
        fields = '__all__'

class DiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dias
        fields = '__all__'

class TrayectoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trayectoria
        fields = '__all__'

class RecepcionPasajeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecepcionPasajeros
        fields = '__all__'

class TrayectoriaRealSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrayectoriaReal
        fields = '__all__'

class RecepcionRealSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecepecionReal
        fields = '__all__'

class RutaEjecutadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RutasEjecutadas
        fields = '__all__'

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class RolUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolUsuario
        fields = '__all__'

class ComunidadUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComunidadesUsuario
        fields = '__all__'

class VehiculoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehiculoUsuario
        fields = '__all__'

class CategoriaCalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriasCalificacion
        fields = '__all__'

class DiasRutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiasRutas
        fields = '__all__'

class OrdenTrayectoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrayectoria
        fields = '__all__'

class OrdenTrayectoriaRealSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrayectoriaReal
        fields = '__all__'
