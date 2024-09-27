from rest_framework import generics
from .models import VehicleComponent
from .serializers import VehicleComponentSerializer
from rest_framework.response import Response
from rest_framework import status


from .serializers import VehicleSerializer

class VehicleComponentListCreateView(generics.ListCreateAPIView):
    queryset = VehicleComponent.objects.all()
    serializer_class = VehicleComponentSerializer


class VehicleCreateView(generics.CreateAPIView):
    serializer_class = VehicleSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vehicle, total_price = serializer.save()  
        
        return Response({'total_price': total_price}, status=status.HTTP_201_CREATED)