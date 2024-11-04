from rest_framework import serializers
from .models import *


class UsuarioSerializer(serializers.ModelSerializer):
    nombre_rol = serializers.ListField(child=serializers.CharField(), write_only=True)
    comuna = serializers.ListField(child=serializers.CharField(), write_only=True)

    class Meta:
        model = Usuario
        fields = [
            "id_usuario",
            "email",
            "nombre_usuario",
            "apellido_usuario",
            "edad",
            "telefono",
            "sexo",
            "imagen_perfil",
            "descripcion_usuario",
            "password",
            "nombre_rol",
            "comuna",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        roles_data = validated_data.pop("nombre_rol", [])
        comuna_data = validated_data.pop("comuna", [])
        user = Usuario.objects.create_user(**validated_data)
        user.assign_roles(roles_data)
        user.assign_location(comuna_data)
        return user

    def update(self, instance, validated_data):
        roles_data = validated_data.pop("nombre_rol", None)
        comuna_data = validated_data.pop("comuna", [])
        instance.email = validated_data.get("email", instance.email)
        instance.nombre_usuario = validated_data.get(
            "nombre_usuario", instance.nombre_usuario
        )
        instance.apellido_usuario = validated_data.get(
            "apellido_usuario", instance.apellido_usuario
        )
        instance.edad = validated_data.get("edad", instance.edad)
        instance.telefono = validated_data.get("telefono", instance.telefono)
        instance.sexo = validated_data.get("sexo", instance.sexo)
        instance.descripcion_usuario = validated_data.get(
            "descripcion_usuario", instance.descripcion_usuario
        )
        instance.imagen_perfil = validated_data.get(
            "imagen_perfil", instance.imagen_perfil
        )
        if validated_data.get("password"):
            instance.set_password(validated_data.get("password"))
        instance.save()

        if roles_data:
            instance.assign_roles(roles_data)

        if comuna_data:
            instance.assign_location(comuna_data)

        return instance


class ComunidadSerializer(serializers.ModelSerializer):
    nombre_comuna = serializers.CharField(write_only=True)
    comunas = serializers.SerializerMethodField()

    class Meta:
        model = Comunidades
        fields = "__all__"

    def create(self, validated_data):
        nombre_comuna = validated_data.pop("nombre_comuna", None)
        comunidad = Comunidades.objects.create(**validated_data)
        request = self.context["request"]
        id_usuario = request.data.get("id_usuario")

        if nombre_comuna and id_usuario:
            try:
                comuna = Comuna.objects.get(nombre_comuna=nombre_comuna)
                usuario = Usuario.objects.get(id_usuario=id_usuario)
                ComunaComunidad.objects.create(id_comunidad=comunidad, id_comuna=comuna)
                ComunidadesUsuario.objects.create(
                    id_usuario=usuario, id_comunidad=comunidad
                )
                MiembrosComunidad.objects.create(id_comunidad=comunidad, id_miembro=usuario)
            except Comuna.DoesNotExist or Usuario.DoesNotExist:
                raise serializers.ValidationError(
                    f"La comuna {nombre_comuna} no existe"
                )

        return comunidad

    def get_comunas(self, obj):
        # Obtener las comunas asociadas a la comunidad a través de la tabla intermedia
        comunas = ComunaComunidad.objects.filter(
            id_comunidad=obj.id_comunidad
        ).values_list("id_comuna__nombre_comuna", flat=True)
        return list(comunas)


class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculos
        fields = "__all__"

    def create(self, validated_data):
        request = self.context["request"]
        id_usuario = request.data.get("id_usuario")
        vehiculo = Vehiculos.objects.create(**validated_data)

        if id_usuario:
            try:
                usuario = Usuario.objects.get(id_usuario=id_usuario)
                VehiculoUsuario.objects.create(id_vehiculo=vehiculo, id_usuario=usuario)
            except Comuna.DoesNotExist:
                raise serializers.ValidationError(f"El usuario {id_usuario} no existe")

        return vehiculo


class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificaciones
        fields = "__all__"


class RutaSerializer(serializers.ModelSerializer):
    dias = serializers.SerializerMethodField()
    cupos = serializers.SerializerMethodField()

    class Meta:
        model = Rutas
        fields = [
            "id_ruta",
            "id_vehiculo",
            "id_conductor",
            "nombre_ruta",
            "origen",
            "destino",
            "dias",
            "hora_salida",
            "cupos",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        id_usuario = request.data.get("id_conductor")
        id_vehiculo = request.data.get("id_vehiculo")
        nombre_dia = request.data.get("nombre_dia")
        trayectoria_data = request.data.get("trayectoria", [])

        if id_usuario and id_vehiculo and nombre_dia:
            try:
                usuario = Usuario.objects.get(id_usuario=id_usuario)
                print("id_usuario: ", usuario)
                vehiculo = Vehiculos.objects.get(id_vehiculo=id_vehiculo)
                print("id_vehiculo: ", vehiculo)
                ruta = Rutas.objects.create(
                    **validated_data, cupos=vehiculo.nro_asientos_disp
                )
                ruta.assign_days(nombre_dia)
                trayectoria = Trayectoria.objects.create(id_ruta=ruta)

                for i, punto in enumerate(trayectoria_data):
                    OrdenTrayectoria.objects.create(
                        id_trayectoria=trayectoria,
                        orden=i + 1,
                        latitud=punto.get("latitud"),
                        longitud=punto.get("longitud"),
                    )

            except Vehiculos.DoesNotExist or Usuario.DoesNotExist:
                raise serializers.ValidationError(
                    f"El id {id_usuario} y {id_vehiculo} no existe"
                )

        return ruta

    def get_dias(self, obj):
        # Obtener los días asociados a la ruta a través de la tabla intermedia
        dias_rutas = DiasRutas.objects.filter(id_ruta=obj.id_ruta).values_list(
            "id_dia__nombre_dia", flat=True
        )
        return list(dias_rutas)

    def get_cupos(self, obj):
        # Devuelve el valor de cupos desde el objeto de la ruta
        return obj.cupos


class DiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dias
        fields = "__all__"


class TrayectoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trayectoria
        fields = "__all__"


class RecepcionPasajeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecepcionPasajeros
        fields = "__all__"


class TrayectoriaRealSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrayectoriaReal
        fields = "__all__"


class RecepcionRealSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecepecionReal
        fields = "__all__"


class RutaEjecutadaSerializer(serializers.ModelSerializer):
    id_ruta = RutaSerializer()
    
    class Meta:
        model = RutasEjecutadas
        fields = "__all__"


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = "__all__"


class RolUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolUsuario
        fields = "__all__"


class ComunidadUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComunidadesUsuario
        fields = "__all__"


class VehiculoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehiculoUsuario
        fields = "__all__"


class CategoriaCalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriasCalificacion
        fields = "__all__"


class DiasRutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiasRutas
        fields = "__all__"


class OrdenTrayectoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrayectoria
        fields = "__all__"


class OrdenTrayectoriaRealSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenTrayectoriaReal
        fields = "__all__"


class ComunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comuna
        fields = "__all__"


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = "__all__"


class ComunaComunidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComunaComunidad
        fields = "__all__"


class ComunaRegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComunaRegion
        fields = "__all__"


class ComunaUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComunaUsuario
        fields = "__all__"


class ContactosEmergenciaSerializer(serializers.ModelSerializer):
    correo_emergencia = serializers.CharField()

    class Meta:
        model = ContactosEmergencia
        fields = "__all__"

    def create(self, validated_data):
        request = self.context["request"]
        id_usuario = request.data.get("id_usuario")
        contactos = validated_data.get("correo_emergencia")

        if id_usuario and contactos:
            try:
                usuario = Usuario.objects.get(id_usuario=id_usuario)

                for correo in contactos:
                    ContactosEmergencia.objects.create(
                        id_usuario=usuario, correo_emergencia=correo
                    )

            except Usuario.DoesNotExist:
                raise serializers.ValidationError(f"El id {id_usuario} no existe")

        return validated_data

    def validate_correo_emergencia(self, value):
        """
        Validar que el valor sea una lista de correos separados por comas y no exceda la longitud permitida.
        """
        correos = [correo.strip() for correo in value.split(",")]

        for correo in correos:
            if len(correo) > 50:
                raise serializers.ValidationError(
                    f"El correo '{correo}' excede los 50 caracteres permitidos."
                )

        return correos


class NotificacionesSerializer(serializers.ModelSerializer):
    id_solicitante = UsuarioSerializer()
    id_ruta = RutaSerializer()
    id_comunidad = ComunidadSerializer()

    class Meta:
        model = Notificaciones
        fields = "__all__"

class MiembrosComunidadSerializer(serializers.ModelSerializer):
    id_miembro = UsuarioSerializer()
    
    class Meta:
        model = MiembrosComunidad
        fields = "__all__"
        
class MiembrosRutaSerializer(serializers.ModelSerializer):
    id_miembro = UsuarioSerializer()
    class Meta:
        model = MiembrosRuta
        fields = "__all__"
        
class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = "__all__"