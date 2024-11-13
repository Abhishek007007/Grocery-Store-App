
from django.db import models
from django.core.validators import MinLengthValidator, EmailValidator,MaxLengthValidator
# Create your models here.
class Contact(models.Model):
    name = models.CharField(max_length=122, validators=[MinLengthValidator(1, "Name too short")])
    email = models.CharField(max_length=122, validators=[EmailValidator("Invalid email")])
    phone = models.CharField(max_length=122, validators=[MinLengthValidator(10, "Phone number requires 10 digits"),MaxLengthValidator(limit_value=10, message="Phone number requires 10 digits")])
    desc = models.TextField(validators=[MinLengthValidator(1, "Description too short")])
    date = models.DateField(auto_now_add=True)
    def __str__(self) -> str:
        return self.name
