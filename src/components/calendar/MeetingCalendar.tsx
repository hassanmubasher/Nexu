import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useMeetingStore } from '../../store/useMeetingStore';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { MeetingRequestModal } from './MeetingRequestModal';

export const MeetingCalendar: React.FC = () => {
  const { events, addEvent, deleteEvent } = useMeetingStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedSlot({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsModalOpen(true);
    // selectInfo.view.calendar.unselect(); // clear date selection
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Mocking an interaction for existing events
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      deleteEvent(clickInfo.event.id);
    }
  };

  const formattedEvents = events.map(evt => ({
    id: evt.id,
    title: evt.title || (evt.type === 'availability' ? 'Available' : 'Meeting'),
    start: evt.start,
    end: evt.end,
    backgroundColor: evt.type === 'availability' ? '#10B981' : (evt.status === 'pending' ? '#F59E0B' : '#3B82F6'),
    borderColor: 'transparent',
    extendedProps: { ...evt },
  }));

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleSaveSlot = (title: string, type: 'availability' | 'request') => {
    if (selectedSlot) {
      addEvent({
        title,
        start: selectedSlot.start,
        end: selectedSlot.end,
        type,
        status: type === 'request' ? 'pending' : undefined,
      });
    }
    handleModalClose();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex-1 w-full min-h-[600px]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={formattedEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="100%"
          contentHeight="auto"
        />
      </div>

      <MeetingRequestModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveSlot}
        start={selectedSlot?.start}
        end={selectedSlot?.end}
      />
    </div>
  );
};
