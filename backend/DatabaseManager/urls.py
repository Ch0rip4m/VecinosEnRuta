from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r"usuarios", UsuarioViewSet, basename="usuarios")
router.register(r"comunidades", ComunidadViewSet, basename="comunidades")
router.register(r"vehiculos", VehiculoViewSet, basename="vehiculos")
router.register(r"calificaciones", CalificacionViewSet, basename="calificaciones")
router.register(r"rutas", RutasViewSet, basename="rutas")
router.register(r"dias", DiaViewSet, basename="dias")
router.register(r"trayectorias", TrayectoriaViewSet, basename="trayectorias")
router.register(r"recepcion", RecepcionPasajerosViewSet, basename="recepcion")
router.register(
    r"trayectoria-real", TrayectoriaRealViewSet, basename="trayectorias-reales"
)
router.register(r"recepcion-real", RecepcionRealViewSet, basename="recepciones-reales")
router.register(r"rutas-ejecutadas", RutaEjecutadaViewSet, basename="rutas-ejecutadas")
router.register(r"roles", RolViewSet, basename="roles")
router.register(r"rol-usuario", RolUsuarioViewSet, basename="rol-usuario")
router.register(
    r"comunidad-usuario", ComunidadUsuarioViewSet, basename="comunidad-usuario"
)
router.register(
    r"vehiculo-usuario", VehiculoUsuarioViewSet, basename="vehiculo-usuario"
)
router.register(
    r"categoria-calificaciones",
    CategoriaCalificacionViewSet,
    basename="categoria-calificaciones",
)
router.register(r"dias-rutas", DiasRutaViewSet, basename="dias-rutas")
router.register(
    r"orden-trayectorias", OrdenTrayectoriaViewSet, basename="orden-trayectorias"
)
router.register(
    r"orden-trayectorias-reales",
    OrdenTrayectoriaRealViewSet,
    basename="orden-trayectorias-reales",
)
router.register(r"comunas", ComunaViewSet, basename="comunas")
router.register(r"regiones", RegionViewSet, basename="regiones")
router.register(r"comuna-region", ComunaRegionViewSet, basename="comuna-region")
router.register(
    r"comuna-comunidad", ComunaComunidadViewSet, basename="comuna-comunidad"
)
router.register(
    r"contactos-emergencia", ContactosEmergeciaViewSet, basename="contactos-emergencia"
)
router.register(r"notificaciones", NotificacionesViewSet, basename="notificaciones")


urlpatterns = [
    path("", include(router.urls)),
    path("usuarios/email/<str:email>/", info_usuario, name="info_usuario"),
    path("buscar-rutas/", buscar_rutas, name="buscar_rutas"),
    path("solicitar-unirse/", solicitar_unirse, name="solicitar_unirse_ruta"),
    path(
        "mostrar-solicitudes/<int:id_usuario>/",
        mostrar_solicitudes,
        name="mostrar_solicitudes",
    ),
    path(
        "mostrar-viajes/<int:id_usuario>/",
        mostrar_viajes,
        name="mostrar_viajes",
    ),
    path(
        "mostrar-viajes-ejecutados/<int:id_usuario>/",
        mostrar_viajes_ejecutados,
        name="mostrar_viajes_ejecutados",
    ),
    path("mostrar-comunidades/", mostrar_comunidades, name="mostrar_comunidades"),
    path("mostrar-ruta/", mostrar_ruta, name="mostrar_ruta"),
    path(
        "aceptar_solicitud_ruta/", aceptar_solicitud_ruta, name="aceptar_solicitud_ruta"
    ),
    path(
        "aceptar_solicitud_comunidad/",
        aceptar_solicitud_comunidad,
        name="aceptar_solicitud_comunidad",
    ),
    path("iniciar-ruta/", iniciar_ruta, name="iniciar_ruta"),
    path("contactos-usuario/", contactos_usuario, name="contactos_usuario"),
    path("boton-de-panico/", boton_de_panico, name="boton_de_panico"),
    path("compartir-ubicacion/", compartir_ubicacion, name="compartir_ubicacion"),
    path("obtener-ubicacion/", obtener_ubicacion, name="obtener_ubucacion"),
]
