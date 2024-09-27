from rest_framework.test import APITestCase
from rest_framework import status
from .models import VehicleComponent
from django.urls import reverse

class VehicleTests(APITestCase):
    def setUp(self):
        self.component1 = VehicleComponent.objects.create(
            component_name='Brakes',
            repair_price=150.00,
            new_price=300.00
        )
        self.component2 = VehicleComponent.objects.create(
            component_name='Engine',
            repair_price=500.00,
            new_price=1000.00
        )

        # Define URLs
        self.component_url = reverse('component-list-create')
        self.issue_url = reverse('issue-create')

    def test_create_vehicle_component(self):
        """Test creating a vehicle component"""
        data = {
            'component_name': 'Tires',
            'repair_price': 80.00,
            'new_price': 160.00
        }
        response = self.client.post(self.component_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VehicleComponent.objects.count(), 3)
        self.assertEqual(VehicleComponent.objects.get(id=3).component_name, 'Tires')

    def test_list_vehicle_components(self):
        """Test listing vehicle components"""
        response = self.client.get(self.component_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) 

    def test_create_vehicle_with_issues(self):
        """Test creating a vehicle with issues"""
        data = {
            'vehicle_name': 'Car 1',
            'issues': [
                {
                    'description': 'Brake replacement',
                    'component_id': self.component1.id,
                    'is_new': True
                },
                {
                    'description': 'Engine repair',
                    'component_id': self.component2.id,
                    'is_new': False
                }
            ]
        }
        response = self.client.post(self.issue_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('total_price', response.data)
        self.assertEqual(response.data['total_price'], 800.00)  