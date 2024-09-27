from django.db import models

class VehicleComponent(models.Model):
    component_name = models.CharField(max_length=255)
    repair_price = models.DecimalField(max_digits=10, decimal_places=2)
    new_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.component_name

class Vehicle(models.Model):
    vehicle_name = models.CharField(max_length=255)

    def __str__(self):
        return self.vehicle_name

class Issue(models.Model):
    vehicle = models.ForeignKey(Vehicle, related_name='issues', on_delete=models.CASCADE)
    description = models.TextField()
    component = models.ForeignKey(VehicleComponent, on_delete=models.CASCADE)
    is_new = models.BooleanField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  

    def __str__(self):
        return f"{self.description} - {'New' if self.is_new else 'Repair'}"