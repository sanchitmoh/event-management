import React from 'react';
import { Calendar, Users, Settings, PieChart } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-8">
        <Calendar className="text-blue-600" size={24} />
        <span className="text-xl font-bold text-gray-900">EventMaster</span>
      </div>
      <nav>
        <ul className="space-y-2">
          {[
            { icon: Calendar, label: 'Events', active: true },
            { icon: Users, label: 'Attendees' },
            { icon: PieChart, label: 'Analytics' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;