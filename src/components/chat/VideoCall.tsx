
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoCallProps {
  contactId: string;
  contactName: string;
  onEndCall: () => void;
  isIncoming?: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  contactId, 
  contactName, 
  onEndCall, 
  isIncoming = false 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [floatingPosition, setFloatingPosition] = useState({ x: 0, y: 0 });

  // Create a floating animation effect for the connecting avatar
  useEffect(() => {
    if (callStatus === 'connecting') {
      const interval = setInterval(() => {
        setFloatingPosition({
          x: Math.sin(Date.now() / 1000) * 5,
          y: Math.cos(Date.now() / 1000) * 5
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [callStatus]);

  // Simulate connecting and then connected
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setCallStatus('connected');
      // Start the call timer
      startCallTimer();
      
      // For demo purposes, we'll simulate camera feeds
      if (localVideoRef.current) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            // In a real app, you would connect to the remote peer here
            // For demo purposes, we'll just show a static image in the remote video
          })
          .catch(err => {
            console.error("Error accessing media devices:", err);
            toast.error("Could not access camera or microphone");
          });
      }
    }, 2000);

    return () => {
      clearTimeout(connectTimeout);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      // Clean up media streams
      if (localVideoRef.current?.srcObject) {
        const streams = localVideoRef.current.srcObject as MediaStream;
        streams.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCallTimer = () => {
    timerRef.current = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real application, you would mute the actual audio track here
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    // In a real application, you would disable the camera here
    
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isCameraOff;
      }
    }
    
    toast.info(isCameraOff ? "Camera turned on" : "Camera turned off");
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    
    // Clean up video streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    toast.info(`Call ended - Duration: ${formatDuration(callDuration)}`);
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in">
      {/* Remote video (full screen) */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        {callStatus === 'connecting' ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-center text-white transform-gpu"
              style={{ 
                transform: `translate(${floatingPosition.x}px, ${floatingPosition.y}px)`,
                transition: 'transform 0.1s linear'
              }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 animate-float-rotate">
                <span className="text-3xl">{contactName[0]}</span>
              </div>
              <h3 className="text-xl font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                {isIncoming ? "Incoming call from" : "Calling"} {contactName}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* This would be the remote video in a real implementation */}
            <video 
              ref={remoteVideoRef}
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            {isCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white animate-float-rotate">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                    <span className="text-3xl">{contactName[0]}</span>
                  </div>
                  <p className="text-lg font-light bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                    Camera is turned off
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Call duration */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 glass-panel px-4 py-2 rounded-full text-white text-sm backdrop-blur-lg">
          {callStatus === 'connected' ? formatDuration(callDuration) : 'Connecting...'}
        </div>
        
        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-6 right-6 w-32 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl shadow-black/30 backdrop-blur-sm">
          <video 
            ref={localVideoRef}
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
          {isCameraOff && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-white text-sm">Camera Off</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Call controls */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 flex items-center justify-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className={`rounded-full h-12 w-12 backdrop-blur-md ${isMuted ? 'bg-red-500/80 text-white hover:bg-red-600/80' : 'bg-white/5 text-white hover:bg-white/10 border-white/10'}`}
          onClick={toggleMute}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`rounded-full h-12 w-12 backdrop-blur-md ${isCameraOff ? 'bg-red-500/80 text-white hover:bg-red-600/80' : 'bg-white/5 text-white hover:bg-white/10 border-white/10'}`}
          onClick={toggleCamera}
        >
          {isCameraOff ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23"></line>
              <path d="M15 7v.01"></path>
              <path d="M19.121 4.879L15 9.009V15l-6 6H7c-1.1 0-2-.9-2-2v-2l6-6v-2l1.3-1.3"></path>
              <path d="M7 9h.01"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 8v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1z"></path>
              <path d="M15 7l6-3v12l-6-3"></path>
            </svg>
          )}
        </Button>
        
        <Button 
          variant="destructive" 
          size="icon" 
          className="rounded-full h-14 w-14 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/20"
          onClick={handleEndCall}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.59 13.41A7 7 0 0 1 18 6h2a9 9 0 0 0-9.42 9.41"></path>
            <path d="M13.41 10.59A7 7 0 0 1 6 18v-2a9 9 0 0 0 9.41-9.42"></path>
            <line x1="5" y1="5" x2="19" y2="19"></line>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
