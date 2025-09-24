'use client';

import React, { useState } from 'react';

interface AddMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        name: string;
        description: string;
        status: string;
        endDate: string;
    }) => Promise<void>;
    isLoading: boolean;
}

const AddMaintenanceModal: React.FC<AddMaintenanceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'pendente',
        endDate: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        endDate: ''
    });

    const validateForm = () => {
        const newErrors = {
            name: '',
            description: '',
            endDate: ''
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'Data de conclusão é obrigatória';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
            // Reset form after successful submission
            setFormData({
                name: '',
                description: '',
                status: 'PENDING',
                endDate: ''
            });
            setErrors({
                name: '',
                description: '',
                endDate: ''
            });
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar manutenção:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            status: 'PENDING',
            endDate: ''
        });
        setErrors({
            name: '',
            description: '',
            endDate: ''
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Adicionar Nova Manutenção
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome da Manutenção *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            style={{ color: '#333' }}
                            placeholder="Ex: Limpeza da piscina"
                            disabled={isLoading}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.description ? 'border-red-500' : 'border-gray-300'
                            }`}
                            style={{ color: '#333' }}
                            placeholder="Descreva os detalhes da manutenção..."
                            disabled={isLoading}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                            style={{ color: '#333' }}
                        >
                            <option value="pendente">Pendente</option>
                            <option value="atrasado">Atrasado</option>
                            <option value="feito">Concluído</option>
                        </select>
                    </div>

                    {/* Data de Conclusão */}
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Data de Conclusão *
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.endDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            style={{ color: '#333' }}
                            disabled={isLoading}
                        />
                        {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                    </div>

                    {/* Botões */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adicionando...' : 'Adicionar Manutenção'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaintenanceModal;