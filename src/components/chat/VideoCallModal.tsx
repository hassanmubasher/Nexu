import React, { useState, useEffect } from 'react';
import { Camera, CameraOff, Mic, MicOff, MonitorUp, PhoneOff, X, Maximize2, Minimize2 } from 'lucide-react';
import { User } from '../../types';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: User | null;
  currentUser: User | null;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, partner, currentUser }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isOpen) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOff(false);
      setIsScreenSharing(false);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !partner) return null;

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-all ${isMaximized ? 'p-0' : 'p-4 sm:p-6'}`}>
      <div className={`bg-gray-900 rounded-2xl overflow-hidden relative flex flex-col w-full transition-all ${isMaximized ? 'h-full rounded-none' : 'max-w-5xl h-[80vh]'}`}>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white font-medium">{formatDuration(callDuration)}</span>
            <span className="text-gray-300 text-sm hidden sm:inline">|</span>
            <span className="text-gray-300 text-sm hidden sm:inline px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-sm border border-white/10">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
            >
              {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            {/* We allow closing via End call button primarily, but keep a subtle X for emergencies */}
            <button onClick={handleEndCall} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-2 sm:p-4 pt-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          
          {/* Main/Partner feed */}
          <div className={`relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center ${isScreenSharing ? 'col-span-1 md:col-span-2' : ''}`}>
            {isScreenSharing ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-white">
                <MonitorUp size={64} className="mb-4 text-primary-400 opacity-80" />
                <h3 className="text-xl font-medium">You are sharing your screen</h3>
                <p className="text-gray-400 mt-2">The other participant is currently viewing your screen.</p>
              </div>
            ) : (
              // Partner Feed (Mocked with random grad or their avatar if video "off/on" was implemented both ways)
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="flex flex-col items-center">
                  <img src={partner.avatarUrl} alt={partner.name} className="w-24 h-24 rounded-full border-4 border-gray-700 mb-4 object-cover" />
                  <p className="text-white text-lg font-medium">{partner.name}</p>
                </div>
              </div>
            )}
            
            {/* Label */}
            {!isScreenSharing && <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-white text-sm font-medium">{partner.name}</span>
            </div>}
          </div>

          {/* Local feed */}
          {!isScreenSharing && <div className="relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center">
            {isVideoOff ? (
               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                 <div className="flex flex-col items-center">
                    {currentUser?.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="You" className="w-20 h-20 rounded-full border-4 border-gray-700 mb-3 object-cover opacity-50" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                        <CameraOff className="text-gray-500" size={32} />
                      </div>
                    )}
                   <p className="text-gray-400">Camera is off</p>
                 </div>
               </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* Mocking a live camera by showing user avatar large and slightly blurred, or just a clear avatar */}
                 <img src={currentUser?.avatarUrl || ''} alt="You (mock video)" className="w-full h-full object-cover blur-sm opacity-60" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <p className="text-white bg-black/30 px-4 py-2 rounded-full font-medium tracking-wide">Live Video Mock</p>
                 </div>
              </div>
            )}

            {/* Label */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <span className="text-white text-sm font-medium">You</span>
              {isMuted && <MicOff size={14} className="text-red-400" />}
            </div>
          </div>}

        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent flex items-center justify-center pb-4 px-4">
          <div className="flex items-center gap-3 sm:gap-4 bg-gray-800/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-700 shadow-2xl">
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? <CameraOff size={20} /> : <Camera size={20} />}
            </button>
            
            <button 
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              title={isScreenSharing ? "Stop sharing" : "Share screen"}
            >
              <MonitorUp size={20} />
            </button>

            <div className="w-px h-8 bg-gray-700 mx-2 hidden sm:block" />
            
            <button 
              onClick={handleEndCall}
              className="px-6 py-3 rounded-full flex items-center justify-center transition-all bg-red-600 text-white hover:bg-red-700 font-medium shadow-lg shadow-red-600/20"
            >
              <PhoneOff size={20} className="mr-2" />
              <span className="hidden sm:inline">End Call</span>
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
};
