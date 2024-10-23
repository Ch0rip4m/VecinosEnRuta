from rest_framework import viewsets
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
# Create your views here.

class RegistroUsuarioView(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            nombre_usuario = serializer.validated_data.get('nombre_usuario', '')
            apellido_usuario = serializer.validated_data.get('apellido_usuario', '')
            edad = serializer.validated_data.get('edad', '')
            telefono = serializer.validated_data.get('telefono', '')
            sexo = serializer.validated_data.get('sexo', '')
            descripcion_usuario = serializer.validated_data.get('descripcion_usuario', '')
            imagen_perfil = serializer.validated_data.get('imagen_perfil', None)
            nombre_rol = serializer.validated_data.get('nombre_rol', [])
            comuna = serializer.validated_data.get('comuna', [])

            user = Usuario.objects.create_user(
                email=email,
                nombre_usuario=nombre_usuario,
                apellido_usuario=apellido_usuario,
                password=password,
                edad=edad,
                telefono=telefono,
                sexo=sexo,
                descripcion_usuario=descripcion_usuario,
                imagen_perfil=imagen_perfil
            )
            rol_list = nombre_rol[0].split(',')
            location = comuna[0].split(',')
            print(rol_list)
            print(location)
            user.assign_roles(rol_list)
            user.assign_location(location)

            return Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioViewSet(viewsets.ViewSet):
    def create(self, request):
        registro_view = RegistroUsuarioView()
        return registro_view.post(request)

    def list(self, request):
        queryset = Usuario.objects.all()
        serializer = UsuarioSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Usuario.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UsuarioSerializer(user)
        return Response(serializer.data)

    def update(self, request, pk=None):
        usuario = Usuario.objects.get(pk=pk)
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        usuario = Usuario.objects.get(pk=pk)
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class ComunidadViewSet(viewsets.ModelViewSet):
    queryset = Comunidades.objects.all()
    serializer_class = ComunidadSerializer
        
class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculos.objects.all()
    serializer_class = VehiculoSerializer
    
class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificaciones.objects.all()
    serializer_class = CalificacionSerializer 

class RutasViewSet(viewsets.ModelViewSet):
    queryset = Rutas.objects.all()
    serializer_class = RutaSerializer

class DiaViewSet(viewsets.ModelViewSet):
    queryset = Dias.objects.all()
    serializer_class = DiaSerializer
    
class TrayectoriaViewSet(viewsets.ModelViewSet):
    queryset = Trayectoria.objects.all()
    serializer_class = TrayectoriaSerializer
    
class RecepcionPasajerosViewSet(viewsets.ModelViewSet):
    queryset = RecepcionPasajeros.objects.all()
    serializer_class = RecepcionPasajeroSerializer
    
class TrayectoriaRealViewSet(viewsets.ModelViewSet):
    queryset = TrayectoriaReal.objects.all()
    serializer_class = TrayectoriaRealSerializer
    
class RecepcionRealViewSet(viewsets.ModelViewSet):
    queryset = RecepecionReal.objects.all()
    serializer_class = RecepcionRealSerializer
    
class RutaEjecutadaViewSet(viewsets.ModelViewSet):
    queryset = RutasEjecutadas.objects.all()
    serializer_class = RutaEjecutadaSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolSerializer

class RolUsuarioViewSet(viewsets.ModelViewSet):
    queryset = RolUsuario.objects.all()
    serializer_class = RolUsuarioSerializer
    
class ComunidadUsuarioViewSet(viewsets.ModelViewSet):
    queryset = ComunidadesUsuario.objects.all()
    serializer_class = ComunidadUsuarioSerializer
    
class VehiculoUsuarioViewSet(viewsets.ModelViewSet):
    queryset = VehiculoUsuario.objects.all()
    serializer_class = VehiculoUsuarioSerializer
    
class CategoriaCalificacionViewSet(viewsets.ModelViewSet):
    queryset = CategoriasCalificacion.objects.all()
    serializer_class = CategoriaCalificacionSerializer

class DiasRutaViewSet(viewsets.ModelViewSet):
    queryset = DiasRutas.objects.all()
    serializer_class = DiasRutaSerializer

class OrdenTrayectoriaViewSet(viewsets.ModelViewSet):
    queryset = OrdenTrayectoria.objects.all()
    serializer_class = OrdenTrayectoriaSerializer
    
class OrdenTrayectoriaRealViewSet(viewsets.ModelViewSet):
    queryset = OrdenTrayectoriaReal.objects.all()
    serializer_class = OrdenTrayectoriaRealSerializer

class ComunaViewSet(viewsets.ModelViewSet):
    queryset = Comuna.objects.all()
    serializer_class = ComunaSerializer
    
class RegionViewSet(viewsets.ModelViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class ComunaRegionViewSet(viewsets.ModelViewSet):
    queryset = ComunaRegion
    serializer_class = ComunaRegionSerializer
    
class ComunaComunidadViewSet(viewsets.ModelViewSet):
    queryset = ComunaComunidad
    serializer_class = ComunaComunidadSerializer
    
class ComunaUsuarioViewSet(viewsets.ModelViewSet):
    queryset = ComunaUsuario
    serializer_class = ComunaUsuarioSerializer

class ContactosEmergeciaViewSet(viewsets.ModelViewSet):
    queryset = ContactosEmergencia
    serializer_class = ContactosEmergenciaSerializer
    
class NotificacionesViewSet(viewsets.ModelViewSet):
    queryset = Notificaciones.objects.all()
    serializer_class = NotificacionesSerializer
    
@api_view(['GET'])
def info_usuario(request, email):
    try:
        usuario = get_object_or_404(Usuario, email=email)
        serializer = UsuarioSerializer(usuario)
        #print(serializer)
        roles = usuario.rolusuario_set.values_list('id_rol__nombre_rol', flat=True)
        roles = list(roles)
        #print(roles)
        
        comunidad_usuario = ComunidadesUsuario.objects.filter(id_usuario=usuario)
        comunidad_serializer = ComunidadSerializer([com.id_comunidad for com in comunidad_usuario], many=True)
        #print(comunidad)
        
        vehiculo_usuario = VehiculoUsuario.objects.filter(id_usuario=usuario).first()
        vehiculo = None
        if vehiculo_usuario:
            vehiculo = vehiculo_usuario.id_vehiculo
            vehiculo_serializer = VehiculoSerializer(vehiculo).data
            
        rutas = Rutas.objects.filter(id_conductor=usuario)
        rutas_serializer = RutaSerializer(rutas, many=True)
        
        data = {
            'usuario': serializer.data,
            'roles': roles,
        }

        # Añadir condicionalmente los campos si existen
        if comunidad_usuario:
            data['comunidad'] = comunidad_serializer.data
        if vehiculo:
            data['vehiculo'] = vehiculo_serializer
        if rutas:
            data['rutas'] = rutas_serializer.data

        return Response(data)
    except Usuario.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def buscar_rutas(request):
    id_usuario = request.query_params.get('id_usuario')
    origen = request.query_params.get('origen')
    destino = request.query_params.get('destino')

    # Filtra las rutas basadas en el origen y destino
    rutas = Rutas.objects.filter(origen=origen, destino=destino) \
                         .exclude(id_conductor=id_usuario) \
                         .exclude(cupos=0)
    print(rutas)
    serializer = RutaSerializer(rutas, many=True)
    print(serializer.data)

    return Response(serializer.data)

@api_view(['POST'])
def solicitar_unirse_ruta(request):
    id_ruta = request.query_params.get('id_ruta')
    id_comunidad = request.query_params.get('id_comunidad')
    id_solicitante = request.query_params.get('id_solicitante')
    try:
        if id_ruta:
            ruta = Rutas.objects.get(id_ruta=id_ruta)
            usuario_propietario = ruta.id_conductor
            usuario_solicitante = Usuario.objects.get(id_usuario=id_solicitante)
        
            Notificaciones.objects.create(id_propietario=usuario_propietario, id_solicitante=usuario_solicitante, id_ruta=ruta, es_ruta=True)
        
        if id_comunidad:
            comunidad = Comunidades.objects.get(id_comunidad=id_comunidad)
            comunidad_usuario = ComunidadesUsuario.objects.get(id_comunidad=id_comunidad)
            usuario_propietario=comunidad_usuario.id_usuario
            usuario_solicitante = Usuario.objects.get(id_usuario=id_solicitante)
        
            Notificaciones.objects.create(id_propietario=usuario_propietario, id_solicitante=usuario_solicitante, id_comunidad=comunidad, es_comunidad=True)
        
        return Response({"detail": "Solicitud enviada y notificación creada."}, status=status.HTTP_200_OK)
    except Rutas.DoesNotExist or Comunidades.DoesNotExist:
        return Response({"detail": "Ruta o Comunidad no encontrada."}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def mostrar_solicitudes(request, id_usuario):
    try:
        usuario_propietario = Usuario.objects.get(id_usuario=id_usuario)
        
        solicitudes = Notificaciones.objects.filter(id_propietario=usuario_propietario).select_related('id_ruta', 'id_solicitante')
        solicitudes_serializer = NotificacionesSerializer(solicitudes, many=True)
        
        return Response(solicitudes_serializer.data)
    except Usuario.DoesNotExist:
        return Response({'detail' : 'usuario no encontrado. '}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(['GET'])
def mostrar_comunidades(request):
    id_usuario = request.query_params.get('id_usuario')

    # Filtra las rutas basadas en el origen y destino
    comunidades_usuario = ComunidadesUsuario.objects.filter(id_usuario=id_usuario).values('id_comunidad') 
    comunidades = Comunidades.objects.exclude(id_comunidad__in=comunidades_usuario)   
    serializer = ComunidadSerializer(comunidades, many=True)

    return Response(serializer.data)

@api_view(['POST'])
def aceptar_solicitud_ruta(request):
        id_ruta = request.query_params.get("id_ruta")
        # Obtener la ruta por su ID
        ruta = Rutas.objects.get(id_ruta=id_ruta)
        solicitud_id = request.query_params.get("id_solicitud")
        
        try:
            # Obtener la notificación correspondiente
            notificacion = Notificaciones.objects.get(id_notificacion=solicitud_id)
            
            # Verificar que la notificación corresponde a la ruta
            if notificacion.id_ruta != ruta:
                return Response({"error": "La solicitud no corresponde a esta ruta."}, status=status.HTTP_400_BAD_REQUEST)

            # Verificar si hay cupos disponibles
            if ruta.cupos > 0:
                # Aceptar la solicitud
                notificacion.aceptada = True
                notificacion.save()
                
                # Reducir los cupos disponibles
                ruta.cupos -= 1
                ruta.save()

                return Response({"message": "Solicitud aceptada."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No hay cupos disponibles para esta ruta."}, status=status.HTTP_400_BAD_REQUEST)

        except ObjectDoesNotExist:
            return Response({"error": "La notificación no existe."}, status=status.HTTP_404_NOT_FOUND)