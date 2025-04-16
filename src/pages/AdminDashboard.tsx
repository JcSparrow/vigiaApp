import React, { useState } from 'react';
import { Shield, Users, AlertTriangle, BarChart3, MessageSquare, Flag, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Menu } from '@headlessui/react';

interface Case {
  id: string;
  type: 'vehicle' | 'person';
  title: string;
  status: 'pending' | 'verified' | 'resolved' | 'false';
  createdAt: Date;
  reports: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended';
  joinedAt: Date;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'cases' | 'users' | 'reports' | 'stats'>('cases');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    date: 'all'
  });

  const cases: Case[] = [
    {
      id: '1',
      type: 'vehicle',
      title: 'Honda Civic Preto - ABC-1234',
      status: 'pending',
      createdAt: new Date('2024-03-10'),
      reports: 0
    },
    {
      id: '2',
      type: 'person',
      title: 'João Silva - Desaparecido',
      status: 'verified',
      createdAt: new Date('2024-03-09'),
      reports: 2
    }
  ];

  const users: User[] = [
    {
      id: '1',
      name: 'Maria Santos',
      email: 'maria@email.com',
      role: 'moderator',
      status: 'active',
      joinedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Carlos Silva',
      email: 'carlos@email.com',
      role: 'user',
      status: 'suspended',
      joinedAt: new Date('2024-02-20')
    }
  ];

  const stats = {
    totalCases: 1234,
    resolvedCases: 789,
    averageResolutionTime: '5.2 dias',
    activeUsers: 5678,
    reportedContent: 42,
    verifiedCases: 456
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <h1 className="text-2xl font-bold">VigiaApp Admin</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <button
              onClick={() => setActiveTab('cases')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'cases' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Casos</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Usuários</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'reports' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Flag className="h-5 w-5" />
              <span>Denúncias</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'stats' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Estatísticas</span>
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-5 w-5" />
                  <span>Filtros</span>
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                  <div className="space-y-2">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="pending">Pendentes</option>
                      <option value="verified">Verificados</option>
                      <option value="resolved">Resolvidos</option>
                    </select>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="all">Todos os Tipos</option>
                      <option value="vehicle">Veículos</option>
                      <option value="person">Pessoas</option>
                    </select>
                    <select
                      value={filters.date}
                      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="all">Todas as Datas</option>
                      <option value="today">Hoje</option>
                      <option value="week">Última Semana</option>
                      <option value="month">Último Mês</option>
                    </select>
                  </div>
                </Menu.Items>
              </Menu>
            </div>

            {/* Cases Tab */}
            {activeTab === 'cases' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Caso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Denúncias
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cases.map((case_) => (
                      <tr key={case_.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {case_.type === 'vehicle' ? (
                              <Car className="h-5 w-5 text-gray-400 mr-2" />
                            ) : (
                              <Users className="h-5 w-5 text-gray-400 mr-2" />
                            )}
                            <div className="text-sm font-medium text-gray-900">
                              {case_.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            case_.status === 'verified' ? 'bg-green-100 text-green-800' :
                            case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            case_.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {case_.status === 'verified' && 'Verificado'}
                            {case_.status === 'pending' && 'Pendente'}
                            {case_.status === 'resolved' && 'Resolvido'}
                            {case_.status === 'false' && 'Falso'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(case_.createdAt, "d 'de' MMMM", { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {case_.reports}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Função
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Membro desde
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' && 'Administrador'}
                            {user.role === 'moderator' && 'Moderador'}
                            {user.role === 'user' && 'Usuário'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(user.joinedAt, "d 'de' MMMM", { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            {user.status === 'active' ? 'Suspender' : 'Reativar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Denúncias Recentes</h3>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                      42 pendentes
                    </span>
                  </div>
                  <div className="space-y-4">
                    {/* Example Report */}
                    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Conteúdo Impróprio</span>
                        <span className="text-sm text-gray-500">Há 2 horas</span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        "Este comentário contém informações falsas sobre o caso..."
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Flag className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-yellow-600">3 denúncias</span>
                        </div>
                        <div className="space-x-2">
                          <button className="text-green-600 hover:text-green-800">
                            Aprovar
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Total de Casos</h3>
                      <AlertTriangle className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalCases}</p>
                    <p className="text-sm text-gray-500">
                      {stats.resolvedCases} resolvidos
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Tempo Médio</h3>
                      <Clock className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.averageResolutionTime}
                    </p>
                    <p className="text-sm text-gray-500">
                      para resolução
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Usuários Ativos</h3>
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                    <p className="text-sm text-gray-500">
                      na plataforma
                    </p>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-4">Estatísticas Detalhadas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Casos Verificados</span>
                      <span className="font-medium">{stats.verifiedCases}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Conteúdo Reportado</span>
                      <span className="font-medium">{stats.reportedContent}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Taxa de Resolução</span>
                      <span className="font-medium">
                        {((stats.resolvedCases / stats.totalCases) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;