# Generated by Django 5.0.4 on 2024-10-25 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DatabaseManager', '0026_miembrosruta'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rutasejecutadas',
            name='inicio_real',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Registro de la fecha del inicio real de al ruta'),
        ),
    ]
