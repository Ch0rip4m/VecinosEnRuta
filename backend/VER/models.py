from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.

# INTERACCIÓN DE USUARIOS

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True, verbose_name='ID del usuario')
    nombre_usuario = models.CharField(max_length=100, verbose_name='Nombre del usuario')
    apellido_usuario = models.CharField(max_length=100, verbose_name='Apellido del usuario')
    edad = models.CharField(max_length=30, verbose_name='Edad del usuario', default='')
    sexo = models.CharField(max_length=30, verbose_name='Sexo del usuario', default='')
    email = models.EmailField(max_length=100, verbose_name='Correo electronico', default='')
    clave = models.CharField(max_length=50, verbose_name='Password')
    telefono = models.CharField(max_length=12, verbose_name='Telefono del usuario')
    descripcion_usuario = models.TextField(max_length=500, verbose_name='Descripcion del usuario')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
class Comunidades(models.Model):
    id_comunidad = models.AutoField(primary_key=True, verbose_name='ID de la comunidad')
    nombre_comunidad = models.CharField(max_length=100, verbose_name='Nombre de la comunidad')
    comuna = models.CharField(max_length=50, verbose_name='Nombre de la comuna')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')
    
    class Meta:
        verbose_name = 'Comunidad'
        verbose_name_plural = 'Comunidades'
    
class ComunidadesUsuario(models.Model):
    id_usuario = models.ForeignKey(Usuario, to_field='id_usuario',on_delete=models.CASCADE, verbose_name='ID del usuario')
    id_comunidad = models.ForeignKey(Comunidades, to_field='id_comunidad', on_delete=models.CASCADE, verbose_name='ID de la comunidad')

    class Meta:
        verbose_name = 'ComunidadesUsuario'
        verbose_name_plural = 'ComunidadesUsuarios'
        
class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True, verbose_name='ID del rol')
    nombre_rol = models.CharField(max_length=30, verbose_name='Nombre del rol')
    
    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

class RolUsuario(models.Model):
    id_usuario = models.ForeignKey(Usuario, to_field='id_usuario',on_delete=models.CASCADE, verbose_name='ID del usuario')
    id_rol = models.ForeignKey(Roles, to_field='id_rol', on_delete=models.CASCADE, verbose_name='ID del rol')
    
    class Meta:
        verbose_name = 'RolUsuario'
        verbose_name_plural = 'RolUsuarios'
    
class Vehiculos(models.Model):
    id_vehiculo = models.AutoField(primary_key=True, verbose_name='ID del vehiculo')
    marca_vehiculo = models.CharField(max_length=50, verbose_name='Marca del vehiculo')
    modelo_vehiculo = models.CharField(max_length=50, verbose_name='Modelo del vehiculo')
    tipo_de_vehiculo = models.CharField(max_length=50, verbose_name='Tipo de vehiculo')
    nro_asientos_disp = models.IntegerField(verbose_name='Numero de asientos disponibles')
    color_vehiculo = models.CharField(max_length=20, verbose_name='Color del vehiculo')
    patente = models.CharField(max_length=10, verbose_name='Patente del vehiculo')
    ano_vehiculo = models.CharField(max_length=4, verbose_name='Año del vehiculo')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')
    
    class Meta:
        verbose_name = 'Vehiculo'
        verbose_name_plural = 'Vehiculos'
    
class VehiculoUsuario(models.Model):
    id_usuario = models.ForeignKey(Usuario, to_field='id_usuario',on_delete=models.CASCADE, verbose_name='ID del usuario')
    id_vehiculo = models.ForeignKey(Vehiculos, to_field='id_vehiculo', on_delete=models.CASCADE, verbose_name='ID del vehiculo')

    class Meta:
        verbose_name = 'VehiculoUsuario'
        verbose_name_plural = 'VehiculoUsuarios'
        
class Calificaciones(models.Model):
    id_calificacion = models.AutoField(primary_key=True, verbose_name='ID de la calificacion')
    id_calificador = models.ForeignKey(Usuario, to_field='id_usuario', related_name='calficacion_realizada', on_delete=models.CASCADE, verbose_name='ID del usuario calificador')
    id_calificado = models.ForeignKey(Usuario, to_field='id_usuario', related_name='calficacion_recibida', on_delete=models.CASCADE, verbose_name='ID del usuario calificado')
    comentario = models.TextField(max_length=500, verbose_name='Comentarios de la calificacion')
    fecha_calificacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de la calificacion')
    
    class Meta:
        verbose_name = 'Calificacion'
        verbose_name_plural = 'Calificaciones'
    
class CategoriasCalificacion(models.Model):
    id_calificador = models.ForeignKey(Calificaciones, to_field='id_calificacion', on_delete=models.CASCADE, verbose_name='ID de la calificacion')
    seguridad = models.IntegerField(verbose_name='Seguridad del viaje')
    limpieza = models.IntegerField(verbose_name='Limpieza del vehiculo')
    comodidad = models.IntegerField(verbose_name='Comodidad del viaje')
    puntualidad = models.IntegerField(verbose_name='Puntualidad del conductor')
    
    class Meta:
        verbose_name = 'Categoriascalificacion'
        verbose_name_plural = 'CategoriasCalificaciones'
    
class Chat(models.Model):
    id_mensaje = models.AutoField(primary_key=True, verbose_name='ID del mensaje')
    id_emisor = models.ForeignKey(Usuario, to_field='id_usuario', related_name='mensaje_enviado', on_delete=models.CASCADE, verbose_name='ID del usuario emisor')
    id_receptor = models.ForeignKey(Usuario, to_field='id_usuario', related_name='mensaje_recibido', on_delete=models.CASCADE, verbose_name='ID del usuario receptor')
    mensaje = models.TextField(verbose_name='Contenido del mensaje')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='marca de tiempo del mensaje')
    
    class Meta:
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'

