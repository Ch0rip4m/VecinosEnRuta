from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Authentication.serializers import *
from rest_framework.exceptions import AuthenticationFailed, ValidationError

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            refresh = response.data.get('refresh', None)
            access = response.data.get('access', None)
        
            if refresh and access:
                response.set_cookie('access', access, httponly=True, path='/', samesite='Lax')
                response.set_cookie('refresh', refresh, httponly=True, path='/', samesite='Lax')
                return response
            else:
                return Response({'detail': 'Tokens could not be generated'}, status=status.HTTP_400_BAD_REQUEST)
        
        except AuthenticationFailed as e:
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({'detail': 'An unexpected error occurred: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class VerifyTokenExistView(APIView):
    
    def get(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')
        refresh_token = request.COOKIES.get('refresh')
        
        if access_token and refresh_token:
            return Response({"detail": "Tokens exist"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Tokens do not exist"}, status=status.HTTP_401_UNAUTHORIZED)
        

class LogOutView(APIView):
        
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)  # 204 No Content
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response



