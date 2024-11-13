from dataclasses import field
from django.forms import ModelForm
from contactus.models import Contact

class ContactForm(ModelForm):
    class Meta:
        model = Contact
        fields = "__all__"
