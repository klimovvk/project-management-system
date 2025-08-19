import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskData } from './TaskCard';
import { MeetingData } from './MeetingCard';

interface DayViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  tasks: TaskData[];
  meetings: MeetingData[];
  onTaskClick: (task: TaskData) => void;
  onMeetingClick: (meeting: MeetingData) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  type: 'task' | 'meeting';
  data: TaskData | MeetingData;
}

const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  onDateChange,
  tasks,
  meetings,
  onTaskClick,
  onMeetingClick
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 
                   'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}, ${dayName}`;
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateString = date.toISOString().split('T')[0];
    const events: CalendarEvent[] = [];

    tasks.forEach(task => {
      if (task.startDate === dateString && task.startTime) {
        events.push({
          id: task.id,
          title: task.name,
          startTime: task.startTime,
          endTime: task.startTime, 
          color: task.color || '#3B82F6',
          type: 'task',
          data: task
        });
      }
    });

    meetings.forEach(meeting => {
      if (meeting.startDate === dateString) {
        events.push({
          id: meeting.id,
          title: meeting.name,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          color: meeting.eventColor,
          type: 'meeting',
          data: meeting
        });
      }
    });

    return events.sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
  };

  const getCurrentTimePosition = () => {
    if (!isToday(selectedDate)) return null;
    
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const timeInHours = hours + minutes / 60;
    
    return (timeInHours / 24) * 100;
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startTime = parseTime(event.startTime);
    const endTime = parseTime(event.endTime);
    const duration = endTime - startTime;
    
    const top = (startTime / 24) * 100;
    const height = Math.max((duration / 24) * 100, 2); 
    
    return { top, height };
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'task') {
      onTaskClick(event.data as TaskData);
    } else {
      onMeetingClick(event.data as MeetingData);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const events = getEventsForDate(selectedDate);
  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {formatDate(selectedDate)}
            </h2>
            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {!isToday(selectedDate) && (
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Сегодня
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="flex">
          <div className="w-16 border-r border-gray-200">
            {hours.map(hour => (
              <div key={hour} className="h-12 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
                {hour > 0 && (
                  <span className="text-xs text-gray-500">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 relative">
            {hours.map(hour => (
              <div key={hour} className="h-12 border-b border-gray-100"></div>
            ))}

            {currentTimePosition !== null && (
              <div
                className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full -mt-1 -ml-1"></div>
              </div>
            )}

            <div className="absolute top-0 left-0 right-0 bottom-0">
              {events.map((event, index) => {
                const position = getEventPosition(event);
                return (
                  <div
                    key={event.id}
                    className="absolute left-1 right-1 rounded px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      top: `${position.top}%`,
                      height: `${position.height}%`,
                      backgroundColor: event.color,
                      color: 'white',
                      fontSize: '12px',
                      zIndex: 5
                    }}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs opacity-90">
                      {event.startTime}
                      {event.endTime !== event.startTime && ` - ${event.endTime}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;