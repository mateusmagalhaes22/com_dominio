'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const menuItems = [
  {
    name: 'Home',
    href: '/pages/home',
    icon: <HomeIcon />,
  },
  {
    name: 'Condomínios',
    href: '/pages/condominios',
    icon: <BusinessIcon />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || 'Usuário');
      } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
      }
    }
  }, []);

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold">Condomínio</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronLeftIcon 
              className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
              style={{ fontSize: 20 }}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="flex-shrink-0" style={{ fontSize: 20 }}>{item.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer/User */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <PersonIcon style={{ fontSize: 20 }} />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">{userName}</p>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('workspaceId');
                  localStorage.removeItem('user');
                  window.location.href = '/pages/login';
                }}
                className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}