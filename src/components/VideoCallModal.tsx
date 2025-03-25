
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Phone, Video, VideoOff, User, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const [callId, setCallId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  
  // Get local video stream
  useEffect(() => {
    if (isOpen && isVideoEnabled) {
      const getUserMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: isAudioEnabled 
          });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing media devices:", error);
          setIsVideoEnabled(false);
        }
      };
      
      getUserMedia();
      
      // Clean up on unmount
      return () => {
        const stream = localVideoRef.current?.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isOpen, isVideoEnabled, isAudioEnabled]);
  
  // Handle starting a call
  const handleStartCall = () => {
    // In a real implementation, this would create a call and get a call ID
    const generatedCallId = Math.random().toString(36).substring(2, 10);
    setCallId(generatedCallId);
    setIsCallActive(true);
    
    // Simulated call behavior
    setTimeout(() => {
      alert(`Your call ID is: ${generatedCallId}\nShare this ID with others to join your call.`);
    }, 500);
  };
  
  // Handle joining a call
  const handleJoinCall = () => {
    if (!callId) return;
    
    setIsJoining(true);
    
    // Simulate API call to join existing call
    setTimeout(() => {
      setIsCallActive(true);
      setIsJoining(false);
    }, 1500);
  };
  
  // Handle ending the call
  const handleEndCall = () => {
    setIsCallActive(false);
    setCallId('');
    onClose();
  };
  
  // Toggle video
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
    }
  };
  
  // Toggle audio
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isCallActive ? 'Video Call' : 'Start or Join Call'}</DialogTitle>
        </DialogHeader>
        
        {isCallActive ? (
          <div className="space-y-4">
            <div className="bg-black rounded-lg aspect-video relative overflow-hidden">
              {isVideoEnabled ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                    <AvatarFallback className="text-xl">
                      {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 text-white rounded text-xs">
                You ({profile?.username})
              </div>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={!isAudioEnabled ? "bg-red-100" : ""}
                onClick={toggleAudio}
              >
                {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
              </Button>
              
              <Button
                variant="destructive"
                size="icon"
                onClick={handleEndCall}
              >
                <Phone className="h-4 w-4 rotate-135" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={!isVideoEnabled ? "bg-red-100" : ""}
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-500" />}
              </Button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Call ID: {callId}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleStartCall}
                >
                  <User className="mr-2 h-4 w-4" />
                  Start New Call
                </Button>
                
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter Call ID"
                    className="pl-10"
                    value={callId}
                    onChange={(e) => setCallId(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleJoinCall} 
                disabled={!callId || isJoining}
                className="w-full"
              >
                {isJoining ? 'Joining...' : 'Join Call'}
              </Button>
            </div>
            
            <div className="mt-4">
              <div className="bg-slate-100 rounded-lg aspect-video relative overflow-hidden">
                {isVideoEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                      <AvatarFallback className="text-xl">
                        {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={!isAudioEnabled ? "bg-red-100" : ""}
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className={!isVideoEnabled ? "bg-red-100" : ""}
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-500" />}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-muted-foreground">
            {isCallActive ? 'To invite others, share the Call ID' : 'Start a new call or join with a Call ID'}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
