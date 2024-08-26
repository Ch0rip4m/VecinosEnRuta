from rest_framework import serializers
from .models import *

class UsuarioSerializer(serializers.ModelSerializer):
    nombre_rol = serializers.ListField(child=serializers.CharField(), write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['email', 'nombre_usuario', 'apellido_usuario', 'edad', 'telefono', 'sexo', 'imagen_perfil', 'descripcion_usuario', 'password', 'nombre_rol']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        roles_data = validated_data.pop('nombre_rol', [])
        user = Usuario.objects.create_user(**validated_data)
        user.assign_roles(roles_data)
        return user

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

class ComunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comuna
        field = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        field = '__all__'

class ComunaComunidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComunaComunidad
        field = '__all__'

class ComunaRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComunaRegion
        field = '__all__'
