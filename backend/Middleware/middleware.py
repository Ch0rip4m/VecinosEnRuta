import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.deprecation import MiddlewareMixin
from django.utils.timezone import now, make_aware

class TokenRefreshMiddleware(MiddlewareMixin):
    def process_request(self, request):
        print("ENTRO AL MIDDLEWARE")
        print("COOKIES =", request.COOKIES)
        access_token = request.COOKIES.get("access")
        refresh_token = request.COOKIES.get("refresh")
        #print(access_token)
        #print(refresh_token)

        if access_token and refresh_token:
            print("EXISTEN TOKENS EN COOKIES")
            try:
                payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
                expiration = datetime.fromtimestamp(payload['exp'])
                
                expiration = make_aware(expiration)
                print('EXPIRATION',expiration)

                if expiration < now() + timedelta(minutes=5):
                    refresh_token_obj = RefreshToken(refresh_token)
                    new_access_token = str(refresh_token_obj.access_token)

                    request.new_access_token = new_access_token
                    print("TOKEN ACTUALIZADO")

            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                request.new_access_token = None

    def process_response(self, request, response):
        if hasattr(request, 'new_access_token') and request.new_access_token:
            response.set_cookie('access', request.new_access_token, httponly=True, path='/', samesite=None)
            print("COOKIES ACTUALIZADO")
        
        return response
