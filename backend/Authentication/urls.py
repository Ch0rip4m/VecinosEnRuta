from django.urls import path
from Authentication.views import *

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogOutView.as_view(), name='logout'),
    path('verify/', VerifyTokenExistView.as_view(), name='verify_token_exist')
]