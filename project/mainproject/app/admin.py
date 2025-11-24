from django.contrib import admin
from .models import Class, Class_cancellation, Homework, Memo, Class_schedule

# Register your models here.
admin.site.register(Class)
admin.site.register(Class_cancellation)
admin.site.register(Homework)
admin.site.register(Memo)
admin.site.register(Class_schedule)