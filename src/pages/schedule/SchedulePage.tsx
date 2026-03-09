import React from 'react';
import { MeetingCalendar } from '../../components/calendar/MeetingCalendar';

export const SchedulePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Schedule</h1>
          <p className="text-gray-500 mt-1">Manage your availability and upcoming meetings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar Space */}
        <div className="lg:col-span-3">
          <MeetingCalendar />
        </div>
        
        {/* Sidebar Info Space */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success-500"></span>
                <span className="text-gray-600">Availability Slot</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                <span className="text-gray-600">Confirmed Meeting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-warning-500"></span>
                <span className="text-gray-600">Pending Request</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
            <h3 className="font-semibold text-primary-900 mb-2">Tips</h3>
            <p className="text-sm text-primary-700 leading-relaxed">
              Click and drag on the calendar to propose new availability slots or request meetings. Click existing slots to delete them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
