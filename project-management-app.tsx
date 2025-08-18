import React, { useState } from 'react';
import { Calendar, User, Users, FolderOpen, ChevronRight, Menu, X, Plus } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('my-work');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubproject, setSelectedSubproject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [projectsData, setProjectsData] = useState({
    'project-1': {
      name: 'Проект 1',
      subprojects: {
        'subproject-1': {
          name: 'Подпроект 1',
          tasks: ['Задача 1 Подпроекта 1', 'Задача 2 Подпроекта 1']
        },
        'subproject-2': {
          name: 'Подпроект 2',
          tasks: ['Задача 1 Подпроекта 2', 'Задача 2 Подпроекта 2']
        }
      },
      tasks: ['Задача Проекта 1']
    }
  });
  const [meetingsData, setMeetingsData] = useState([
    { id: '1', name: 'Совещание 1', projectId: 'project-1', subprojectId: null },
    { id: '2', name: 'Совещание 2', projectId: null, subprojectId: null }
  ]);

  const projects = projectsData;
  const meetings = meetingsData.map(m => m.name);

  const userStats = {
    totalTasks: 5,
    completedTasks: 2,
    upcomingMeetings: 2,
    activeProjects: 1
  };

  const menuItems = [
    { id: 'my-work', name: 'Моя работа', icon: User, defaultTab: 'dashboard' },
    { id: 'calendar', name: 'Календарь', icon: Calendar, defaultTab: 'day' },
    { id: 'meetings', name: 'Совещания', icon: Users, defaultTab: 'all-meetings' },
    { id: 'projects', name: 'Проекты', icon: FolderOpen, defaultTab: 'all-projects' }
  ];

  const handleMenuItemClick = (item) => {
    setCurrentPage(item.id);
    setCurrentTab(item.defaultTab);
    setSelectedProject(null);
    setSelectedSubproject(null);
    setSidebarOpen(false);
  };

  const handleCreateClick = (type) => {
    setModalType(type);
    setShowModal(true);
    setShowCreateMenu(false);
    setNewItemName('');
    setSelectedParent('');
  };

  const handleCreateSubmit = () => {
    if (!newItemName.trim()) return;

    if (modalType === 'project') {
      const newId = 'project-' + (Object.keys(projectsData).length + 1);
      if (selectedParent) {
        const [projectId] = selectedParent.split('-');
        const newSubId = 'subproject-' + (Object.keys(projectsData[projectId].subprojects).length + 1);
        setProjectsData(prev => ({
          ...prev,
          [projectId]: {
            ...prev[projectId],
            subprojects: {
              ...prev[projectId].subprojects,
              [newSubId]: {
                name: newItemName,
                tasks: []
              }
            }
          }
        }));
      } else {
        setProjectsData(prev => ({
          ...prev,
          [newId]: {
            name: newItemName,
            subprojects: {},
            tasks: []
          }
        }));
      }
    } else if (modalType === 'task') {
      if (selectedParent) {
        const [projectId, subprojectId] = selectedParent.split('-');
        if (subprojectId) {
          setProjectsData(prev => ({
            ...prev,
            [projectId]: {
              ...prev[projectId],
              subprojects: {
                ...prev[projectId].subprojects,
                [subprojectId]: {
                  ...prev[projectId].subprojects[subprojectId],
                  tasks: [...prev[projectId].subprojects[subprojectId].tasks, newItemName]
                }
              }
            }
          }));
        } else {
          setProjectsData(prev => ({
            ...prev,
            [projectId]: {
              ...prev[projectId],
              tasks: [...prev[projectId].tasks, newItemName]
            }
          }));
        }
      }
    } else if (modalType === 'meeting') {
      const newId = Date.now().toString();
      const [projectId, subprojectId] = selectedParent ? selectedParent.split('-') : [null, null];
      setMeetingsData(prev => [...prev, {
        id: newId,
        name: newItemName,
        projectId: projectId || null,
        subprojectId: subprojectId || null
      }]);
    }

    setShowModal(false);
    setNewItemName('');
    setSelectedParent('');
  };

  const getParentOptions = () => {
    const options = [];
    Object.entries(projectsData).forEach(([projectId, project]) => {
      if (modalType === 'project') {
        options.push({ value: projectId, label: project.name });
      } else {
        options.push({ value: projectId, label: project.name });
        Object.entries(project.subprojects).forEach(([subId, subproject]) => {
          options.push({ value: `${projectId}-${subId}`, label: `${project.name} → ${subproject.name}` });
        });
      }
    });
    return options;
  };

  const getRelatedMeetings = (projectId, subprojectId = null) => {
    return meetingsData.filter(meeting => 
      meeting.projectId === projectId && meeting.subprojectId === subprojectId
    );
  };

  const Sidebar = () => (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full w-64 bg-blue-600 text-white z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Управление проектами</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );

  const TopBar = () => (
    <div className="lg:ml-64 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {menuItems.find(item => item.id === currentPage)?.name}
        </h1>
      </div>
    </div>
  );

  const TabBar = ({ tabs, currentTab, onTabChange }) => (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              currentTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );

  const MyWorkPage = () => {
    const tabs = [
      { id: 'dashboard', name: 'Дашборд' },
      { id: 'tasks-meetings', name: 'Задачи и совещания' }
    ];

    return (
      <div>
        <TabBar tabs={tabs} currentTab={currentTab} onTabChange={setCurrentTab} />
        
        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Всего задач</h3>
              <p className="text-3xl font-bold text-blue-600">{userStats.totalTasks}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Выполнено</h3>
              <p className="text-3xl font-bold text-green-600">{userStats.completedTasks}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Предстоящие совещания</h3>
              <p className="text-3xl font-bold text-orange-600">{userStats.upcomingMeetings}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-gray-700">Активные проекты</h3>
              <p className="text-3xl font-bold text-purple-600">{userStats.activeProjects}</p>
            </div>
          </div>
        )}

        {currentTab === 'tasks-meetings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Задачи</h3>
              <div className="bg-white rounded-lg shadow border">
                {Object.values(projects).map(project =>
                  [...Object.values(project.subprojects).flatMap(sub => sub.tasks), ...project.tasks].map((task, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                      <p className="text-gray-800">{task}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Совещания</h3>
              <div className="bg-white rounded-lg shadow border">
                {meetings.map((meeting, index) => (
                  <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                    <p className="text-gray-800">{meeting}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CalendarPage = () => {
    const tabs = [
      { id: 'day', name: 'День' },
      { id: 'week', name: 'Неделя' },
      { id: 'month', name: 'Месяц' }
    ];

    return (
      <div>
        <TabBar tabs={tabs} currentTab={currentTab} onTabChange={setCurrentTab} />
        
        <div className="bg-white rounded-lg shadow border p-6">
          <p className="text-gray-600 mb-4">Просмотр: {tabs.find(tab => tab.id === currentTab)?.name}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Задачи</h3>
              <div className="space-y-2">
                {Object.values(projects).map(project =>
                  [...Object.values(project.subprojects).flatMap(sub => sub.tasks), ...project.tasks].map((task, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800">{task}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Совещания</h3>
              <div className="space-y-2">
                {meetings.map((meeting, index) => (
                  <div key={index} className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800">{meeting}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MeetingsPage = () => {
    const tabs = [{ id: 'all-meetings', name: 'Все совещания' }];

    return (
      <div>
        <TabBar tabs={tabs} currentTab={currentTab} onTabChange={setCurrentTab} />
        
        <div className="bg-white rounded-lg shadow border">
          {meetingsData.map((meeting, index) => (
            <div key={index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
              <h3 className="font-medium text-gray-800">{meeting.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Статус: Запланировано</p>
              {meeting.projectId && (
                <p className="text-sm text-blue-600 mt-1">
                  Связано с: {projectsData[meeting.projectId]?.name}
                  {meeting.subprojectId && ` → ${projectsData[meeting.projectId]?.subprojects[meeting.subprojectId]?.name}`}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProjectsPage = () => {
    if (selectedSubproject) {
      const project = projects[selectedProject];
      const subproject = project.subprojects[selectedSubproject];
      const relatedMeetings = getRelatedMeetings(selectedProject, selectedSubproject);
      
      return (
        <div>
          <div className="flex items-center mb-4">
            <button
              onClick={() => setSelectedSubproject(null)}
              className="text-blue-600 hover:text-blue-800 mr-2"
            >
              ← Назад
            </button>
            <h2 className="text-xl font-semibold">{subproject.name}</h2>
          </div>
          
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                <button
                  onClick={() => setCurrentTab('tasks')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentTab === 'tasks'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Задачи
                </button>
                <button
                  onClick={() => setCurrentTab('meetings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentTab === 'meetings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Совещания
                </button>
              </div>
            </div>
          </div>

          {currentTab === 'tasks' && (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Задачи подпроекта</h3>
              </div>
              {subproject.tasks.map((task, index) => (
                <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                  <p className="text-gray-800">{task}</p>
                </div>
              ))}
            </div>
          )}

          {currentTab === 'meetings' && (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Связанные совещания</h3>
              </div>
              {relatedMeetings.length > 0 ? (
                relatedMeetings.map((meeting, index) => (
                  <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                    <p className="text-gray-800">{meeting.name}</p>
                    <p className="text-sm text-gray-500 mt-1">Статус: Запланировано</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">
                  Нет связанных совещаний
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (selectedProject) {
      const project = projects[selectedProject];
      const relatedMeetings = getRelatedMeetings(selectedProject);
      
      return (
        <div>
          <div className="flex items-center mb-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="text-blue-600 hover:text-blue-800 mr-2"
            >
              ← Назад
            </button>
            <h2 className="text-xl font-semibold">{project.name}</h2>
          </div>
          
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                <button
                  onClick={() => setCurrentTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Обзор
                </button>
                <button
                  onClick={() => setCurrentTab('meetings')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentTab === 'meetings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Совещания
                </button>
              </div>
            </div>
          </div>

          {currentTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Подпроекты</h3>
                <div className="bg-white rounded-lg shadow border">
                  {Object.entries(project.subprojects).map(([subId, subproject]) => (
                    <div
                      key={subId}
                      onClick={() => {
                        setSelectedSubproject(subId);
                        setCurrentTab('tasks');
                      }}
                      className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-gray-800">{subproject.name}</h4>
                        <p className="text-sm text-gray-500">{subproject.tasks.length} задач</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Задачи проекта</h3>
                <div className="bg-white rounded-lg shadow border">
                  {project.tasks.map((task, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                      <p className="text-gray-800">{task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'meetings' && (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold">Связанные совещания</h3>
              </div>
              {relatedMeetings.length > 0 ? (
                relatedMeetings.map((meeting, index) => (
                  <div key={index} className="p-4 border-b border-gray-100 last:border-b-0">
                    <p className="text-gray-800">{meeting.name}</p>
                    <p className="text-sm text-gray-500 mt-1">Статус: Запланировано</p>
                    {meeting.subprojectId && (
                      <p className="text-sm text-blue-600 mt-1">
                        Подпроект: {project.subprojects[meeting.subprojectId]?.name}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">
                  Нет связанных совещаний
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    const tabs = [{ id: 'all-projects', name: 'Все проекты' }];

    return (
      <div>
        <TabBar tabs={tabs} currentTab={currentTab} onTabChange={setCurrentTab} />
        
        <div className="bg-white rounded-lg shadow border">
          {Object.entries(projects).map(([projectId, project]) => (
            <div
              key={projectId}
              onClick={() => {
                setSelectedProject(projectId);
                setCurrentTab('overview');
              }}
              className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    {Object.keys(project.subprojects).length} подпроектов, {project.tasks.length} задач
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'my-work':
        return <MyWorkPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'meetings':
        return <MeetingsPage />;
      case 'projects':
        return <ProjectsPage />;
      default:
        return <MyWorkPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      
      <div className="lg:ml-64 px-6 py-8">
        {renderCurrentPage()}
      </div>

      <div className="fixed bottom-6 right-6 z-30">
        <div className="relative">
          {showCreateMenu && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border py-2 min-w-48">
              <button
                onClick={() => handleCreateClick('project')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <FolderOpen size={16} />
                <span>Проект</span>
              </button>
              <button
                onClick={() => handleCreateClick('task')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <User size={16} />
                <span>Задачу</span>
              </button>
              <button
                onClick={() => handleCreateClick('meeting')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Users size={16} />
                <span>Совещание</span>
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
          >
            <Plus size={24} className={`transform transition-transform ${showCreateMenu ? 'rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="ml-auto w-1/2 h-full bg-white shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {modalType === 'project' && 'Создать проект'}
                  {modalType === 'task' && 'Создать задачу'}
                  {modalType === 'meeting' && 'Создать совещание'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Введите название ${modalType === 'project' ? 'проекта' : modalType === 'task' ? 'задачи' : 'совещания'}`}
                />
              </div>

              {(modalType === 'project' || modalType === 'task' || modalType === 'meeting') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {modalType === 'project' && 'Вложить в проект (опционально)'}
                    {modalType === 'task' && 'Добавить к проекту/подпроекту'}
                    {modalType === 'meeting' && 'Связать с проектом/подпроектом (опционально)'}
                  </label>
                  <select
                    value={selectedParent}
                    onChange={(e) => setSelectedParent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Не выбрано</option>
                    {getParentOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex space-x-3">
                <button
                  onClick={handleCreateSubmit}
                  disabled={!newItemName.trim() || (modalType === 'task' && !selectedParent)}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md"
                >
                  Создать
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowCreateMenu(false)}
        />
      )}
    </div>
  );
};

export default App;