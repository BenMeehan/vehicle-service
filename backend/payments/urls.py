from django.urls import path
from .views import PaymentCreateView, PaymentListView

urlpatterns = [
    path('pay/', PaymentCreateView.as_view(), name='payment-create'),
    path('list/', PaymentListView.as_view(), name='payment-list'), 
]
