from django.test import TestCase
from payments.models import Payment
from .serializer import PaymentSerializer, PaymentMinimalSerializer
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.utils.dateparse import parse_datetime


class PaymentModelTests(TestCase):
    def test_payment_creation(self):
        """Test creating a payment instance"""
        payment = Payment.objects.create(
            user=1,
            amount=150.00,
            vehicle_name="Honda Civic",
            issues=2,
        )
        self.assertEqual(payment.user, 1)
        self.assertEqual(payment.amount, 150.00)
        self.assertEqual(payment.vehicle_name, "Honda Civic")
        self.assertEqual(payment.issues, 2)

    def test_payment_str_representation(self):
        """Test the string representation of the payment instance"""
        payment = Payment.objects.create(
            user=1,
            amount=200.50,
            vehicle_name="Toyota Corolla",
            issues=1,
        )
        self.assertEqual(str(payment), "Payment of $200.5 for Toyota Corolla by 1")

class PaymentSerializerTests(TestCase):
    def test_valid_payment_serializer(self):
        """Test a valid payment serializer"""
        data = {
            'user': 1,
            'amount': '250.00',
            'vehicle_name': 'Ford Mustang',
            'issues': 3
        }
        serializer = PaymentSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        payment = serializer.save()
        self.assertEqual(payment.user, data['user'])
        self.assertEqual(payment.amount, 250.00)
        self.assertEqual(payment.vehicle_name, data['vehicle_name'])

    def test_invalid_payment_serializer(self):
        """Test an invalid payment serializer (missing amount)"""
        data = {
            'user': 1,
            'vehicle_name': 'Ford Mustang',
            'issues': 3
        }
        serializer = PaymentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('amount', serializer.errors)


class PaymentViewTests(APITestCase):
    def setUp(self):
        self.create_payment_url = reverse('payment-create') 
        self.list_payment_url = reverse('payment-list') 

    def test_create_payment_success(self):
        """Test creating a payment successfully"""
        data = {
            'user_id': 1,
            'vehicle_name': 'Ford Mustang',
            'amount': '300.00',
            'issues': 2
        }
        response = self.client.post(self.create_payment_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('payment_id', response.data)
        self.assertEqual(response.data['message'], 'Payment successful')

    def test_create_payment_missing_data(self):
        """Test creating a payment with missing required data"""
        data = {
            'user_id': 1,
            'vehicle_name': 'Ford Mustang',
        }
        response = self.client.post(self.create_payment_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Vehicle ID and amount are required.')

    def test_list_payments_within_date_range(self):
        """Test listing payments within a date range"""
        Payment.objects.create(user=1, amount=100.00, vehicle_name="Car 1", issues=1)
        Payment.objects.create(user=1, amount=200.00, vehicle_name="Car 2", issues=2)
        
        start_date = "2024-09-25T00:00:00Z"
        end_date = "2024-09-27T23:59:59Z"
        response = self.client.get(self.list_payment_url, {'start_date': start_date, 'end_date': end_date})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
