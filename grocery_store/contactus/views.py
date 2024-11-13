from http.client import HTTPResponse

from django.shortcuts import render,redirect
from django.http import HttpResponse, HttpRequest

from contactus.models import Contact
from contactus.forms import ContactForm
from contactus.serializers import ContactSerializer
from rest_framework import status

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


def contactus(req : HttpRequest)->HTTPResponse:
    if req.method == "POST":
        contact_form = ContactForm(req.POST)
        if contact_form.is_valid():
            contact_form.save()
            return redirect("home")
        else:
            return render(req, 'form.html',context={"form" :contact_form})

    else:
        contact_form = ContactForm()
        return render(req, 'form.html',context={"form" :contact_form})

@api_view(['GET', 'POST'])
def contactusapi(req :HttpRequest)->HTTPResponse:
    if(req.method == "POST"):
        serializer = ContactSerializer(data=req.data)
        if serializer.is_valid():  
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
