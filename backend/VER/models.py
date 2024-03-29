from django.db import models

# Create your models here.

class Comunidades(models.Model):
    id_comunidad = models.AutoField(primary_key=True, verbose_name='ID de la comunidad')
    nombre_comunidad = models.CharField(max_length=100, verbose_name='Nombre de la comunidad')
    comuna = models.CharField(max_length=50, verbose_name='Nombre de la comuna')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True, verbose_name='ID del usuario')
    nombre_usuario = models.CharField(max_length=100, verbose_name='Nombre del usuario')
    apellido_usuario = models.CharField(max_length=100, verbose_name='Apellido del usuario')
    clave = models.CharField(max_length=50, verbose_name='Password')
    telefono = models.CharField(max_length=12, verbose_name='Telefono del usuario')
    descripcion_usuario = models.TextField(max_length=500, verbose_name='Descripcion del usuario')
    rol = models.CharField(max_length=30, verbose_name='Rol(es) del usuario')
    id_comunidad = models.ForeignKey(Comunidades,to_field='id_comunidad', verbose_name='ID de la comunidad',on_delete=models.CASCADE, null=True)
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')
    
class Vehiculos(models.Model):
    id_vehiculo = models.AutoField(primary_key=True, verbose_name='ID del vehiculo')
    id_conductor = models.ForeignKey(Usuario, to_field='id_usuario', on_delete=models.CASCADE, verbose_name='ID del conductor')
    marca_vehiculo = models.CharField(max_length=50, verbose_name='Marca del vehiculo')
    modelo_vehiculo = models.CharField(max_length=50, verbose_name='Modelo del vehiculo')
    tipo_de_vehiculo = models.ChardFiel(max_length=50, verbose_name='Tipo de vehiculo')
    nro_asientos_disp = models.IntegerField(verbose_name='Numero de asientos disponibles')
    color_vehiculo = models.CharField(max_length=20, verbose_name='Color del vehiculo')
    patente = models.CharField(max_length=10, verbose_name='Patente del vehiculo')
    ano_vehiculo = models.CharField(max_length=4, verbose_name='Año del vehiculo')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')
    
class Calificaciones(models.Model):
    id_calificacion = models.AutoField(primary_key=True, verbose_name='ID de la calificacion')
    id_calificador = models.ForeignKey(Usuario, to_field='id_usuario', verbose_name='ID del usuario calificador')
    id_calificado = models.ForeignKey(Usuario, to_field='id_usuario', verbose_name='ID del usuario calificado')
    comentario = models.TextField(max_length=500, verbose_name='Comentarios de la calificacion')
    fecha_calificacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de la calificacion')
    
class CategoriasCalificacion(models.Model):
    id_calificador = models.ForeignKey(Calificaciones, to_field='id_calificacion', verbose_name='ID de la calificacion')
    seguridad = models.IntegerField(verbose_name='Seguridad del viaje')
    limpieza = models.IntegerField(verbose_name='Limpieza del vehiculo')
    comodidad = models.IntegerField(verbose_name='Comodidad del viaje')
    puntualidad = models.IntegerField(verbose_name='Puntualidad del conductor')
    
class Chat(models.Model):
    id_mensaje = models.AutoField(primary_key=True, verbose_name='ID del mensaje')
    id_emisor = models.ForeignKey(Usuario, to_field='id_usuario', verbose_name='ID del usuario emisor')
    id_receptor = models.ForeignKey(Usuario, to_field='id_usuario', verbose_name='ID del usuario receptor')
    mensaje = models.TextField(verbose_name='Contenido del mensaje')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='marca de tiempo del mensaje')
    
class Rutas(models.Model):
    id_ruta = models.AutoField(primary_key=True, verbose_name='ID de la ruta')
    id_vehiculo = models.ForeignKey(Vehiculos, to_field='id_vehiculo', verbose_name='ID del vehiculo')
    id_conductor = models.ForeignKey(Usuario, to_field='id_usuario', verbose_name='ID del conductor')
    nombre_ruta = models.CharField(max_length=50, verbose_name='Nombre de la ruta')
    origen = models.CharField(max_length=30, verbose_name='Origen de la ruta')
    destino = models.CharField(max_length=30, verbose_name='Destino de la ruta')
    hora_salida = models.CharField(max_length=10, verbose_name='Hora de salida de la ruta')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creacion de ruta')
    
class Dias(models.Model):
    id_dia = models.AutoField(primary_key=True, verbose_name='ID del dia de la semana')
    nombre_dia = models.CharField(max_length=10, verbose_name='Nombre el dia de la semana')
    
class DiasRutas(models.Model):
    id_dia = models.ForeignKey(Dias, to_field='id_dia', verbose_name='ID del dia de la semana')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', verbose_name='ID de la ruta')