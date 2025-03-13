from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Client


@receiver(post_save, sender=User)
def create_client_for_new_user(sender, instance, created, **kwargs):
    if created:
        Client.objects.create(user=instance, name=instance.username)  # Используем username как никнейм по умолчанию


@receiver(post_save, sender=User)
def save_client(sender, instance, **kwargs):
    if hasattr(instance, 'client'):
        instance.client.save()



