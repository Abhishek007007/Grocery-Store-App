
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.


class Item(models.Model):
    name = models.CharField(max_length=122)
    price = models.FloatField(max_length=122)
    image = models.ImageField(upload_to = "images/")
    stock = models.IntegerField()
    grocery_type = models.CharField(max_length=122)
    quantity = models.FloatField(max_length=122)
    unit = models.CharField(max_length=122, default="No Unit")

    def __str__(self) -> str:
        return self.name

class Cart(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

class CartItem(models.Model):
    cart = models.ForeignKey(to= Cart, on_delete=models.CASCADE)
    item = models.ForeignKey(to=Item, on_delete=models.CASCADE)
    count= models.PositiveIntegerField(default=0)