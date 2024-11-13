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
from grocery_store_app.views import grocery_page,add_item, bill_page, get_items, get_item,cartitem, buy_cart_items
urlpatterns = [
    path('', grocery_page, name="home"),
    path('bill_page/',bill_page),
    path('add_item/',add_item),
    path('api/items/<int:id>',get_item ),
    path('api/items/',get_items ),
    path('api/cart-items/', cartitem),
     path('api/cart-items/<int:id>', cartitem),
    path('api/buy/',buy_cart_items ),
    # path('test', getData)
]