# PLANIFICACIÓN
   
class Rutas(models.Model):
    id_ruta = models.AutoField(primary_key=True, verbose_name='ID de la ruta')
    id_vehiculo = models.ForeignKey(Vehiculos, to_field='id_vehiculo', on_delete=models.CASCADE, verbose_name='ID del vehiculo')
    id_conductor = models.ForeignKey(Usuario, to_field='id_usuario', on_delete=models.CASCADE, verbose_name='ID del conductor')
    nombre_ruta = models.CharField(max_length=50, verbose_name='Nombre de la ruta')
    origen = models.CharField(max_length=30, verbose_name='Origen de la ruta')
    destino = models.CharField(max_length=30, verbose_name='Destino de la ruta')
    hora_salida = models.CharField(max_length=10, verbose_name='Hora de salida de la ruta')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creacion de ruta')
    
    class Meta:
        verbose_name = 'Ruta'
        verbose_name_plural = 'Rutas'
    
class Dias(models.Model):
    id_dia = models.AutoField(primary_key=True, verbose_name='ID del dia de la semana')
    nombre_dia = models.CharField(max_length=10, verbose_name='Nombre el dia de la semana')
    
    class Meta:
        verbose_name = 'Dia'
        verbose_name_plural = 'Dias'
    
class DiasRutas(models.Model):
    id_dia = models.ForeignKey(Dias, to_field='id_dia', on_delete=models.CASCADE, verbose_name='ID del dia de la semana')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')

    class Meta:
        verbose_name = 'DiasRuta'
        verbose_name_plural = 'DiasRutas'
        
class Trayectoria(models.Model):
    id_trayectoria = models.AutoField(primary_key=True, verbose_name='ID de la trayectoria')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creacion de trayectoria')   

    class Meta:
        verbose_name = 'Trayectoria'
        verbose_name_plural = 'Trayectorias'
         
class OrdenTrayectoria(models.Model):
    id_trayectoria = models.ForeignKey(Trayectoria, to_field='id_trayectoria', on_delete=models.CASCADE, verbose_name='ID de la trayectoria')
    orden = models.IntegerField(verbose_name='Orden de la trayectoria')
    latitud = models.FloatField(verbose_name='Latitud')
    longitud = models.FloatField(verbose_name='Longitud')
    
    class Meta:
        verbose_name = 'OrdenTrayectoria'
        verbose_name_plural = 'OrdenTrayectorias'
    
class RecepcionPasajeros(models.Model):
    id_recepcion = models.AutoField(primary_key=True, verbose_name='ID del a recepcion')
    id_pasajero = models.ForeignKey(Usuario, to_field='id_usuario', on_delete=models.CASCADE, verbose_name='ID del pasajero')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    latitud = models.FloatField(verbose_name='Latitud')
    longitud = models.FloatField(verbose_name='Longitud')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro del momento el recepcion')

    class Meta:
        verbose_name = 'RecepcionPasajero'
        verbose_name_plural = 'RecepcionPasajeros'
        
# EJECUCIÓN 

class TrayectoriaReal(models.Model):
    id_trayectoria = models.AutoField(primary_key=True, verbose_name='ID de la trayectoria')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creacion de trayectoria')
    
    class Meta:
        verbose_name = 'TrayectoriaReal'
        verbose_name_plural = 'TrayectoriasReales'
        
class OrdenTrayectoriaReal(models.Model):
    id_trayec_real = models.AutoField(primary_key=True, verbose_name='ID de la trayectoria real')
    id_trayectoria = models.ForeignKey(TrayectoriaReal, to_field='id_trayectoria', on_delete=models.CASCADE, verbose_name='ID de trayectoria')
    orden_real = models.IntegerField(verbose_name='Orden real de la trayectoria')
    latitud = models.FloatField(verbose_name='Latitud')
    longitud = models.FloatField(verbose_name='Longitud')
    
    class Meta:
        verbose_name = 'OrdenTrayectoriaReal'
        verbose_name_plural = 'OrdenTrayectoriasReales'
    
@receiver(post_save, sender=TrayectoriaReal)
def reiniciar_contador(sender, instance, created, **kwargs):
    if created:
        # Si se creó una nueva instancia de TrayectoriaReal, reiniciar el contador de OrdenTrayectoriaReal
        OrdenTrayectoriaReal.objects.filter(id_trayectoria=instance).update(orden_real=1)

class RecepecionReal(models.Model):
    id_recepecion_real = models.AutoField(primary_key=True, verbose_name='ID de la recepcion real')
    id_recepcion = models.ForeignKey(RecepcionPasajeros, to_field='id_recepcion', on_delete=models.CASCADE, verbose_name='ID de la recepcion')
    id_pasajero = models.ForeignKey(Usuario, to_field='id_usuario', on_delete=models.CASCADE, verbose_name='ID del pasajero')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    latitud = models.FloatField(verbose_name='Latitud')
    longitud = models.FloatField(verbose_name='Longitud')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro del momento el recepcion real')

    class Meta:
        verbose_name = 'RecepecionReal'
        verbose_name_plural = 'RecepcionesReales'
        
class RutasEjecutadas(models.Model):
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    id_conductor = models.ForeignKey(Usuario, to_field='id_usuario', on_delete=models.CASCADE, verbose_name='ID del usuario')
    flag_inicio = models.BooleanField(verbose_name='Flag de inicio de la ruta')
    inicio_real = models.DateTimeField(auto_now_add=True, verbose_name='Registro de la fecha del inicio real de al ruta')
    
    class Meta:
        verbose_name = 'RutaEjecutada'
        verbose_name_plural = 'RutasEjecutadas'