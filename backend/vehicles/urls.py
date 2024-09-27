from django.urls import path
from .views import VehicleComponentListCreateView, VehicleCreateView

urlpatterns = [
    path('components/', VehicleComponentListCreateView.as_view(), name='component-list-create'),
    path('issues/', VehicleCreateView.as_view(), name='issue-create'),
]
