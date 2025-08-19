import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskData } from './TaskCard';
import { MeetingData } from './MeetingCard';

interface WeekViewProps {
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
  date: string;
}

const WeekView: React.FC<WeekViewProps> = ({
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

  const getWeekDates = (date: Date): Date[] => {
    const week = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }

    return week;
  };

  const formatWeekHeader = (date: Date) => {
    const weekDates = getWeekDates(date);
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 
                   'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    
    const month = months[firstDay.getMonth()];
    const startDay = firstDay.getDate();
    const endDay = lastDay.getDate();
    
    return `${month}, неделя ${startDay}–${endDay}`;
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isCurrentWeek = (date: Date) => {
    const today = new Date();
    const weekDates = getWeekDates(date);
    return weekDates.some(weekDate => weekDate.toDateString() === today.toDateString());
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  };

  const getEventsForWeek = (date: Date): CalendarEvent[] => {
    const weekDates = getWeekDates(date);
    const events: CalendarEvent[] = [];

    weekDates.forEach(weekDate => {
      const dateString = weekDate.toISOString().split('T')[0];

      tasks.forEach(task => {
        if (task.startDate === dateString && task.startTime) {
          events.push({
            id: task.id,
            title: task.name,
            startTime: task.startTime,
            endTime: task.startTime,
            color: task.color || '#3B82F6',
            type: 'task',
            data: task,
            date: dateString
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
            data: meeting,
            date: dateString
          });
        }
      });
    });

    return events;
  };

  const getCurrentTimePosition = () => {
    if (!isCurrentWeek(selectedDate)) return null;
    
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
  const weekDates = getWeekDates(selectedDate);
  const events = getEventsForWeek(selectedDate);
  const currentTimePosition = getCurrentTimePosition();

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {formatWeekHeader(selectedDate)}
            </h2>
            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {!isCurrentWeek(selectedDate) && (
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
            <div className="h-12 border-b border-gray-200"></div>
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

          <div className="flex-1">
            <div className="flex border-b border-gray-200">
              {weekDates.map((date, index) => (
                <div
                  key={date.toISOString()}
                  className={`flex-1 h-12 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center text-sm ${
                    isWeekend(date) 
                      ? 'bg-gray-50' 
                      : isToday(date)
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white'
                  }`}
                >
                  <div className="font-medium">{dayNames[index]}</div>
                  <div className={`text-xs ${isToday(date) ? 'font-bold' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative flex">
              {weekDates.map((date, index) => (
                <div
                  key={date.toISOString()}
                  className={`flex-1 border-r border-gray-200 last:border-r-0 relative ${
                    isWeekend(date) ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  {hours.map(hour => (
                    <div key={hour} className="h-12 border-b border-gray-100"></div>
                  ))}

                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    {events
                      .filter(event => event.date === date.toISOString().split('T')[0])
                      .map(event => {
                        const position = getEventPosition(event);
                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 rounded px-1 py-1 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                              top: `${position.top}%`,
                              height: `${position.height}%`,
                              backgroundColor: event.color,
                              color: 'white',
                              fontSize: '10px',
                              zIndex: 5
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-xs opacity-90">
                              {event.startTime}
                              {event.endTime !== event.startTime && `-${event.endTime}`}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}

              {currentTimePosition !== null && (
                <div
                  className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                  style={{ top: `${currentTimePosition}%` }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full -mt-1 -ml-1"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;