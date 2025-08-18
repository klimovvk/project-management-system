#!/usr/bin/env python3
"""
Хук для логирования сессий Claude Code
Сохраняет информацию о начале и завершении сессий
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path

def log_session_event(input_data, event_type):
    """Логирует событие сессии в файл"""
    
    project_dir = os.environ.get('CLAUDE_PROJECT_DIR', os.getcwd())
    logs_dir = Path(project_dir) / '.claude' / 'logs'
    logs_dir.mkdir(parents=True, exist_ok=True)
    
    # Создаем имя файла на основе даты
    log_file = logs_dir / f"sessions-{datetime.now().strftime('%Y-%m')}.log"
    
    # Готовим запись лога
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'event_type': event_type,
        'session_id': input_data.get('session_id', 'unknown'),
        'hook_event_name': input_data.get('hook_event_name'),
        'source': input_data.get('source', 'unknown'),
        'cwd': input_data.get('cwd', 'unknown')
    }
    
    # Добавляем специфичную информацию для разных событий
    if event_type == 'session_start':
        log_entry['source'] = input_data.get('source', 'startup')
    elif event_type == 'session_stop':
        log_entry['stop_hook_active'] = input_data.get('stop_hook_active', False)
    elif event_type == 'user_prompt':
        prompt = input_data.get('prompt', '')
        log_entry['prompt_length'] = len(prompt)
        log_entry['prompt_preview'] = prompt[:100] + '...' if len(prompt) > 100 else prompt
    
    # Записываем в файл
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
    
    return log_entry

def main():
    """Основная функция хука"""
    
    try:
        # Читаем входные данные
        input_data = json.load(sys.stdin)
        
        # Определяем тип события
        hook_event_name = input_data.get('hook_event_name', '')
        
        if hook_event_name == 'SessionStart':
            log_entry = log_session_event(input_data, 'session_start')
            print(f"🚀 Сессия начата: {log_entry['session_id'][:8]}...")
            
            # Добавляем контекст о проекте для SessionStart
            context_info = f"""
## Информация о проекте на {datetime.now().strftime('%Y-%m-%d %H:%M')}

Сессия: {log_entry['session_id'][:8]}
Источник запуска: {log_entry['source']}
Рабочая папка: {log_entry['cwd']}

Это система управления проектами на React + TypeScript + Vite.
Основной функционал: карточки задач, календарь, совещания.
            """
            
            # Для SessionStart возвращаем контекст
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "SessionStart",
                    "additionalContext": context_info.strip()
                }
            }
            print(json.dumps(output))
            
        elif hook_event_name == 'Stop':
            log_entry = log_session_event(input_data, 'session_stop')
            print(f"⏹️ Сессия завершена: {log_entry['session_id'][:8]}...")
            
        elif hook_event_name == 'UserPromptSubmit':
            log_entry = log_session_event(input_data, 'user_prompt')
            print(f"💬 Промпт отправлен ({log_entry['prompt_length']} символов)")
            
    except json.JSONDecodeError as e:
        print(f"❌ Ошибка декодирования JSON: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Неожиданная ошибка: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()