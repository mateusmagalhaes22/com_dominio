'use client';

import { useState, useEffect } from 'react';
import StatCard from '../../../components/StatCard';
import BusinessIcon from '@mui/icons-material/Business';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';

export default function HomePage() {

  const [dashboardData, setDashboardData] = useState({
    totalCondominios: 0,
    manutencoesPendentes: 0,
    manutencoesAtrasadas: 0
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const workspaceId = localStorage.getItem('workspaceId');
        const token = localStorage.getItem('token');
        
        if (!workspaceId || !token) {
          console.error('WorkspaceId ou token não encontrados');
          return;
        }

        const qtdCondominios = await fetch(`${baseUrl}/workspaces/${workspaceId}/condominiums/count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        const qtdManutencoesPendentes = await fetch(`${baseUrl}/workspaces/${workspaceId}/maintenances/count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Status": "pendente"
          },
        });

        const qtdManutencoesAtrasadas = await fetch(`${baseUrl}/workspaces/${workspaceId}/maintenances/count`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Status": "atrasado"
          },
        });

        if (qtdCondominios.ok && qtdManutencoesPendentes.ok && qtdManutencoesAtrasadas.ok) {
          const condominiosData = await qtdCondominios.json();
          const manutencoesPendentesData = await qtdManutencoesPendentes.json();
          const manutencoesAtrasadasData = await qtdManutencoesAtrasadas.json();

          setDashboardData({
            totalCondominios: condominiosData || 0,
            manutencoesPendentes: manutencoesPendentesData || 0,
            manutencoesAtrasadas: manutencoesAtrasadasData || 0
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };

    loadDashboardData();
  }, [baseUrl]);

  const statsData = [
    {
      title: 'Condomínios Ativos',
      value: dashboardData.totalCondominios.toString(),
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      icon: <BusinessIcon />,
    },
    {
      title: 'Manutenções Pendentes',
      value: dashboardData.manutencoesPendentes.toString(),
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      icon: <WarningIcon />,
    },{
      title: 'Manutenções atrasadas',
      value: dashboardData.manutencoesAtrasadas.toString(),
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      icon: <ErrorIcon />,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            textColor={stat.textColor}
          />
        ))}
      </div>

      {/* Seção de ações rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <PersonAddIcon className="text-blue-600 mr-3" style={{ fontSize: 20 }} />
                <span className="font-medium">Adicionar Novo Morador</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <BuildIcon className="text-green-600 mr-3" style={{ fontSize: 20 }} />
                <span className="font-medium">Criar Nova Manutenção</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <DescriptionIcon className="text-purple-600 mr-3" style={{ fontSize: 20 }} />
                <span className="font-medium">Gerar Relatório Mensal</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  Nova manutenção criada para o <span className="font-medium">Edifício Solar</span>
                </p>
                <p className="text-xs text-gray-500">2 horas atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  Morador aprovado para o <span className="font-medium">Apartamento 501</span>
                </p>
                <p className="text-xs text-gray-500">5 horas atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  Relatório mensal gerado para <span className="font-medium">Janeiro 2025</span>
                </p>
                <p className="text-xs text-gray-500">1 dia atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}