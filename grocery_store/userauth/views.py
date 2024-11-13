
import email
from os import access
from re import search
import re
from urllib import response
from wsgiref.util import request_uri
from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse

from userauth.forms import RegistrationForm
from userauth.models import User
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes,throttle_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from userauth.serializers import SignUpSerializer, LoginSerializer, UserSerialiser
from userauth.forms import LoginForm


from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.throttling import AnonRateThrottle


# Create your views here.


def login(req : HttpRequest)->HttpResponse:
    if req.method == "POST":
        form = LoginForm(req.POST)
        try:
            user:User = User.objects.get(email = form.data['email'])
            
            if user.check_password(form.data['password']):
                
                return redirect("home")
            else:
                form.add_error("password", ValidationError("Password Incorrect"))
        except User.DoesNotExist:
            form.add_error("email", ValidationError("User does not exist"))

        return render(req, 'form.html', context={"form" : form})

    else:
        form = LoginForm(req.POST)
        return render(req, 'form.html', context={"form" : form})

        

def register(req : HttpRequest)->HttpResponse:
    if req.method == "POST":
        form = RegistrationForm(req.POST)
        
        if form.is_valid():
            user :User= form.save(commit=False)
            user.set_password(form.data['password1'])
            user.save()
            return redirect("login_page")
        else:
            return render(req, "form.html", context={"form" : form})

    form = RegistrationForm()
    return render(req, "form.html", context={"form" : form})

@api_view(['POST'])
@permission_classes([])
def signup(request: Request):
    if request.method == "POST":
        serializer = SignUpSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            userserializer = UserSerialiser(user).data

            return Response({'username' : userserializer['username'], 'email': userserializer['email']}, status.HTTP_201_CREATED )
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST )
        
@api_view(['POST'])
@permission_classes([])
@throttle_classes([AnonRateThrottle])
def login1(request: Request):
    if request.method == "POST":
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = User.objects.get(email = serializer.validated_data['email'])
            token = RefreshToken.for_user(user)
            resp = Response({'data':serializer.data, 'access':str(token.access_token), 'refresh': str(token)}, status.HTTP_201_CREATED )
            return resp
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST )

@api_view(["POST"])
@permission_classes([])
def refresh(request : Request):
    if 'refreshtoken' in request.data and  request.data['refreshtoken']:
        try:
            token = RefreshToken(request.data['refreshtoken'])
        except TokenError as e:
            return Response({"error" : str(e)}, status=status.HTTP_400_BAD_REQUEST)
        access_token = token.access_token
        user_id = access_token['user_id']
        user = User.objects.get(id = user_id)
        serializer = UserSerialiser(user)
        resp = Response({ 'data' : serializer.data,'access':str(access_token), 'refresh': str(token)}, status.HTTP_201_CREATED )
        return resp
    return Response({"error" : "No refresh token given"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(["GET"])
def get_user_data(request:Request):
    try:
        access_token = AccessToken(str(request.auth))
        
    except TokenError as e:
        return Response({"error" : str(e)}, status=status.HTTP_400_BAD_REQUEST)

    user_id = access_token['user_id']
    user = User.objects.get(id = user_id)
    serializer = UserSerialiser(user)
    resp = Response({ 'data' : serializer.data}, status.HTTP_201_CREATED )
    return resp