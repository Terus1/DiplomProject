from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Client


class CustomUserCreationForm(UserCreationForm):
    nickname = forms.CharField(max_length=255, required=True, help_text='Введите никнейм')

    class Meta:
        model = User
        fields = ('username', 'nickname', 'password1', 'password2')

    def save(self, commit=True):
        # Создаем объект пользователя, но не сохраняем его еще
        user = super().save(commit=False)

        # Сначала сохраняем объект User
        if commit:
            user.save()

        # После того как User сохранен, создаем объект Client
        nickname = self.cleaned_data.get('nickname')
        Client.objects.create(user=user, name=nickname)  # Сохраняем nickname в поле name модели Client

        return user

