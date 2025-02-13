"""
URL configuration for project2 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.urls import path, include
from userauth.views import login, register, signup,login1, refresh, get_user_data
urlpatterns = [
    path('register/', register, name="registration_page"),
    path('login/', login, name="login_page"),
    path('api/signup/', signup),
    path('api/login/', login1),
    path('api/refresh/', refresh),
    path('api/user/', get_user_data)
]
