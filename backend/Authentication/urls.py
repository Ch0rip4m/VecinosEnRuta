from django.urls import path
from Authentication.views import *

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', MyTokenObtainPairView.as_view(), name='token_refresh')
]