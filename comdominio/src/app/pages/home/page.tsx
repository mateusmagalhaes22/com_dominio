'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '../../../components/StatCard';
import ReportModal from '../../../components/ReportModal';
import BusinessIcon from '@mui/icons-material/Business';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import DescriptionIcon from '@mui/icons-material/Description';
import './home.css';

export default function HomePage() {
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState({
    totalCondominios: 0,
    manutencoesPendentes: 0,
    manutencoesAtrasadas: 0
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleAddCondominiumClick = () => {
    router.push('/pages/condominios?openModal=true');
  };

  const handleGenerateReportClick = () => {
    setIsReportModalOpen(true);
  };

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
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Dashboard</h1>
      </div>

      {/* Cards de estatísticas */}
      <div className="home-stats-grid">
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
      <div className="home-actions-grid">
        <div className="home-card">
          <h3 className="home-card-title">Ações Rápidas</h3>
          <div className="home-actions-list">
            <button 
              className="home-action-button"
              onClick={handleAddCondominiumClick}
            >
              <div className="home-action-content">
                <BusinessIcon className="home-action-icon green" />
                <span className="home-action-text">Adicionar Novo Condomínio</span>
              </div>
            </button>
            <button 
              className="home-action-button"
              onClick={handleGenerateReportClick}
            >
              <div className="home-action-content">
                <DescriptionIcon className="home-action-icon purple" />
                <span className="home-action-text">Gerar Relatório Mensal</span>
              </div>
            </button>
          </div>
        </div>

        <div className="home-card">
          <h3 className="home-card-title">Atividades Recentes</h3>
          <div className="home-activities-list">
            <div className="home-activity-item">
              <div className="home-activity-dot blue"></div>
              <div className="home-activity-content">
                <p className="home-activity-text">
                  Nova manutenção criada para o <span className="home-activity-highlight">Edifício Solar</span>
                </p>
                <p className="home-activity-time">2 horas atrás</p>
              </div>
            </div>
            <div className="home-activity-item">
              <div className="home-activity-dot green"></div>
              <div className="home-activity-content">
                <p className="home-activity-text">
                  Morador aprovado para o <span className="home-activity-highlight">Apartamento 501</span>
                </p>
                <p className="home-activity-time">5 horas atrás</p>
              </div>
            </div>
            <div className="home-activity-item">
              <div className="home-activity-dot yellow"></div>
              <div className="home-activity-content">
                <p className="home-activity-text">
                  Relatório mensal gerado para <span className="home-activity-highlight">Janeiro 2025</span>
                </p>
                <p className="home-activity-time">1 dia atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}