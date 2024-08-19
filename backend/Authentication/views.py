from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Authentication.serializers import *

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data.get('refresh', None)
        access = response.data.get('access', None)
    
        if refresh and access:
            response.set_cookie('access', access, httponly=True, path='/', samesite=None)
            response.set_cookie('refresh', refresh, httponly=True, path='/', samesite=None)
            return response
        else:
            return response
        
class LogOut(APIView):
    
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)  # 204 No Content
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response



