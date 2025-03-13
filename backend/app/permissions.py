from rest_framework import permissions


class IsClientUser(permissions.BasePermission):
    """
    Разрешает редактирование только пользователям в группе 'client'
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='client').exists()
