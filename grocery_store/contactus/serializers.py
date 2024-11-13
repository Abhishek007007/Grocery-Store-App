from rest_framework.serializers import ModelSerializer,CharField
from contactus.models import Contact
from django.core.validators import MinLengthValidator,MaxLengthValidator


class ContactSerializer(ModelSerializer):
    phone = CharField(
        validators=[
            MinLengthValidator(10, "Phone number requires exactly 10 digits"),
            MaxLengthValidator(10, "Phone number cannot exceed 10 digits")  # Using MaxLengthValidator explicitly
        ]
    )
    class Meta:
        model = Contact
        fields = "__all__"