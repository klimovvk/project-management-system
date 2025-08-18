#!/usr/bin/env python3
"""
Скрипт для анализа логов сессий Claude Code
Помогает быстро понять активность в проекте
"""

import json
import os
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict

def analyze_session_logs():
    """Анализирует логи сессий и выводит статистику"""
    
    project_dir = Path(__file__).parent.parent.parent
    logs_dir = project_dir / '.claude' / 'logs'
    
    if not logs_dir.exists():
        print("📁 Логи еще не создались. Начните работу с Claude Code!")
        return
    
    # Собираем все лог-файлы
    log_files = list(logs_dir.glob('sessions-*.log'))
    
    if not log_files:
        print("📝 Логи сессий пока пусты")
        return
    
    sessions = []
    prompts = []
    
    # Читаем все логи
    for log_file in sorted(log_files):
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    entry = json.loads(line.strip())
                    if entry['event_type'] == 'session_start':
                        sessions.append(entry)
                    elif entry['event_type'] == 'user_prompt':
                        prompts.append(entry)
                except json.JSONDecodeError:
                    continue
    
    # Анализируем статистику
    print("📊 СТАТИСТИКА ПРОЕКТА")
    print("=" * 50)
    
    # Общая статистика
    print(f"🎯 Всего сессий: {len(sessions)}")
    print(f"💬 Всего промптов: {len(prompts)}")
    
    if sessions:
        # Последняя сессия
        last_session = max(sessions, key=lambda x: x['timestamp'])
        last_time = datetime.fromisoformat(last_session['timestamp'])
        print(f"🕐 Последняя активность: {last_time.strftime('%Y-%m-%d %H:%M')}")
        
        # Активность по дням
        daily_activity = defaultdict(int)
        for session in sessions:
            date = datetime.fromisoformat(session['timestamp']).strftime('%Y-%m-%d')
            daily_activity[date] += 1
        
        print(f"📅 Активных дней: {len(daily_activity)}")
        
        # Показываем последние 7 дней
        print("\n📈 АКТИВНОСТЬ ПО ДНЯМ (последние 7 дней):")
        for i in range(7):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            count = daily_activity.get(date, 0)
            bar = "█" * min(count, 20)
            print(f"  {date}: {bar} ({count} сессий)")
    
    if prompts:
        # Статистика промптов
        total_chars = sum(p.get('prompt_length', 0) for p in prompts)
        avg_length = total_chars / len(prompts) if prompts else 0
        
        print(f"\n💭 СТАТИСТИКА ПРОМПТОВ:")
        print(f"  📝 Средняя длина: {avg_length:.0f} символов")
        print(f"  📊 Общий объем: {total_chars:,} символов")
        
        # Последние промпты
        recent_prompts = sorted(prompts, key=lambda x: x['timestamp'])[-5:]
        print(f"\n🔍 ПОСЛЕДНИЕ ЗАПРОСЫ:")
        for prompt in recent_prompts:
            time = datetime.fromisoformat(prompt['timestamp']).strftime('%H:%M')
            preview = prompt.get('prompt_preview', 'нет превью')
            print(f"  {time}: {preview}")

if __name__ == "__main__":
    analyze_session_logs()