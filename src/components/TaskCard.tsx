import React, { useState } from 'react';
import { X, Calendar, User, Clock, AlertTriangle, Tag, Save, Edit } from 'lucide-react';

export interface TaskData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  deadline: string;
  duration: string;
  assignee: string;
  creator: string;
  participants: string[];
  watchers: string[];
  priority: 'Низкий' | 'Средний' | 'Высокий' | 'Критический';
  project: string;
  status: 'Новая' | 'В работе' | 'На проверке' | 'Завершена';
  reminderTime: string;
  color: string;
  repeatType: 'Не повторяется' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно';
  plannedHours: string;
  actualHours: string;
  expectedResult: string;
  acceptanceCriteria: string[];
  subtasks: string[];
  relatedTasks: string[];
  tags: string[];
  notifyChanges: boolean;
  sendProgress: boolean;
  remindDeadline: boolean;
}

interface TaskCardProps {
  task: TaskData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskData) => void;
  isEditing: boolean;
  onEdit: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onSave, 
  isEditing, 
  onEdit 
}) => {
  const [editedTask, setEditedTask] = useState<TaskData | null>(null);

  React.useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!isOpen || !task || !editedTask) return null;

  const handleSave = () => {
    onSave(editedTask);
  };

  const updateField = (field: keyof TaskData, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateArrayField = (field: keyof TaskData, index: number, value: string) => {
    setEditedTask(prev => {
      if (!prev) return null;
      const array = [...(prev[field] as string[])];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  const addArrayItem = (field: keyof TaskData) => {
    setEditedTask(prev => {
      if (!prev) return null;
      return { ...prev, [field]: [...(prev[field] as string[]), ''] };
    });
  };

  const removeArrayItem = (field: keyof TaskData, index: number) => {
    setEditedTask(prev => {
      if (!prev) return null;
      const array = (prev[field] as string[]).filter((_, i) => i !== index);
      return { ...prev, [field]: array };
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Низкий': return 'text-green-600 bg-green-100';
      case 'Средний': return 'text-yellow-600 bg-yellow-100';
      case 'Высокий': return 'text-orange-600 bg-orange-100';
      case 'Критический': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Новая': return 'text-blue-600 bg-blue-100';
      case 'В работе': return 'text-yellow-600 bg-yellow-100';
      case 'На проверке': return 'text-purple-600 bg-purple-100';
      case 'Завершена': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="ml-auto w-2/3 h-full bg-white shadow-lg overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Карточка задачи</h2>
              {!isEditing && (
                <button
                  onClick={onEdit}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Edit size={16} />
                  <span>Редактировать</span>
                </button>
              )}
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Save size={16} />
                  <span>Сохранить</span>
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Основная информация */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle size={20} className="mr-2 text-blue-600" />
              Основная информация
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTask.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                {isEditing ? (
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Дата начала</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedTask.startDate}
                      onChange={(e) => updateField('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="text-gray-900">{editedTask.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Время начала</label>
                  {isEditing ? (
                    <input
                      type="time"
                      value={editedTask.startTime}
                      onChange={(e) => updateField('startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="text-gray-900">{editedTask.startTime}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Крайний срок</label>
                  {isEditing ? (
                    <input
                      type="datetime-local"
                      value={editedTask.deadline}
                      onChange={(e) => updateField('deadline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="text-gray-900">{editedTask.deadline}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Продолжительность</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedTask.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="например: 2 часа, 3 дня"
                    />
                  ) : (
                    <p className="text-gray-900">{editedTask.duration}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Ответственные */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User size={20} className="mr-2 text-blue-600" />
              Ответственные
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Исполнитель</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedTask.assignee}
                    onChange={(e) => updateField('assignee', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="email@company.ru"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.assignee}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Постановщик</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedTask.creator}
                    onChange={(e) => updateField('creator', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="email@company.ru"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.creator}</p>
                )}
              </div>
            </div>
          </section>

          {/* Настройки задачи */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Настройки задачи</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
                {isEditing ? (
                  <select
                    value={editedTask.priority}
                    onChange={(e) => updateField('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Низкий">Низкий</option>
                    <option value="Средний">Средний</option>
                    <option value="Высокий">Высокий</option>
                    <option value="Критический">Критический</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(editedTask.priority)}`}>
                    {editedTask.priority}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Проект</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedTask.project}
                    onChange={(e) => updateField('project', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.project}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
                {isEditing ? (
                  <select
                    value={editedTask.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Новая">Новая</option>
                    <option value="В работе">В работе</option>
                    <option value="На проверке">На проверке</option>
                    <option value="Завершена">Завершена</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(editedTask.status)}`}>
                    {editedTask.status}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Учет времени */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-blue-600" />
              Учет времени
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Планируемое время (часы)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedTask.plannedHours}
                    onChange={(e) => updateField('plannedHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.plannedHours}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фактически потрачено (часы)</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedTask.actualHours}
                    onChange={(e) => updateField('actualHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.actualHours}</p>
                )}
              </div>
            </div>
          </section>

          {/* Результат */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Результат</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ожидаемый результат</label>
                {isEditing ? (
                  <textarea
                    value={editedTask.expectedResult}
                    onChange={(e) => updateField('expectedResult', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="text-gray-900">{editedTask.expectedResult}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Критерии приемки</label>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedTask.acceptanceCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={criterion}
                          onChange={(e) => updateArrayField('acceptanceCriteria', index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <button
                          onClick={() => removeArrayItem('acceptanceCriteria', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem('acceptanceCriteria')}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Добавить критерий
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1">
                    {editedTask.acceptanceCriteria.map((criterion, index) => (
                      <li key={index} className="text-gray-900">{criterion}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Теги */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tag size={20} className="mr-2 text-blue-600" />
              Теги
            </h3>
            
            {isEditing ? (
              <div className="space-y-2">
                {editedTask.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateArrayField('tags', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="тег"
                    />
                    <button
                      onClick={() => removeArrayItem('tags', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayItem('tags')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Добавить тег
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedTask.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Уведомления */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Настройки оповещений</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedTask.notifyChanges}
                  onChange={(e) => updateField('notifyChanges', e.target.checked)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="text-gray-700">Уведомлять о изменениях</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedTask.sendProgress}
                  onChange={(e) => updateField('sendProgress', e.target.checked)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="text-gray-700">Отправлять отчеты о прогрессе</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedTask.remindDeadline}
                  onChange={(e) => updateField('remindDeadline', e.target.checked)}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <span className="text-gray-700">Напоминать о приближении срока</span>
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;