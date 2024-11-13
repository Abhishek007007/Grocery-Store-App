from django.shortcuts import render,HttpResponse
from django.http import HttpRequest, JsonResponse
from django.conf import settings
from grocery_store_app.models import Item
from grocery_store_app.forms import AddItemForm
from grocery_store_app.serializers import ItemSerializer, CartSerializer, CartItemSerializer
from grocery_store_app.models import Cart, CartItem

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import get_user_model

# Create your views here.
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken



User = get_user_model()



def get_grocery_list():
  items = Item.objects.all()
  grocery_list = []
  for item in items:
    grocery_list.append(
      {
        "name": item.name,
        "price": item.price,  # 3.99 * 83
        "image_url":  item.image.url,
        "stock": item.stock,
        "grocery_type": item.grocery_type,
        "quantity":  item.quantity,
        "unit":item.unit
      }
    )
  return grocery_list


def grocery_page(req : HttpRequest) -> HttpResponse:
    grocery_list = get_grocery_list()
    return render(req, "home_django.html" , context={"grocery_list" : grocery_list})

def bill_page(req:HttpRequest) -> HttpResponse:

  total_price = 0
  selected_items = {}

  grocery_list = get_grocery_list()

  for item in grocery_list:
    if not req.POST[item['name']] or "e" in req.POST[item['name']]:
      continue
    if float( req.POST[item['name']]) > 0:
      selected_items[item['name']] = {'item_count' : req.POST[item['name']],'item_price': item["price"], 'overall_price': round(float(req.POST[item['name']]) * item["price"],2)}
      total_price += round(float(req.POST[item['name']]) * item["price"],2)

  return render(req, 'bill_django.html', context= {"selected_items":selected_items, "total_price":round(total_price, 2)})

def add_item(req : HttpRequest)->HttpResponse:
  form = AddItemForm()
  return render(req, 'form.html', context={"form": form})


@api_view(["GET"])
def get_item(req : Request, id = None)->Response:
  if req.method == "GET":
    try:  
      item = Item.objects.get(pk = id)
      serializer = ItemSerializer(item)
      return Response(serializer.data)
    except Item.DoesNotExist as  e:
      return Response({"detail": str(e)})

@api_view(["GET"])
def get_items(req : Request)->Response:
  if req.method == "GET":
    try:
      item = Item.objects.all()
      serializer = ItemSerializer(item, many=True)
      
      return Response(serializer.data)
    except Item.DoesNotExist as  e:
      return Response({"detail": str(e)})

from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework import status


@api_view(["GET", "POST", "DELETE"])
def cartitem(req: Request, id=None):
    # Decode token to retrieve user
    access_token = AccessToken(str(req.auth))
    user_id = access_token['user_id']
    user = User.objects.get(id=user_id)

    
    # Retrieve or create active cart for the user
    cart, created = Cart.objects.get_or_create(user=user, is_active=True)

    # GET Request: Fetch Cart Items
    if req.method == "GET":
        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST Request: Add or Update Cart Item
    elif req.method == "POST":
        item_id = req.data.get('item_id')
        count = req.data.get('count', 1)
        if not item_id:
            raise ValidationError({"item_id": "Item ID is required."})
        
        item = get_object_or_404(Item, pk=item_id)

        # Update if item already in cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, item=item)
        if not created:
            cart_item.count += int(count)
        else:
            cart_item.count = int(count)
        
        cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # DELETE Request: Remove Item from Cart
    elif req.method == "DELETE":
        if not id:
            raise ValidationError({"item_id": "Item ID is required for deletion."})
        
        cart_item = get_object_or_404(CartItem, cart=cart, item_id=id)
        cart_item.delete()
        return Response({"message": "Item removed from cart."}, status=status.HTTP_204_NO_CONTENT)

@api_view(["POST"])
def buy_cart_items(req: Request):
    # Decode token to retrieve user
    
    access_token = AccessToken(str(req.auth))
    user_id = access_token['user_id']
    user = User.objects.get(id=user_id)

    # Retrieve active cart
    cart = get_object_or_404(Cart, user=user, is_active=True)
    cart_items = CartItem.objects.filter(cart=cart)
    
    # Check and update stock for each item in cart
    for cart_item in cart_items:
        item = cart_item.item
        if item.stock < cart_item.count:
            return Response({
                "error": f"Insufficient stock for {item.name}. Available stock: {item.stock}."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Deduct stock
        item.stock -= cart_item.count
        item.save()
    
    # Clear the cart after successful purchase
    cart_items.delete()
    cart.is_active = False
    cart.save()

    serializer = CartSerializer(cart_items, many=True)
    
    return Response({"data":serializer.data, "message": "Purchase successful, cart cleared."}, status=status.HTTP_200_OK)


  





# product = {"name" : "Laptop", "price" : 50000}
# @api_view(["GET", "POST"])
# def getData(req):
#   global product
#   if req.method == "GET":
#     return Response(product)
#   elif req.method == "POST":
#     product = req.data
#     return Response(req.data)

# @api_view(["POST"])
# def get_cart(request : Request):
  
