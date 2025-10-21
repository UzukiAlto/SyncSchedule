from django.shortcuts import render, get_object_or_404, redirect
from .models import Class
from django.http import HttpResponse
from .forms import ClassForm
from django.contrib.auth.decorators import login_required

def get_class_context():
    context = {}
    classes = Class.objects.all()
    # 授業を入れる配列[曜日][時限]
    class_list = [[None for _ in range(8)] for _ in range(6)]
    exist_saturday_class = False
    subject = classes[0]
    
    for subject in classes:
        class_list[subject.day_of_the_week][subject.period - 1] = subject
        if subject.day_of_the_week == 5:  # 土曜日のクラスが存在するか確認
            exist_saturday_class = True
            
    context["class_list"] = class_list
    context["exist_saturday_class"] = exist_saturday_class
    return context

def index(request):
    context = get_class_context()
    return render(request, "app/index.html", context=context)

@login_required
def home_edit(request):
    context = get_class_context()
    
    if request.method == "POST":
        form = ClassForm(request.POST)
        if form.is_valid():
            class_form = form.save(commit=False)
            class_form.author = request.user
            class_form.save()
            context.clear()
            
            context = get_class_context()
            context["form"] = ClassForm()
            return render(request, "app/home-edit.html", context=context)
        return render(request, "app/home-edit.html", {"form": ClassForm()}, context=context)
    elif request.method == "GET":
        form = ClassForm()
        context["form"] = form
        return render(request, "app/home-edit.html", context=context)