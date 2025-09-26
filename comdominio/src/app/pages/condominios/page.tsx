'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import AddCondominiumModal from '../../../components/AddCondominiumModal';
import { generateIdempotencyKeySync } from '../../../utils/idempotency';

interface Condominium {
    id: number;
    name: string;
    address: string;
    cnpj: string;
    phone?: string;
    units: number;
    pendingMaintenanceAmount: number;
    overdueMaintenanceAmount: number;
}

export default function ComdominiumsPage() {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const [condominiums, setCondominiums] = React.useState<Condominium[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isLoadingData, setIsLoadingData] = React.useState(true);
    const [deletingCondominiumId, setDeletingCondominiumId] = React.useState<number | null>(null);

    const handleCondominiumClick = (condominiumId: number) => {
        if (condominiumId && condominiumId !== undefined) {
            router.push(`/pages/condominios/${condominiumId}/manutencoes`);
        } else {
            console.error('Invalid condominium ID:', condominiumId);
            alert('Erro: ID do condomínio não encontrado');
        }
    };

    const handleAddCondominium = async (formData: {name: string, cnpj: string, address: string, units: number, phone?: string}) => {
        // Verificar se já existe um condomínio com o mesmo nome
        const existingCondominium = condominiums.find(
            condominium => condominium.name.toLowerCase() === formData.name.toLowerCase()
        );
        
        if (existingCondominium) {
            alert('Já existe um condomínio com este nome. Por favor, escolha um nome diferente.');
            return;
        }

        setLoading(true);
        
        const workspaceId = localStorage.getItem('workspaceId');
        const token = localStorage.getItem('token');

        const requestBody = {
            name: formData.name,
            cnpj: formData.cnpj,
            address: formData.address,
            units: formData.units,
            phone: formData.phone,
            workspaceId: parseInt(workspaceId || '0')
        };

        try {
            const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/condominiums`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Idempotency-Key': generateIdempotencyKeySync(formData.name, formData.cnpj)
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const updatedResponse = await fetch(`${baseUrl}/workspaces/${workspaceId}/condominiums`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (updatedResponse.ok) {
                    const updatedData = await updatedResponse.json();
                    // Garantir que updatedData é um array
                    setCondominiums(Array.isArray(updatedData) ? updatedData : []);
                } else {
                    console.error('Erro ao buscar condomínios atualizados:', updatedResponse.statusText);
                    // Manter o estado atual se falhar ao buscar
                }
                
                setIsModalOpen(false);
                alert('Condomínio adicionado com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro ao adicionar condomínio: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar condomínio:', error);
            alert('Erro ao adicionar condomínio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCondominium = async (condominiumId: number, event: React.MouseEvent) => {
        // Prevent navigation when clicking delete button
        event.stopPropagation();
        
        if (!confirm('Tem certeza que deseja deletar este condomínio? Esta ação não pode ser desfeita.')) {
            return;
        }

        setDeletingCondominiumId(condominiumId);
        
        const workspaceId = localStorage.getItem('workspaceId');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(
                `${baseUrl}/workspaces/${workspaceId}/condominiums/${condominiumId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                // Remove from local state
                setCondominiums(prevCondominiums => 
                    prevCondominiums.filter(c => c.id !== condominiumId)
                );
                alert('Condomínio removido com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro ao remover condomínio: ${errorData.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao remover condomínio:', error);
            alert('Erro ao remover condomínio. Tente novamente.');
        } finally {
            setDeletingCondominiumId(null);
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingData(true);
                const workspaceId = localStorage.getItem('workspaceId');
                const token = localStorage.getItem('token');

                const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/condominiums`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // Garantir que data é um array
                    setCondominiums(Array.isArray(data) ? data : []);
                } else {
                    console.error('Erro ao buscar condomínios:', response.statusText);
                    setCondominiums([]);
                }
            } catch (error) {
                console.error('Erro ao buscar condomínios:', error);
                setCondominiums([]);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [baseUrl]);

    return (
        <div style={{ padding: 24, background: "#f9f9f9", minHeight: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 16 }}>
                    Condomínios
                </h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: "12px 24px",
                        background: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(33, 150, 243, 0.3)",
                    }}
                >
                    + Adicionar Condomínio
                </button>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-around" }}>
                {Array.isArray(condominiums) && condominiums.length > 0 ? (
                    condominiums.map((condo, index) => (
                    <div
                        key={condo.id || `condo-${index}`}
                        onClick={() => handleCondominiumClick(condo.id)}
                        style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 8,
                        width: 320,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        background: "#fff",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                    }}
                >
                    <div style={{ position: "relative", padding: 16 }}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteCondominium(condo.id, e);
                            }}
                            disabled={deletingCondominiumId === condo.id}
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                backgroundColor: "#ff4444",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: 28,
                                height: 28,
                                cursor: deletingCondominiumId === condo.id ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                fontWeight: "bold",
                                opacity: deletingCondominiumId === condo.id ? 0.5 : 1,
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                if (deletingCondominiumId !== condo.id) {
                                    e.currentTarget.style.backgroundColor = "#dd3333";
                                    e.currentTarget.style.transform = "scale(1.1)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (deletingCondominiumId !== condo.id) {
                                    e.currentTarget.style.backgroundColor = "#ff4444";
                                    e.currentTarget.style.transform = "scale(1)";
                                }
                            }}
                            title={deletingCondominiumId === condo.id ? "Removendo..." : "Remover condomínio"}
                        >
                            {deletingCondominiumId === condo.id ? "..." : "×"}
                        </button>
                        <h2 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: "bold", color: "#000" }}>
                            {condo.name}
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                <strong>Endereço:</strong> {condo.address}
                            </p>
                            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                <strong>CNPJ:</strong> {condo.cnpj}
                            </p>
                            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                <strong>Unidades:</strong> {condo.units}
                            </p>
                            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                                <strong>Telefone:</strong> {condo.phone || '-'}
                            </p>
                            <p style={{ 
                                margin: 0,
                                padding: "4px 8px", 
                                fontSize: 14,
                                color: "#fff",
                                borderRadius: 8,
                                backgroundColor: condo.overdueMaintenanceAmount > 0 ? "#f32121ff" : (condo.pendingMaintenanceAmount > 0 ? "#ffd900ff" : "#1a9641"),
                                fontWeight: "bold"
                            }}>
                                <strong>Manutenções pendentes:</strong> {condo.pendingMaintenanceAmount}<br/>
                                <strong>Manutenções atrasadas:</strong> {condo.overdueMaintenanceAmount}
                            </p>
                        </div>
                    </div>
                </div>
            ))
                ) : (
                    <div style={{ 
                        width: '100%', 
                        textAlign: 'center', 
                        padding: '40px 0',
                        color: '#666'
                    }}>
                        {isLoadingData ? 'Carregando condomínios...' : 'Nenhum condomínio encontrado.'}
                    </div>
                )}
            </div>

            <AddCondominiumModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddCondominium}
                loading={loading}
                existingCondominiums={condominiums}
            />
        </div>
    );
}