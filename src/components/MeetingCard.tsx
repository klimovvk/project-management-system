import React, { useState } from 'react';
import { X, Clock, MapPin, Users, Calendar, Bell, Plus, Trash2, Shield, AlertTriangle } from 'lucide-react';

type UserRole = 'admin' | 'participant';

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface MeetingData {
  id: string;
  name: string;
  type: 'Стратегическое' | 'Рабочее';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  duration: string;
  timezone: string;
  calendar: {
    name: string;
    color: string;
  };
  repeatType: 'Не повторяется' | 'Каждый день' | 'Каждую неделю' | 'Каждые 2 недели' | 'Ежемесячно';
  location: string;
  participants: string[];
  description: string;
  reminders: string[];
  eventColor: string;
  busyStatus: 'Занят' | 'Под вопросом' | 'Свободен';
  notifyParticipants: boolean;
  projectId?: string;
  subprojectId?: string;
}

interface MeetingCardProps {
  meeting: MeetingData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: MeetingData) => void;
  isEditing: boolean;
  onEdit: () => void;
  currentUserRole?: UserRole;
  currentUser?: UserProfile;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  isOpen,
  onClose,
  onSave,
  isEditing,
  onEdit,
  currentUserRole = 'participant',
  currentUser
}) => {
  const [formData, setFormData] = useState<MeetingData>(
    meeting || {
      id: '',
      name: '',
      type: 'Рабочее',
      startDate: '',
      startTime: '14:00',
      endDate: '',
      endTime: '16:00',
      duration: '2 часа',
      timezone: '',
      calendar: {
        name: 'Основной календарь',
        color: '#3B82F6'
      },
      repeatType: 'Не повторяется',
      location: '',
      participants: ['Кирилл Огородов'],
      description: '',
      reminders: ['За 15 минут'],
      eventColor: '#3B82F6',
      busyStatus: 'Занят',
      notifyParticipants: true,
      projectId: undefined,
      subprojectId: undefined
    }
  );

  const [showParticipantInput, setShowParticipantInput] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [showReminderSelect, setShowReminderSelect] = useState(false);
  const [showCustomReminder, setShowCustomReminder] = useState(false);
  const [customReminderDate, setCustomReminderDate] = useState('');
  const [customReminderTime, setCustomReminderTime] = useState('09:00');

  React.useEffect(() => {
    if (meeting) {
      setFormData(meeting);
    }
  }, [meeting]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleInputChange = (field: keyof MeetingData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addParticipant = () => {
    if (newParticipant.trim() && !formData.participants.includes(newParticipant.trim())) {
      handleInputChange('participants', [...formData.participants, newParticipant.trim()]);
      setNewParticipant('');
      setShowParticipantInput(false);
    }
  };

  const removeParticipant = (participant: string) => {
    handleInputChange('participants', formData.participants.filter(p => p !== participant));
  };

  const addReminder = (reminder: string) => {
    if (reminder === 'Другое напоминание' && !showCustomReminder) {
      setShowCustomReminder(true);
      return;
    }
    
    if (!formData.reminders.includes(reminder)) {
      handleInputChange('reminders', [...formData.reminders, reminder]);
    }
    setShowReminderSelect(false);
  };

  const addCustomReminder = () => {
    if (customReminderDate && customReminderTime) {
      const customReminder = `${customReminderDate} в ${customReminderTime}`;
      if (!formData.reminders.includes(customReminder)) {
        handleInputChange('reminders', [...formData.reminders, customReminder]);
      }
      setShowCustomReminder(false);
      setCustomReminderDate('');
      setCustomReminderTime('09:00');
    }
  };

  const removeReminder = (reminder: string) => {
    handleInputChange('reminders', formData.reminders.filter(r => r !== reminder));
  };

  const meetingTypes = ['Стратегическое', 'Рабочее'];
  const repeatOptions = [
    'Не повторяется',
    'Каждый день',
    'Каждую неделю',
    'Каждые 2 недели',
    'Ежемесячно'
  ];
  const locationOptions = [
    'г. Киров, ул. Герцена 1 - Философт',
    'г. Киров, ул. Герцена 1 - Clever'
  ];
  const availableParticipants = [
    'Дмитрий Хрипушин',
    'Алексей Широков'
  ];
  const reminderOptions = [
    'В момент события',
    'За 5 минут до события',
    'За 10 минут до события',
    'За 15 минут до события',
    'За 20 минут до события',
    'За 30 минут до события',
    'За 1 час до события',
    'За 2 часа до события',
    'В день события (09:00)',
    'За 1 день до события (09:00)',
    'За 2 дня до события (09:00)',
    'Другое напоминание'
  ];
  const busyStatuses = ['Занят', 'Под вопросом', 'Свободен'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="ml-auto w-1/2 h-full bg-white shadow-lg overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Редактировать совещание' : 'Детали совещания'}
              </h2>
              <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium">
                {currentUserRole === 'admin' ? (
                  <>
                    <Shield size={12} className="mr-1 text-red-500" />
                    <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full">
                      Администратор
                    </span>
                  </>
                ) : (
                  <>
                    <Users size={12} className="mr-1 text-blue-500" />
                    <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                      Участник
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded"
                >
                  Редактировать
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название совещания
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              Тип совещания
              {currentUserRole === 'admin' && formData.type === 'Стратегическое' && (
                <Shield size={16} className="ml-2 text-red-500" title="Только для администраторов" />
              )}
            </label>
            {isEditing ? (
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as 'Стратегическое' | 'Рабочее')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {meetingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center">
                <p className="text-gray-900">{formData.type}</p>
                {formData.type === 'Стратегическое' && (
                  <Shield size={16} className="ml-2 text-red-500" title="Только для администраторов" />
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock size={16} className="mr-2" />
              Дата и время
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Дата начала
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Время начала
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.startTime}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Дата завершения
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.endDate}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Время завершения
                </label>
                {isEditing ? (
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{formData.endTime}</p>
                )}
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Продолжительность
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{formData.duration}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Календарь
            </label>
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: formData.calendar.color }}
              />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.calendar.name}
                  onChange={(e) => handleInputChange('calendar', { ...formData.calendar, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{formData.calendar.name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Повторяемость
            </label>
            {isEditing ? (
              <select
                value={formData.repeatType}
                onChange={(e) => handleInputChange('repeatType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {repeatOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900">{formData.repeatType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPin size={16} className="mr-2" />
              Место проведения
            </label>
            {isEditing ? (
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите место</option>
                {locationOptions.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900">{formData.location || 'Не указано'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Users size={16} className="mr-2" />
              Участники
            </label>
            <div className="space-y-2">
              {formData.participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-gray-700">{participant}</span>
                  {isEditing && participant !== 'Кирилл Огородов' && (
                    <button
                      onClick={() => removeParticipant(participant)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <div className="space-y-2">
                  {!showParticipantInput ? (
                    <button
                      onClick={() => setShowParticipantInput(true)}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Plus size={14} className="mr-1" />
                      Добавить участника
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={newParticipant}
                        onChange={(e) => setNewParticipant(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Выберите участника</option>
                        {availableParticipants.filter(p => !formData.participants.includes(p)).map(participant => (
                          <option key={participant} value={participant}>{participant}</option>
                        ))}
                      </select>
                      <div className="flex space-x-2">
                        <button
                          onClick={addParticipant}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Добавить
                        </button>
                        <button
                          onClick={() => {
                            setShowParticipantInput(false);
                            setNewParticipant('');
                          }}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Место для подробного описания совещания"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{formData.description || 'Описание не добавлено'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Bell size={16} className="mr-2" />
              Напоминания
            </label>
            <div className="space-y-2">
              {formData.reminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-gray-700">{reminder}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeReminder(reminder)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <div className="relative">
                  {!showReminderSelect && !showCustomReminder ? (
                    <button
                      onClick={() => setShowReminderSelect(true)}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Plus size={14} className="mr-1" />
                      Добавить напоминание
                    </button>
                  ) : showReminderSelect ? (
                    <div className="space-y-2">
                      <select
                        onChange={(e) => addReminder(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        defaultValue=""
                      >
                        <option value="">Выберите напоминание</option>
                        {reminderOptions.filter(option => !formData.reminders.includes(option) || option === 'Другое напоминание').map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowReminderSelect(false)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                      >
                        Отмена
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 p-3 border border-gray-300 rounded">
                      <h4 className="font-medium text-gray-700">Другое напоминание</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={customReminderDate}
                          onChange={(e) => setCustomReminderDate(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="time"
                          value={customReminderTime}
                          onChange={(e) => setCustomReminderTime(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={addCustomReminder}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Выбрать
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomReminder(false);
                            setCustomReminderDate('');
                            setCustomReminderTime('09:00');
                          }}
                          className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цвет события
            </label>
            {isEditing ? (
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.eventColor}
                  onChange={(e) => handleInputChange('eventColor', e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={formData.eventColor}
                  onChange={(e) => handleInputChange('eventColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: formData.eventColor }}
                />
                <span className="text-gray-900">{formData.eventColor}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус занятости
            </label>
            {isEditing ? (
              <select
                value={formData.busyStatus}
                onChange={(e) => handleInputChange('busyStatus', e.target.value as 'Занят' | 'Под вопросом' | 'Свободен')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {busyStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900">{formData.busyStatus}</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.notifyParticipants}
                onChange={(e) => handleInputChange('notifyParticipants', e.target.checked)}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Оповещать о подтверждении/отказе участников
              </span>
            </label>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Сохранить событие
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;