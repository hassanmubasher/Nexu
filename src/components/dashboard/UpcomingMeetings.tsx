import React from 'react';
import { useMeetingStore } from '../../store/useMeetingStore';
import { Calendar, Clock, Video, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export const UpcomingMeetings: React.FC = () => {
  const { events, acceptRequest, declineRequest } = useMeetingStore();

  const sortedEvents = events
    .filter(evt => evt.type !== 'availability')
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const upcomingConfirmations = sortedEvents.filter(e => e.status === 'confirmed');
  const pendingRequests = sortedEvents.filter(e => e.status === 'pending');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Calendar className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h2>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Requests</h3>
            {pendingRequests.map(meeting => (
              <div key={meeting.id} className="p-4 rounded-lg bg-warning-50 border border-warning-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-warning-900">{meeting.title}</h4>
                    <p className="text-sm text-warning-700 mt-1">{meeting.withWho}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-warning-700 gap-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(meeting.start), 'MMM d, h:mm a')}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => acceptRequest(meeting.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white text-success-700 hover:bg-success-50 rounded-md border border-success-200 transition-colors text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button 
                    onClick={() => declineRequest(meeting.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white text-error-700 hover:bg-error-50 rounded-md border border-error-200 transition-colors text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmed Meetings */}
        {upcomingConfirmations.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed</h3>
            {upcomingConfirmations.map(meeting => (
              <div key={meeting.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex gap-4 transition-colors hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center min-w-[3rem] bg-white rounded-lg shadow-sm border border-gray-100 py-2 px-3">
                  <span className="text-xs font-semibold text-primary-600 uppercase">
                    {format(new Date(meeting.start), 'MMM')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 leading-tight">
                    {format(new Date(meeting.start), 'd')}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{meeting.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{meeting.withWho}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{format(new Date(meeting.start), 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-gray-400" />
                      <span className="text-primary-600 hover:underline cursor-pointer">Join Link</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No confirmed meetings upcoming.</p>
          </div>
        )}
      </div>
    </div>
  );
};
