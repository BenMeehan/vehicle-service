from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['user', 'amount', 'vehicle_name', 'issues']

class PaymentMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['created_at', 'amount']