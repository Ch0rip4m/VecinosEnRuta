from rest_framework_simplejwt.views import TokenObtainPairView
from Authentication.serializers import *

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer




