'use client';

import React from "react";
import { useRouter } from 'next/navigation';

interface Condominium {
    id: number;
    name: string;
    address: string;
    cnpj: string;
    units: number;
    maintenanceAmount: number;
}

export default function ComdominiumsPage() {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const [condominiums, setCondominiums] = React.useState<Condominium[]>([]);

    const handleCondominiumClick = (condominiumId: number) => {
        console.log('Condominium ID clicked:', condominiumId);
        if (condominiumId && condominiumId !== undefined) {
            router.push(`/pages/condominios/${condominiumId}/manutencoes`);
        } else {
            console.error('Invalid condominium ID:', condominiumId);
            alert('Erro: ID do condomínio não encontrado');
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {

            const workspaceId = localStorage.getItem('workspaceId');
            const token = localStorage.getItem('token');

            const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/condominiums`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCondominiums(data);
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: 24, background: "#f9f9f9", minHeight: "100vh" }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 16 }}>
                Condomínios
            </h1>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-around" }}>
                {condominiums.map((condo, index) => (
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
                    <div style={{ padding: 16 }}>
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
                            <p style={{ 
                                margin: 0, 
                                fontSize: 14, 
                                color: condo.maintenanceAmount > 0 ? "#ffd900ff" : "#1a9641",
                                fontWeight: "bold"
                            }}>
                                <strong>Manutenções pendentes:</strong> {condo.maintenanceAmount}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}