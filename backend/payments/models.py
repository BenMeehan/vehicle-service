from django.db import models
from django.conf import settings

class Payment(models.Model):
    user = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    vehicle_name = models.CharField(max_length=255)
    issues = models.IntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of ${self.amount} for {self.vehicle_name} by {self.user}"
