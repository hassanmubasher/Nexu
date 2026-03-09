import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MeetingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, type: 'availability' | 'request') => void;
  start?: Date;
  end?: Date;
}

export const MeetingRequestModal: React.FC<MeetingRequestModalProps> = ({ isOpen, onClose, onSave, start, end }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'availability' | 'request'>('availability');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title, type);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Slot</h2>
          <p className="text-sm text-gray-500 mt-1">
            {start?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {end?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            {' '} ({start?.toLocaleDateString()})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. My Open Hours or Meeting with John"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'availability' | 'request')}
              className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="availability">Set Availability Slot</option>
              <option value="request">Request Meeting</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
