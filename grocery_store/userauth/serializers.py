from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer, CharField, ValidationError, Serializer
from django.core.validators import MinLengthValidator, EmailValidator

# from django.db.models

User = get_user_model()

class UserSerialiser(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')
class SignUpSerializer(ModelSerializer):
    password_confirm = CharField(max_length=128)

    class Meta:
        model=User
        fields = ("username","email", "password","password_confirm")

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise ValidationError({"password":"Passwords do not match."})
        return attrs

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password=validated_data['password']

        validated_data.pop('password_confirm')

        user = User(username=username, email=email, password=password)

        user.save()

        return user

class LoginSerializer(Serializer):
    email = CharField(max_length=128, validators=[EmailValidator("Invalid email")])
    password = CharField(max_length=128, validators=[MinLengthValidator(0, "Cannot be empty")])

    def validate(self, data):
        try:
            user = User.objects.get(email = data['email'])

            if user.check_password(data['password']):
                return data
            else:
                raise ValidationError("Invalid Login Credentials")
                
        except User.DoesNotExist:
            raise ValidationError("Invalid Login Credentials")
        
# {"username" : "abhi",
# "email" : "a@c.com",
# "password" : "pl,mkoijn",
# "password_confirm" : "pl,mkoijn"}