from rest_framework import serializers
from .models import CustomerRecord

class CustomerRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerRecord
        fields = '__all__'
