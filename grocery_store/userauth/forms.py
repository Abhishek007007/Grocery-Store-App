from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import EmailValidator
from userauth.models import User



class LoginForm(forms.Form):
    email = forms.EmailField(max_length=122,required=True)
    password = forms.CharField(widget = forms.widgets.PasswordInput(),  max_length=122)

class RegistrationForm(UserCreationForm):
    email =forms.EmailField(max_length=122, validators=[EmailValidator("Invalid Email")],required=True)

    class Meta:
        model=User
        fields = ("username","email", "password1", "password2")
    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user

