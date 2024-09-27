from datetime import datetime, timedelta
from rest_framework import generics
from .models import Payment
from .serializer import PaymentSerializer, PaymentMinimalSerializer
from rest_framework.response import Response
from django.utils.dateparse import parse_datetime
from rest_framework import status

class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        user = request.data.get('user_id')
        vehicle_name = request.data.get('vehicle_name')
        amount = request.data.get('amount')
        issues = request.data.get('issues')

        if not vehicle_name or amount is None:
            return Response({'error': 'Vehicle ID and amount are required.'}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(vehicle_name=vehicle_name, user=user, amount=amount, issues=issues)

        return Response({'message': 'Payment successful', 'payment_id': payment.id}, status=status.HTTP_201_CREATED)

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentMinimalSerializer 

    def get_queryset(self):
        queryset = Payment.objects.all()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            parsed_start_date = parse_datetime(start_date)
            if parsed_start_date:
                parsed_start_date = parsed_start_date.replace(hour=0, minute=0, second=0, microsecond=0)
                queryset = queryset.filter(created_at__gte=parsed_start_date)

        if end_date:
            parsed_end_date = parse_datetime(end_date)
            if parsed_end_date:
                parsed_end_date = parsed_end_date.replace(hour=23, minute=59, second=59, microsecond=999999)
                queryset = queryset.filter(created_at__lte=parsed_end_date)

        return queryset