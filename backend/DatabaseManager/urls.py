from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'comunidades', ComunidadViewSet, basename='comunidades')
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculos')
router.register(r'calificaciones', CalificacionViewSet, basename='calificaciones')
router.register(r'chats', ChatViewSet, basename='chats')
router.register(r'rutas', RutasViewSet, basename='rutas')
router.register(r'dias', DiaViewSet, basename='dias')
router.register(r'trayectorias', TrayectoriaViewSet, basename='trayectorias')
router.register(r'recepcion', RecepcionPasajerosViewSet, basename='recepcion')
router.register(r'trayectoria-real', TrayectoriaRealViewSet, basename='trayectorias-reales')
router.register(r'recepcion-real', RecepcionRealViewSet, basename='recepciones-reales')
router.register(r'rutas-ejecutadas', RutaEjecutadaViewSet, basename='rutas-ejecutadas')
router.register(r'roles', RolViewSet, basename='roles')
router.register(r'rol-usuario', RolUsuarioViewSet, basename='rol-usuario')
router.register(r'comunidad-usuario', ComunidadUsuarioViewSet, basename='comunidad-usuario')
router.register(r'vehiculo-usuario', VehiculoUsuarioViewSet, basename='vehiculo-usuario')
router.register(r'categoria-calificaciones', CategoriaCalificacionViewSet, basename='categoria-calificaciones')
router.register(r'dias-rutas', DiasRutaViewSet, basename='dias-rutas')
router.register(r'orden-trayectorias', OrdenTrayectoriaViewSet, basename='orden-trayectorias')
router.register(r'orden-trayectorias-reales', OrdenTrayectoriaRealViewSet, basename='orden-trayectorias-reales')
router.register(r'comunas', ComunaViewSet, basename='comunas')
router.register(r'regiones', RegionViewSet, basename='regiones')
router.register(r'comuna-region', ComunaRegionViewSet, basename='comuna-region')
router.register(r'comuna-comunidad', ComunaComunidadViewSet, basename='comuna-comunidad')


urlpatterns = [
    path("", include(router.urls)),
    path('usuarios/email/<str:email>/', info_usuario, name='info_usuario')
] 