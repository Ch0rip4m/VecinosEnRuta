# Generated by Django 4.2.9 on 2024-04-14 02:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DatabaseManager', '0003_remove_usuario_clave_usuario_groups_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='apellido_usuario',
            field=models.CharField(max_length=255, verbose_name='Apellido del usuario'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='descripcion_usuario',
            field=models.TextField(max_length=1000, verbose_name='Descripcion del usuario'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='edad',
            field=models.CharField(default='', max_length=255, verbose_name='Edad del usuario'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='email',
            field=models.EmailField(default='', max_length=255, unique=True, verbose_name='Correo electronico'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='nombre_usuario',
            field=models.CharField(max_length=255, verbose_name='Nombre del usuario'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='password',
            field=models.CharField(default='', max_length=255, verbose_name='Password'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='sexo',
            field=models.CharField(default='', max_length=255, verbose_name='Sexo del usuario'),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='telefono',
            field=models.CharField(max_length=255, verbose_name='Telefono del usuario'),
        ),
    ]
