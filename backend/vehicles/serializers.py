from rest_framework import serializers
from .models import VehicleComponent
from .models import Vehicle, Issue

class VehicleComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleComponent
        fields = ['id', 'component_name', 'repair_price', 'new_price']

class IssueSerializer(serializers.ModelSerializer):
    component_id = serializers.IntegerField()

    class Meta:
        model = Issue
        fields = ['description', 'component_id', 'is_new']

    def create(self, validated_data):
        component = VehicleComponent.objects.get(id=validated_data.pop('component_id'))
        price = component.new_price if validated_data['is_new'] else component.repair_price
        return Issue.objects.create(price=price, component=component, **validated_data)
    
class VehicleSerializer(serializers.ModelSerializer):
    issues = IssueSerializer(many=True)

    class Meta:
        model = Vehicle
        fields = ['vehicle_name', 'issues']

    def create(self, validated_data):
        issues_data = validated_data.pop('issues')

        vehicle = Vehicle.objects.create(**validated_data)
        
        total_price = 0

        for issue_data in issues_data:
            issue = IssueSerializer(data=issue_data) 
            if issue.is_valid():
                created_issue = issue.save(vehicle=vehicle)  
                total_price += created_issue.price  
            else:
                raise serializers.ValidationError(issue.errors)

        return vehicle, total_price

