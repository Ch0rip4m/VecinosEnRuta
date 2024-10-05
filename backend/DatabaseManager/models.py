from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# INTERACCIÓN DE USUARIOS

class UsuarioManager(BaseUserManager):
    def create_user(self, email, nombre_usuario, apellido_usuario, password, imagen_perfil, **extra_fields):
        if not email:
            raise ValueError('El email debe ser proporcionado')
        email = self.normalize_email(email)
        user = self.model(email=email, nombre_usuario=nombre_usuario, apellido_usuario=apellido_usuario, imagen_perfil=imagen_perfil, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        return user

    def create_superuser(self, email, nombre_usuario, apellido_usuario, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True.')

        return self.create_user(email, nombre_usuario, apellido_usuario, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.AutoField(primary_key=True, verbose_name='ID del usuario')
    nombre_usuario = models.CharField(max_length=255, verbose_name='Nombre del usuario')
    apellido_usuario = models.CharField(max_length=255, verbose_name='Apellido del usuario')
    edad = models.CharField(max_length=255, verbose_name='Edad del usuario', default='')
    sexo = models.CharField(max_length=255, verbose_name='Sexo del usuario', default='')
    email = models.EmailField(max_length=255, verbose_name='Correo electronico', default='',unique=True)
    password = models.CharField(max_length=255, verbose_name='Password', default='')
    telefono = models.CharField(max_length=255, verbose_name='Telefono del usuario')
    descripcion_usuario = models.TextField(max_length=1000, verbose_name='Descripcion del usuario')
    imagen_perfil = models.ImageField(upload_to='perfil/', null=True, blank=True, verbose_name='Imagen de perfil Usuarios')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UsuarioManager()

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
    def __str__(self):
        return self.email
    
    def id(self):
        return self.id_usuario
    
    REQUIRED_FIELDS = ['nombre_usuario', 'apellido_usuario',
                       'edad', 'sexo', 'password',
                       'telefono', 'descripcion_usuario']
    
    USERNAME_FIELD = 'email'
    
    def assign_roles(self, roles):
        # Obtener los roles actuales del usuario
        roles_actuales = RolUsuario.objects.filter(id_usuario=self).values_list('id_rol__nombre_rol', flat=True)

    # Filtrar los roles que deben ser agregados
        nuevos_roles = [role_name for role_name in roles if role_name not in roles_actuales]

    # Filtrar los roles que deben ser eliminados
        roles_a_eliminar = [role_name for role_name in roles_actuales if role_name not in roles]

    # Agregar nuevos roles
        for role_name in nuevos_roles:
            try:
                role = Roles.objects.get(nombre_rol=role_name)
                RolUsuario.objects.create(id_usuario=self, id_rol=role)
            except ObjectDoesNotExist:
                raise ValueError(f'Rol {role_name} no existe')

    # Eliminar roles que ya no están en la lista
        for role_name in roles_a_eliminar:
            try:
                role = Roles.objects.get(nombre_rol=role_name)
                RolUsuario.objects.filter(id_usuario=self, id_rol=role).delete()
            except ObjectDoesNotExist:
                raise ValueError(f'Rol {role_name} no existe')
    
    def assign_location(self, location):
        # Obtener los roles actuales del usuario
        comuna_actual = ComunaUsuario.objects.filter(id_usuario=self).values_list('id_comuna__nombre_comuna', flat=True)

    # Filtrar los roles que deben ser agregados
        nueva_comuna = [nombre_comuna for nombre_comuna in location if nombre_comuna not in comuna_actual]

    # Filtrar los roles que deben ser eliminados
        comuna_a_eliminar = [nombre_comuna for nombre_comuna in comuna_actual if nombre_comuna not in location]

    # Agregar nuevos roles
        for nombre_comuna in nueva_comuna:
            try:
                comuna = Comuna.objects.get(nombre_comuna=nombre_comuna)
                ComunaUsuario.objects.create(id_usuario=self, id_comuna=comuna)
            except ObjectDoesNotExist:
                raise ValueError(f'Rol {nombre_comuna} no existe')

    # Eliminar roles que ya no están en la lista
        for nombre_comuna in comuna_a_eliminar:
            try:
                comuna = Comuna.objects.get(nombre_comuna=nombre_comuna)
                ComunaUsuario.objects.filter(id_usuario=self, id_comuna=comuna).delete()
            except ObjectDoesNotExist:
                raise ValueError(f'Rol {nombre_comuna} no existe')

class Region(models.Model):
    id_region = models.AutoField(primary_key=True, verbose_name='ID de la Región')
    nombre_region = models.CharField(max_length=50, verbose_name='Nombre de la región')
    
    class Meta:
        verbose_name = 'Region'
        verbose_name_plural = 'Regiones'
        
    def __str__(self):
        return self.nombre_region
            
class Comuna(models.Model):
    id_comuna = models.AutoField(primary_key=True, verbose_name='ID de la comuna')
    nombre_comuna = models.CharField(max_length=50, verbose_name='Nombre de la comuna')
    latitud = models.FloatField(verbose_name='Latitud', default=0)
    longitud = models.FloatField(verbose_name='Longitud', default=0)
    
    class Meta:
        verbose_name = 'Comuna'
        verbose_name_plural = 'Comunas'
    
    def __str__(self):
        return self.nombre_comuna

class ComunaUsuario(models.Model):
    id_usuario = models.ForeignKey(Usuario, to_field='id_usuario', on_delete=models.CASCADE, verbose_name='ID del usuario')
    id_comuna = models.ForeignKey(Comuna, to_field='id_comuna', on_delete=models.CASCADE, verbose_name='ID de la comuna')
    
    class Meta:
        verbose_name = 'ComunaUsuario'
        verbose_name_plural = 'ComunaUsuario'
        
    def __str__(self):
        return f"{self.id_usuario} - {self.id_comuna}"
            
class Comunidades(models.Model):
    id_comunidad = models.AutoField(primary_key=True, verbose_name='ID de la comunidad')
    nombre_comunidad = models.CharField(max_length=100, verbose_name='Nombre de la comunidad')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')
    
    class Meta:
        verbose_name = 'Comunidad'
        verbose_name_plural = 'Comunidades'
        
    def __str__(self):
        return self.nombre_comunidad

class ComunaRegion(models.Model):
    id_region = models.ForeignKey(Region, to_field='id_region', on_delete=models.CASCADE, verbose_name='ID de la region')
    id_comuna = models.ForeignKey(Comuna, to_field='id_comuna', on_delete=models.CASCADE, verbose_name='ID de la comuna')
    
    class Meta:
        verbose_name = 'ComunaRegion'
        verbose_name_plural = 'ComunaRegiones'
        
    def __str__(self):
        return f"{self.id_region} - {self.id_comuna}"
    
class ComunaComunidad(models.Model):
    id_comuna = models.ForeignKey(Comuna, to_field='id_comuna', on_delete=models.CASCADE, verbose_name='ID de la comuna')
    id_comunidad = models.ForeignKey(Comunidades, to_field='id_comunidad', on_delete=models.CASCADE, verbose_name='ID de la comunidad')
    
    class Meta:
        verbose_name = 'ComunaComunidad'
        verbose_name_plural = 'ComunaComunidades'
        
    def __str__(self):
        return f"{self.id_comuna} - {self.id_comunidad}"
    
class ComunidadesUsuario(models.Model):
    id_usuario = models.ForeignKey(Usuario, to_field='id_usuario',on_delete=models.CASCADE, verbose_name='ID del usuario')
    id_comunidad = models.ForeignKey(Comunidades, to_field='id_comunidad', on_delete=models.CASCADE, verbose_name='ID de la comunidad')

    class Meta:
        verbose_name = 'ComunidadesUsuario'
        verbose_name_plural = 'ComunidadesUsuarios'
        
    def __str__(self):
        return f"{self.id_usuario} - {self.id_comunidad}"
        
class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True, verbose_name='ID del rol')
    nombre_rol = models.CharField(max_length=30, verbose_name='Nombre del rol')
    
    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
        
    def __str__(self):
        return self.nombre_rol

class RolUsuario(models.Model):
    id_usuario = models.ForeignKey(Usuario, to_field='id_usuario',on_delete=models.CASCADE, verbose_name='ID del usuario')
    id_rol = models.ForeignKey(Roles, to_field='id_rol', on_delete=models.CASCADE, verbose_name='ID del rol')
    
    class Meta:
        verbose_name = 'RolUsuario'
        verbose_name_plural = 'RolUsuarios'
    
    def __str__(self):
            return f"{self.id_usuario} - {self.id_rol}"
    
class Vehiculos(models.Model):
    id_vehiculo = models.AutoField(primary_key=True, verbose_name='ID del vehiculo')
    marca_vehiculo = models.CharField(max_length=50, verbose_name='Marca del vehiculo')
    modelo_vehiculo = models.CharField(max_length=50, verbose_name='Modelo del vehiculo')
    tipo_de_vehiculo = models.CharField(max_length=50, verbose_name='Tipo de vehiculo')
    nro_asientos_disp = models.IntegerField(verbose_name='Numero de asientos disponibles')
    color_vehiculo = models.CharField(max_length=20, verbose_name='Color del vehiculo')
    patente = models.CharField(max_length=10, verbose_name='Patente del vehiculo')
    ano_vehiculo = models.CharField(max_length=4, verbose_name='Año del vehiculo')
    imagen_perfil = models.ImageField(upload_to='vehiculo/', null=True, blank=True, verbose_name='Imagen de perfil vehiculo')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Registro de creacion')
    
    class Meta:
        verbose_name = 'Vehiculo'
        verbose_name_plural = 'Vehiculos'
        
    def __str__(self):
            return self.marca_vehiculo
    
class VehiculoUsuario(models.Model):
    id_usuario = models.ForeignKey(Usuario, to_field='id_usuario',on_delete=models.CASCADE, verbose_name='ID del usuario')
    id_vehiculo = models.ForeignKey(Vehiculos, to_field='id_vehiculo', on_delete=models.CASCADE, verbose_name='ID del vehiculo')

    class Meta:
        verbose_name = 'VehiculoUsuario'
        verbose_name_plural = 'VehiculoUsuarios'
        
    def __str__(self):
            return f"{self.id_usuario} - {self.id_vehiculo}"
        
class Calificaciones(models.Model):
    id_calificacion = models.AutoField(primary_key=True, verbose_name='ID de la calificacion')
    id_calificador = models.ForeignKey(Usuario, to_field='id_usuario', related_name='calficacion_realizada', on_delete=models.CASCADE, verbose_name='ID del usuario calificador')
    id_calificado = models.ForeignKey(Usuario, to_field='id_usuario', related_name='calficacion_recibida', on_delete=models.CASCADE, verbose_name='ID del usuario calificado')
    comentario = models.TextField(max_length=500, verbose_name='Comentarios de la calificacion')
    fecha_calificacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de la calificacion')
    
    class Meta:
        verbose_name = 'Calificacion'
        verbose_name_plural = 'Calificaciones'
        
    def __str__(self):
            return f"{self.id_calificacion} - {self.comentario}"
    
class CategoriasCalificacion(models.Model):
    id_calificacion = models.ForeignKey(Calificaciones, to_field='id_calificacion', on_delete=models.CASCADE, verbose_name='ID de la calificacion')
    seguridad = models.IntegerField(verbose_name='Seguridad del viaje')
    limpieza = models.IntegerField(verbose_name='Limpieza del vehiculo')
    comodidad = models.IntegerField(verbose_name='Comodidad del viaje')
    puntualidad = models.IntegerField(verbose_name='Puntualidad del conductor')
    
    class Meta:
        verbose_name = 'Categoriascalificacion'
        verbose_name_plural = 'CategoriasCalificaciones'
        
    def __str__(self):
            return f"{self.id_calificacion} - {self.seguridad} - {self.limpieza} - {self.comodidad} - {self.puntualidad}"
    
class Chat(models.Model):
    id_mensaje = models.AutoField(primary_key=True, verbose_name='ID del mensaje')
    id_emisor = models.ForeignKey(Usuario, to_field='id_usuario', related_name='mensaje_enviado', on_delete=models.CASCADE, verbose_name='ID del usuario emisor')
    id_receptor = models.ForeignKey(Usuario, to_field='id_usuario', related_name='mensaje_recibido', on_delete=models.CASCADE, verbose_name='ID del usuario receptor')
    mensaje = models.TextField(verbose_name='Contenido del mensaje')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='marca de tiempo del mensaje')
    
    class Meta:
        verbose_name = 'Chat'
        verbose_name_plural = 'Chats'
        
    def __str__(self):
            return f"{self.id_mensaje} - {self.id_emisor} - {self.id_receptor} - {self.mensaje}"

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
        
    def __str__(self):
            return self.nombre_ruta
    
class Dias(models.Model):
    id_dia = models.AutoField(primary_key=True, verbose_name='ID del dia de la semana')
    nombre_dia = models.CharField(max_length=10, verbose_name='Nombre el dia de la semana')
    
    class Meta:
        verbose_name = 'Dia'
        verbose_name_plural = 'Dias'
        
    def __str__(self):
            return self.nombre_dia
    
class DiasRutas(models.Model):
    id_dia = models.ForeignKey(Dias, to_field='id_dia', on_delete=models.CASCADE, verbose_name='ID del dia de la semana')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')

    class Meta:
        verbose_name = 'DiasRuta'
        verbose_name_plural = 'DiasRutas'
        
    def __str__(self):
            return f"{self.id_dia} - {self.id_ruta}"
        
class Trayectoria(models.Model):
    id_trayectoria = models.AutoField(primary_key=True, verbose_name='ID de la trayectoria')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creacion de trayectoria')   

    class Meta:
        verbose_name = 'Trayectoria'
        verbose_name_plural = 'Trayectorias'
        
    def __str__(self):
            return self.id_trayectoria
         
class OrdenTrayectoria(models.Model):
    id_trayectoria = models.ForeignKey(Trayectoria, to_field='id_trayectoria', on_delete=models.CASCADE, verbose_name='ID de la trayectoria')
    orden = models.IntegerField(verbose_name='Orden de la trayectoria')
    latitud = models.FloatField(verbose_name='Latitud')
    longitud = models.FloatField(verbose_name='Longitud')
    
    class Meta:
        verbose_name = 'OrdenTrayectoria'
        verbose_name_plural = 'OrdenTrayectorias'
        
    def __str__(self):
            return f"{self.orden} - {self.latitud} - {self.longitud}"
    
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
        
    def __str__(self):
            return f"{self.id_recepcion} - {self.latitud} - {self.longitud}"
        
# EJECUCIÓN 

class TrayectoriaReal(models.Model):
    id_trayectoria = models.AutoField(primary_key=True, verbose_name='ID de la trayectoria')
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    tiempo_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creacion de trayectoria')
    
    class Meta:
        verbose_name = 'TrayectoriaReal'
        verbose_name_plural = 'TrayectoriasReales'
    
    def __str__(self):
            return self.id_trayectoria
        
class OrdenTrayectoriaReal(models.Model):
    id_trayec_real = models.AutoField(primary_key=True, verbose_name='ID de la trayectoria real')
    id_trayectoria = models.ForeignKey(TrayectoriaReal, to_field='id_trayectoria', on_delete=models.CASCADE, verbose_name='ID de trayectoria')
    orden_real = models.IntegerField(verbose_name='Orden real de la trayectoria')
    latitud = models.FloatField(verbose_name='Latitud')
    longitud = models.FloatField(verbose_name='Longitud')
    
    class Meta:
        verbose_name = 'OrdenTrayectoriaReal'
        verbose_name_plural = 'OrdenTrayectoriasReales'
        
    def __str__(self):
            return f"{self.orden_real} - {self.latitud} - {self.longitud}"
    
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
        
    def __str__(self):
            return f"{self.id_recepecion_real} - {self.latitud} - {self.longitud}"
        
class RutasEjecutadas(models.Model):
    id_ruta = models.ForeignKey(Rutas, to_field='id_ruta', on_delete=models.CASCADE, verbose_name='ID de la ruta')
    id_conductor = models.ForeignKey(Usuario, to_field='id_usuario', on_delete=models.CASCADE, verbose_name='ID del usuario')
    flag_inicio = models.BooleanField(verbose_name='Flag de inicio de la ruta')
    inicio_real = models.DateTimeField(auto_now_add=True, verbose_name='Registro de la fecha del inicio real de al ruta')
    
    class Meta:
        verbose_name = 'RutaEjecutada'
        verbose_name_plural = 'RutasEjecutadas'
        
    def __str__(self):
            return f"{self.id_ruta} - {self.flag_inicio} - {self.inicio_real}"