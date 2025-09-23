interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  bgColor = 'bg-blue-100', 
  textColor = 'text-blue-600',
  className = ''
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 ${bgColor} rounded-lg`}>
            <div className={`w-6 h-6 ${textColor}`}>
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
}