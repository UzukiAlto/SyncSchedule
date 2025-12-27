from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from app.models import Homework
import datetime

# 課題一覧を表示するビュー
@login_required
def display_homework(request):
    # ログインユーザーの授業に紐づく課題を取得し、締め切り順に並べ替え
    homeworks = Homework.objects.filter(
        class_model__author=request.user
    ).select_related('class_model').order_by('deadline', 'is_finished')
    
    context = {
        'homeworks': homeworks,
        'today': datetime.date.today(),
    }
    return render(request, 'display_homework/display_homework.html', context)