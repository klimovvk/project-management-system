import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TaskData } from './TaskCard';
import { MeetingData } from './MeetingCard';

interface MonthViewProps {
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

const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  onDateChange,
  tasks,
  meetings,
  onTaskClick,
  onMeetingClick
}) => {

  const getMonthDates = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const firstDayWeekday = firstDayOfMonth.getDay();
    const mondayOffset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - mondayOffset);
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const formatMonthHeader = (date: Date) => {
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                   'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${year}`;
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isCurrentMonthPeriod = (date: Date) => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateString = date.toISOString().split('T')[0];
    const events: CalendarEvent[] = [];

    tasks.forEach(task => {
      if (task.startDate === dateString) {
        events.push({
          id: task.id,
          title: task.name,
          startTime: task.startTime || '',
          endTime: task.startTime || '',
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

    return events.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.type === 'task') {
      onTaskClick(event.data as TaskData);
    } else {
      onMeetingClick(event.data as MeetingData);
    }
  };

  const monthDates = getMonthDates(selectedDate);
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const weeks = [];
  for (let i = 0; i < monthDates.length; i += 7) {
    weeks.push(monthDates.slice(i, i + 7));
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold">
              {formatMonthHeader(selectedDate)}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {!isCurrentMonthPeriod(selectedDate) && (
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Сегодня
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => 
            week.map((date, dayIndex) => {
              const events = getEventsForDate(date);
              const displayEvents = events.slice(0, 3);
              const moreEventsCount = events.length - displayEvents.length;

              return (
                <div
                  key={date.toISOString()}
                  className={`
                    h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                    ${isToday(date) ? 'bg-blue-50 border-blue-300' : ''}
                    ${!isCurrentMonth(date) ? 'text-gray-400 bg-gray-50' : ''}
                  `}
                  onClick={() => onDateChange(date)}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isToday(date) ? 'text-blue-600 font-bold' : ''}
                    ${!isCurrentMonth(date) ? 'text-gray-400' : 'text-gray-900'}
                  `}>
                    {date.getDate()}
                  </div>

                  <div className="space-y-1">
                    {displayEvents.map(event => (
                      <div
                        key={event.id}
                        className="text-xs px-1 py-0.5 rounded text-white cursor-pointer hover:opacity-80 truncate"
                        style={{ backgroundColor: event.color }}
                        onClick={(e) => handleEventClick(event, e)}
                        title={`${event.title} ${event.startTime ? `(${event.startTime})` : ''}`}
                      >
                        {event.startTime && (
                          <span className="font-medium">{event.startTime} </span>
                        )}
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    
                    {moreEventsCount > 0 && (
                      <div className="text-xs text-gray-600 px-1">
                        еще {moreEventsCount}...
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthView;