import jwt
from datetime import datetime
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import make_aware
from django.http import HttpResponse
from django.shortcuts import redirect

class TokenRefreshMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get("access")
        refresh_token = request.COOKIES.get("refresh")

        if access_token and refresh_token:
            try:
                # Intenta decodificar el token de acceso
                payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
                expiration = datetime.fromtimestamp(payload['exp'])
                expiration = make_aware(expiration)
                print('EXPIRATION', expiration)

            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
                print('TOKEN DE ACCESO INVÁLIDO O EXPIRADO:', str(e))
                
                try:
                    print("RENOVANDO TOKEN DE ACCESO...")
                    # Intenta renovar el token de acceso usando el token de actualización
                    refresh_token_obj = RefreshToken(refresh_token)
                    new_access_token = str(refresh_token_obj.access_token)

                    # Establece el nuevo token de acceso en la solicitud
                    request.new_access_token = new_access_token

                except Exception as inner_e:
                    print('FALLO AL RENOVAR EL TOKEN:', str(inner_e))
                    request.new_access_token = None
                    request.logout_user = True

    def process_response(self, request, response):
        if hasattr(request, 'logout_user') and request.logout_user:
            # Asegúrate de que no se esté redirigiendo a sí mismo
            if not request.path.startswith('/auth/logout/'):
                response = redirect('/auth/logout/')
                return response
            
            # Si no rediriges, simplemente elimina las cookies
            response.delete_cookie('access', path='/')
            response.delete_cookie('refresh', path='/')
            return HttpResponse("Refresh token inválido", status=401)

        if hasattr(request, 'new_access_token') and request.new_access_token:
            response.set_cookie('access', request.new_access_token, httponly=True, path='/', samesite='Lax')
        return response
