from django.test import TestCase
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse


class CustomUserModelTests(TestCase):
    def setUp(self):
        self.user_model = get_user_model()

    def test_create_user(self):
        """Test if a user can be created with email and password"""
        email = "testuser@example.com"
        password = "testpassword123"
        user = self.user_model.objects.create_user(email=email, password=password)
        
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertFalse(user.is_staff)
        self.assertTrue(user.is_active)
    
    def test_create_user_without_email_raises_error(self):
        """Test if creating a user without email raises ValueError"""
        with self.assertRaises(ValueError):
            self.user_model.objects.create_user(email=None, password="password123")

class UserSerializerTests(TestCase):
    def test_valid_user_creation(self):
        """Test valid data for creating a new user"""
        data = {
            'email': 'newuser@example.com',
            'password': 'newuserpassword123',
            'user_type': 'customer'
        }
        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, data['email'])
        self.assertTrue(user.check_password(data['password']))
        self.assertEqual(user.user_type, data['user_type'])

    def test_invalid_user_creation(self):
        """Test invalid data (missing password) for user creation"""
        data = {
            'email': 'newuser@example.com',
            'user_type': 'customer'
        }
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

class UserViewTests(APITestCase):
    def setUp(self):
        self.user_model = get_user_model()
        self.register_url = reverse('register') 
        self.login_url = reverse('login')
        self.user = self.user_model.objects.create_user(
            email='existinguser@example.com', password='password123', user_type='customer')

    def test_register_user(self):
        """Test registering a new user"""
        data = {
            'email': 'newuser@example.com',
            'password': 'newpassword123',
            'user_type': 'customer'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], data['email'])

    def test_login_user(self):
        """Test logging in an existing user"""
        data = {
            'email': 'existinguser@example.com',
            'password': 'password123'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user_type'], self.user.user_type)

    def test_login_invalid_credentials(self):
        """Test logging in with invalid credentials"""
        data = {
            'email': 'existinguser@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid Credentials')
