'use client';

import React from 'react';

interface CondominiumFormData {
    name: string;
    cnpj: string;
    address: string;
    units: number;
}

interface AddCondominiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CondominiumFormData) => Promise<void>;
    loading?: boolean;
}

export default function AddCondominiumModal({ isOpen, onClose, onSubmit, loading = false }: AddCondominiumModalProps) {
    const [formData, setFormData] = React.useState<CondominiumFormData>({
        name: '',
        cnpj: '',
        address: '',
        units: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'units' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        // Reset form after successful submission
        setFormData({
            name: '',
            cnpj: '',
            address: '',
            units: 0
        });
    };

    const handleClose = () => {
        setFormData({
            name: '',
            cnpj: '',
            address: '',
            units: 0
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 24,
                width: '100%',
                maxWidth: 500,
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#333',
                    }}>
                        Adicionar Condomínio
                    </h2>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 24,
                            cursor: 'pointer',
                            color: '#666',
                            padding: 0,
                            width: 30,
                            height: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 4,
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            Nome do Condomínio *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 12,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                fontSize: 14,
                                boxSizing: 'border-box',
                                color: '#333',
                            }}
                            placeholder="Digite o nome do condomínio"
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 4,
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            CNPJ *
                        </label>
                        <input
                            type="text"
                            name="cnpj"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 12,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                fontSize: 14,
                                boxSizing: 'border-box',
                                color: '#333',
                            }}
                            placeholder="00.000.000/0000-00"
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 4,
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            Endereço *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 12,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                fontSize: 14,
                                boxSizing: 'border-box',
                                color: '#333',
                            }}
                            placeholder="Digite o endereço completo"
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 4,
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#333',
                        }}>
                            Número de Unidades *
                        </label>
                        <input
                            type="number"
                            name="units"
                            value={formData.units || ''}
                            onChange={handleInputChange}
                            required
                            min="1"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: 12,
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                fontSize: 14,
                                boxSizing: 'border-box',
                                color: '#333',
                            }}
                            placeholder="Número de unidades"
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: 12,
                        justifyContent: 'flex-end',
                    }}>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                border: '1px solid #ddd',
                                borderRadius: 4,
                                background: 'white',
                                color: '#666',
                                cursor: 'pointer',
                                fontSize: 14,
                                fontWeight: 'bold',
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: 4,
                                background: loading ? '#ccc' : '#2196f3',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}