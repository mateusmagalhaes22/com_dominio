'use client';

import React from "react";
import { useRouter, useParams } from 'next/navigation';
import AddMaintenanceModal from '../../../../../components/AddMaintenanceModal';
import { generateIdempotencyKeySync } from '../../../../../utils/idempotency';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Maintenance {
    name: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    description: string;
    status: string;
    endDate: string;
}

interface Condominium {
    id: number;
    name: string;
    address: string;
}

export default function MaintenancesPage() {
    const router = useRouter();
    const params = useParams();
    const condominiumId = params.id;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    const [maintenances, setMaintenances] = React.useState<Maintenance[]>([]);
    const [condominium, setCondominium] = React.useState<Condominium | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isAddingMaintenance, setIsAddingMaintenance] = React.useState(false);
    const [deletingMaintenanceId, setDeletingMaintenanceId] = React.useState<number | null>(null);
    const [completingMaintenanceId, setCompletingMaintenanceId] = React.useState<number | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            const workspaceId = localStorage.getItem('workspaceId');
            const token = localStorage.getItem('token');

            try {
                const condoResponse = await fetch(
                    `${baseUrl}/workspaces/${workspaceId}/condominiums/${condominiumId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (condoResponse.ok) {
                    const condoData = await condoResponse.json();
                    setCondominium(condoData);
                }

                const maintenanceResponse = await fetch(
                    `${baseUrl}/workspaces/${workspaceId}/condominiums/${condominiumId}/maintenances`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (maintenanceResponse.ok) {
                    const maintenanceData = await maintenanceResponse.json();
                    setMaintenances(maintenanceData);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        if (condominiumId) {
            fetchData();
        }
    }, [condominiumId, baseUrl]);

    const handleAddMaintenance = async (formData: {
        name: string;
        description: string;
        status: string;
        endDate: string;
    }) => {
        // Verificar se já existe uma manutenção com o mesmo nome
        const existingMaintenance = maintenances.find(
            maintenance => maintenance.name.toLowerCase() === formData.name.toLowerCase()
        );
        
        if (existingMaintenance) {
            alert('Já existe uma manutenção com este nome. Por favor, escolha um nome diferente.');
            return;
        }

        setIsAddingMaintenance(true);
        
        const workspaceId = localStorage.getItem('workspaceId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/condominiums/${condominiumId}/maintenances`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Idempotency-Key': generateIdempotencyKeySync(formData.name, formData.endDate)
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                
                const maintenanceResponse = await fetch(
                    `${baseUrl}/workspaces/${workspaceId}/condominiums/${condominiumId}/maintenances`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (maintenanceResponse.ok) {
                    const maintenanceData = await maintenanceResponse.json();
                    setMaintenances(maintenanceData);
                    
                    // Fechar o modal após sucesso
                    setIsModalOpen(false);
                } else {
                    console.error('Erro ao buscar manutenções atualizadas:', maintenanceResponse.statusText);
                    alert('Manutenção criada, mas erro ao atualizar lista');
                }
            } else {
                const errorText = await response.text();
                console.error('Erro ao criar manutenção:', response.status, response.statusText, errorText);
                alert(`Erro ao criar manutenção: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao criar manutenção:', error);
            alert('Erro ao criar manutenção');
        } finally {
            setIsAddingMaintenance(false);
        }
    };

    const handleDeleteMaintenance = async (maintenanceId: number) => {
        if (!confirm('Tem certeza que deseja deletar esta manutenção?')) {
            return;
        }

        setDeletingMaintenanceId(maintenanceId);
        
        const workspaceId = localStorage.getItem('workspaceId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `${baseUrl}/workspaces/${workspaceId}/condominiums/${condominiumId}/maintenances/${maintenanceId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                // Remove from local state
                setMaintenances(prevMaintenances => 
                    prevMaintenances.filter(m => m.id !== maintenanceId)
                );
            } else {
                console.error('Erro ao deletar manutenção:', response.statusText);
                alert('Erro ao deletar manutenção');
            }
        } catch (error) {
            console.error('Erro ao deletar manutenção:', error);
            alert('Erro ao deletar manutenção');
        } finally {
            setDeletingMaintenanceId(null);
        }
    };

    const handleCompleteMaintenance = async (maintenanceId: number) => {
        setCompletingMaintenanceId(maintenanceId);
        
        const workspaceId = localStorage.getItem('workspaceId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `${baseUrl}/workspaces/${workspaceId}/condominiums/${condominiumId}/maintenances/${maintenanceId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'feito' })
                }
            );

            if (response.ok) {
                setMaintenances(prevMaintenances => 
                    prevMaintenances.map(m => 
                        m.id === maintenanceId 
                            ? { ...m, status: 'feito' }
                            : m
                    )
                );
            } else {
                console.error('Erro ao concluir manutenção:', response.statusText);
                alert('Erro ao concluir manutenção');
            }
        } catch (error) {
            console.error('Erro ao concluir manutenção:', error);
            alert('Erro ao concluir manutenção');
        } finally {
            setCompletingMaintenanceId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pendente':
                return '#ffd900ff';
            case 'feito':
                return '#1a9641';
            case 'atrasado':
                return '#f32121ff';
            default:
                return '#ffd900ff';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    if (loading) {
        return (
            <div style={{ 
                padding: 24, 
                background: "#f9f9f9", 
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 24, background: "#f9f9f9", minHeight: "100vh" }}>
            <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            padding: "8px 16px",
                            background: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}
                    >
                        <ArrowBackIcon style={{ fontSize: 18 }} />
                        Voltar
                    </button>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#333", margin: 0 }}>
                            Manutenções
                        </h1>
                        {condominium && (
                            <p style={{ fontSize: 16, color: "#666", margin: "4px 0 0 0" }}>
                                {condominium.name}
                            </p>
                        )}
                    </div>
                </div>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: "10px 20px",
                        background: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}
                >
                    <AddIcon style={{ fontSize: 18 }} />
                    Adicionar Manutenção
                </button>
            </div>

            {/* Lista de manutenções */}
            {maintenances.length === 0 ? (
                <div style={{
                    background: "#fff",
                    padding: 32,
                    borderRadius: 8,
                    textAlign: "center",
                    border: "1px solid #e0e0e0"
                }}>
                    <p style={{ color: "#666", fontSize: 16 }}>
                        Nenhuma manutenção encontrada para este condomínio.
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {maintenances.map((maintenance) => (
                        <div
                            key={maintenance.id}
                            style={{
                                background: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: 8,
                                padding: 20,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: "bold", color: "#333" }}>
                                    {maintenance.name}
                                </h3>
                                <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                    <strong>Prazo:</strong> {maintenance.endDate? formatDate(maintenance.endDate) : 'Não definido'}
                                </p>
                                <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                    <strong>Criado em:</strong> {maintenance.createdAt? formatDate(maintenance.createdAt) : 'Não definido'}
                                </p>
                                <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                    <strong>Ultima atualização:</strong> {maintenance.updatedAt? formatDate(maintenance.updatedAt) : 'Não definido'}
                                </p>
                                
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "space-between",
                                    marginTop: 8
                                }}>
                                    
                                    <div style={{ display: "flex", gap: 8, marginRight: 16}}>
                                        {maintenance.status !== 'feito' && (
                                            <button
                                                onClick={() => handleCompleteMaintenance(maintenance.id)}
                                                disabled={completingMaintenanceId === maintenance.id}
                                                style={{
                                                    padding: "6px 12px",
                                                    background: completingMaintenanceId === maintenance.id ? "#ccc" : "#4caf50",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: 4,
                                                    cursor: completingMaintenanceId === maintenance.id ? "not-allowed" : "pointer",
                                                    fontSize: 12,
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {completingMaintenanceId === maintenance.id ? (
                                                    "Concluindo..."
                                                ) : (
                                                    <>
                                                        <CheckIcon style={{ fontSize: 16, marginRight: 4 }} />
                                                        Concluir
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDeleteMaintenance(maintenance.id)}
                                            disabled={deletingMaintenanceId === maintenance.id}
                                            style={{
                                                padding: "6px 12px",
                                                background: deletingMaintenanceId === maintenance.id ? "#ccc" : "#f44336",
                                                color: "white",
                                                border: "none",
                                                borderRadius: 4,
                                                cursor: deletingMaintenanceId === maintenance.id ? "not-allowed" : "pointer",
                                                fontSize: 12,
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {deletingMaintenanceId === maintenance.id ? (
                                                "Deletando..."
                                            ) : (
                                                <>
                                                    <DeleteIcon style={{ fontSize: 16, marginRight: 4 }} />
                                                    Deletar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    
                                    <span
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: 20,
                                            fontSize: 12,
                                            fontWeight: "bold",
                                            color: "white",
                                            background: getStatusColor(maintenance.status)
                                        }}
                                    >
                                        {maintenance.status}
                                    </span>
                                </div>
                            </div>

                            <p style={{ margin: "0 0 12px 0", color: "#666", lineHeight: 1.5, wordBreak: "break-all" }}>
                                {maintenance.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            
            <AddMaintenanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddMaintenance}
                isLoading={isAddingMaintenance}
                existingMaintenances={maintenances}
            />
        </div>
    );
}