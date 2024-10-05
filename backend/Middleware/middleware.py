import jwt
from datetime import datetime
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import make_aware
from django.http import HttpResponse, JsonResponse


class TokenRefreshMiddleware(MiddlewareMixin):
    def process_request(self, request):
        access_token = request.COOKIES.get("access")
        refresh_token = request.COOKIES.get("refresh")

        if access_token and refresh_token:
            try:
                # Intenta decodificar el token de acceso
                payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
                refresh_payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
                expiration = datetime.fromtimestamp(payload['exp'])
                expiration = make_aware(expiration)
                expiration_r = datetime.fromtimestamp(refresh_payload['exp'])
                expiration_r = make_aware(expiration_r)
                print('EXPIRATION ACCESS: ', expiration)
                print('EXPIRATION REFRESH: ', expiration_r)

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
                    request.delete_cookies = True
                    return

    def process_response(self, request, response):
        if hasattr(request, 'delete_cookies') and request.delete_cookies:
            response.delete_cookie('access', path='/', samesite='Lax')
            response.delete_cookie('refresh', path='/', samesite='Lax')
            
            return JsonResponse({"detail" : "tokens eliminados, sesion expirada"}, status=401)

        if hasattr(request, 'new_access_token') and request.new_access_token:
            response.set_cookie('access', request.new_access_token, httponly=True, path='/', samesite='Lax')
        return response
