
from django.forms import ModelForm

from grocery_store_app.models import Item

class AddItemForm(ModelForm):
    class Meta:
        model = Item
        fields = "__all__"