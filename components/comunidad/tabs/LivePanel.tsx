"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Radio, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Tv, 
  Play, 
  Square, 
  Coffee, 
  MessageSquare, 
  Users, 
  Send, 
  Loader2, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Lock,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LiveKitRoom, 
  useTracks, 
  useRoomContext,
  useParticipants
} from "@livekit/components-react";
import { RoomEvent, Track, Room } from "livekit-client";

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  room_name: string;
  status: 'scheduled' | 'active' | 'completed';
  youtube_stream_key: string | null;
  youtube_video_id: string | null;
  livekit_egress_id: string | null;
  scheduled_at: string;
}

export default function LivePanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Form states for creating a class
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomName, setRoomName] = useState("");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchClassInfo = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }

      // Fetch active classes or the next scheduled one
      const { data: classes, error } = await supabase
        .from("live_classes")
        .select("*")
        .in("status", ["active", "scheduled"])
        .order("status", { ascending: false }) // 'active' first
        .order("scheduled_at", { ascending: true })
        .limit(1);

      if (error) throw error;
      setActiveClass(classes && classes.length > 0 ? classes[0] : null);
    } catch (err) {
      console.error("Error fetching live classes data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassInfo();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !roomName.trim() || !scheduledAt) return;
    setSubmitting(true);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data, error } = await supabase
        .from("live_classes")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          room_name: roomName.trim().replace(/\s+/g, "-").toLowerCase(),
          youtube_stream_key: youtubeKey.trim() || null,
          scheduled_at: new Date(scheduledAt).toISOString(),
          status: "scheduled"
        })
        .select()
        .single();

      if (error) throw error;

      setActiveClass(data);
      // Reset form
      setTitle("");
      setDescription("");
      setRoomName("");
      setYoutubeKey("");
      setScheduledAt("");
    } catch (err: any) {
      alert("Error al agendar clase: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartClass = async () => {
    if (!activeClass) return;
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error } = await supabase
        .from("live_classes")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", activeClass.id);

      if (error) throw error;
      await fetchClassInfo();
    } catch (err: any) {
      alert("Error al iniciar clase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!activeClass) return;
    setIsConnecting(true);
    try {
      const response = await fetch(`/api/live/token?roomName=${activeClass.room_name}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setToken(data.token);
    } catch (err: any) {
      alert("Error al conectar a la clase: " + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLeaveRoom = () => {
    setToken(null);
    fetchClassInfo();
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 font-medium">Cargando transmisión...</span>
      </div>
    );
  }

  // ─── CASE 1: ACTIVE ROOM (LiveKit Session) ───
  if (token && activeClass) {
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://programbi.livekit.cloud";

    return (
      <div className="w-full bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-2 sm:p-4 min-h-[500px]">
        <LiveKitRoom
          token={token}
          serverUrl={livekitUrl}
          connect={true}
          audio={true}
          video={false}
          onDisconnected={handleLeaveRoom}
          className="flex flex-col h-full gap-4"
        >
          <ClassroomView 
            isAdmin={isAdmin} 
            activeClass={activeClass} 
            onLeave={handleLeaveRoom}
          />
        </LiveKitRoom>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Active or Scheduled class banner */}
      {activeClass ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand-blue shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {activeClass.status === "active" ? (
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    En Vivo
                  </span>
                ) : (
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    Programado
                  </span>
                )}
                <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(activeClass.scheduled_at).toLocaleDateString("es-CL")}
                </span>
                <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(activeClass.scheduled_at).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">{activeClass.title}</h2>
              {activeClass.description && (
                <p className="text-sm text-gray-500 mt-1.5">{activeClass.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            {isAdmin && activeClass.status === "scheduled" && (
              <button 
                onClick={handleStartClass}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                <Play className="w-4 h-4" /> Iniciar Clase
              </button>
            )}
            {activeClass.status === "active" && (
              <button 
                onClick={handleJoinClass}
                disabled={isConnecting}
                className="w-full sm:w-auto px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tv className="w-4 h-4" />}
                {isConnecting ? "Conectando..." : "Unirse a la Clase"}
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-150 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Radio className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-xl text-gray-900 mb-1">No hay clases en vivo</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">Vuelve cuando esté programada una clase para unirte a la transmisión en directo.</p>
        </div>
      )}

      {/* Admin Panel to schedule live class */}
      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <h3 className="font-display font-black text-lg text-gray-900 mb-1">Agendar Nueva Masterclass</h3>
            <p className="text-sm text-gray-400">Programa una sesión en vivo para los alumnos.</p>
          </div>

          <form onSubmit={handleCreateClass} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Título de la Clase *</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Ej. Masterclass SQL Server Avanzado" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nombre de Sala de LiveKit (Única) *</label>
                <input 
                  type="text" 
                  required 
                  value={roomName} 
                  onChange={e => setRoomName(e.target.value)} 
                  placeholder="ej. masterclass-sql-01" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Indica de qué tratará la clase..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none min-h-[60px]" 
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Clave de Transmisión de YouTube Live (Opcional)</label>
                <input 
                  type="password" 
                  value={youtubeKey} 
                  onChange={e => setYoutubeKey(e.target.value)} 
                  placeholder="Clave de stream RTMP" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fecha y Hora Programada *</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={scheduledAt} 
                  onChange={e => setScheduledAt(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={submitting}
                className="px-6 py-3 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                {submitting ? "Agendando..." : "Agendar Masterclass"}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

// ─── CLASSROOM INTERNAL VIEW COMPONENT ───
interface ClassroomViewProps {
  isAdmin: boolean;
  activeClass: LiveClass;
  onLeave: () => void;
}

function ClassroomView({ isAdmin, activeClass, onLeave }: ClassroomViewProps) {
  const room = useRoomContext();
  const [streamActive, setStreamActive] = useState(!!activeClass.livekit_egress_id);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Break screen state
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimer, setBreakTimer] = useState(600);
  const breakIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Chat message list
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Custom Tracks rendering (Spotlight on host)
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false }
  ]);

  const participants = useParticipants();

  // Listen for data channel messages (e.g. break start/stop, chat messages)
  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array, participant: any) => {
      try {
        const text = new TextDecoder().decode(payload);
        const data = JSON.parse(text);

        if (data.type === "break_start") {
          setIsBreakActive(true);
          setBreakTimer(data.duration || 600);
        } else if (data.type === "break_stop") {
          setIsBreakActive(false);
        } else if (data.type === "chat_message") {
          setMessages(prev => [...prev, {
            id: Math.random().toString(),
            sender: participant?.name || "Estudiante",
            text: data.text,
            time: new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
            isAdmin: data.isAdmin
          }]);
        }
      } catch (err) {
        console.error("Error parsing data channel message:", err);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  // Handle local break timer decrement
  useEffect(() => {
    if (isBreakActive) {
      breakIntervalRef.current = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            clearInterval(breakIntervalRef.current!);
            setIsBreakActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (breakIntervalRef.current) clearInterval(breakIntervalRef.current);
    }

    return () => {
      if (breakIntervalRef.current) clearInterval(breakIntervalRef.current);
    };
  }, [isBreakActive]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Host Action: Start streaming room layout to YouTube Live
  const handleToggleStream = async () => {
    if (isStreaming) return;
    setIsStreaming(true);
    try {
      const endpoint = "/api/live/egress";
      const actionType = streamActive ? "stop" : "start";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: activeClass.room_name,
          action: actionType,
          classId: activeClass.id,
          streamKey: activeClass.youtube_stream_key
        })
      });

      const resData = await res.json();
      if (!res.ok || resData.error) {
        throw new Error(resData.error || "Error al configurar transmisión.");
      }

      setStreamActive(!streamActive);
    } catch (err: any) {
      alert("Error de transmisión: " + err.message);
    } finally {
      setIsStreaming(false);
    }
  };

  // Host Action: Toggle break screen
  const handleToggleBreak = () => {
    const nextState = !isBreakActive;
    setIsBreakActive(nextState);

    // Send payload over data channel to sync other attendees
    const encoder = new TextEncoder();
    const payload = encoder.encode(JSON.stringify({
      type: nextState ? "break_start" : "break_stop",
      duration: 600
    }));

    room.localParticipant.publishData(payload, { reliable: true });

    if (nextState) {
      setBreakTimer(600);
      // Mute local microphone/video automatically for host
      room.localParticipant.setMicrophoneEnabled(false);
      room.localParticipant.setCameraEnabled(false);
    } else {
      room.localParticipant.setMicrophoneEnabled(true);
      room.localParticipant.setCameraEnabled(true);
    }
  };

  // Chat message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const messagePayload = {
      type: "chat_message",
      text: inputMsg.trim(),
      isAdmin
    };

    const encoder = new TextEncoder();
    const payload = encoder.encode(JSON.stringify(messagePayload));
    
    // Broadcast message to all room participants
    room.localParticipant.publishData(payload, { reliable: true });

    // Insert locally
    setMessages(prev => [...prev, {
      id: Math.random().toString(),
      sender: "Tú",
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }),
      isAdmin
    }]);

    setInputMsg("");
  };

  // Host Action: Terminate entire class session
  const handleTerminateClass = async () => {
    if (!confirm("¿Estás seguro de terminar la clase para todos? Esto detendrá la grabación y cerrará la sala.")) return;
    
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      // Stop egress first if active
      if (streamActive) {
        await fetch("/api/live/egress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: activeClass.room_name,
            action: "stop",
            classId: activeClass.id
          })
        });
      }

      // Mark class completed
      await supabase
        .from("live_classes")
        .update({ status: "completed", ended_at: new Date().toISOString() })
        .eq("id", activeClass.id);

      onLeave();
    } catch (err: any) {
      console.error(err);
      onLeave();
    }
  };

  // Format break countdown: 600s -> "10:00"
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Identify Host/Teacher tracks
  const screenShareTrack = tracks.find(t => t.source === Track.Source.ScreenShare);
  const cameraTrack = tracks.find(t => t.source === Track.Source.Camera);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px] w-full relative">
      {/* ─── MAIN STAGE / VIDEO SCREEN (9/12 cols) ─── */}
      <div className="lg:col-span-9 bg-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between p-4 relative border border-slate-800">
        
        {/* Host Header bar with Status indicators */}
        <div className="flex justify-between items-center bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/50 absolute top-4 left-4 right-4 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h4 className="font-bold text-xs truncate max-w-[200px] sm:max-w-md">{activeClass.title}</h4>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Users className="w-3 h-3" />
              {participants.length}
            </span>
            {streamActive && (
              <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2.5 py-0.5 rounded-md border border-red-500/30 uppercase tracking-widest flex items-center gap-1">
                RTMP Transmitiendo
              </span>
            )}
          </div>
        </div>

        {/* Video stream container */}
        <div className="flex-1 flex items-center justify-center relative bg-slate-950 rounded-xl overflow-hidden mt-12 mb-16">
          <AnimatePresence>
            {isBreakActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-brand-blue mb-4 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <Coffee className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Clase en Pausa (Break)</h3>
                <p className="text-sm text-slate-400 max-w-sm mb-6">Estamos en un breve intermedio. La clase se reanudará pronto.</p>
                <div className="text-4xl font-mono font-black text-brand-blue bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl shadow-inner tracking-widest flex items-center gap-2.5">
                  <Clock className="w-6 h-6 animate-pulse text-slate-500" />
                  {formatTime(breakTimer)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render Active WebRTC Tracks */}
          <div className="w-full h-full flex items-center justify-center">
            {screenShareTrack ? (
              <VideoRenderer trackRef={screenShareTrack} className="w-full h-full object-contain" />
            ) : cameraTrack ? (
              <VideoRenderer trackRef={cameraTrack} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-slate-500 flex flex-col items-center gap-2">
                <VideoOff className="w-10 h-10" />
                <span className="text-sm font-medium">Cámara del profesor inactiva</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls dock (Bottom center) */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between gap-4 flex-wrap">
          {/* Media Toggles */}
          <div className="flex gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
            <MicButton room={room} />
            <CameraButton room={room} />
            {isAdmin && <ScreenShareButton room={room} />}
          </div>

          {/* Host Administration Commands */}
          {isAdmin && (
            <div className="flex gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
              <button 
                onClick={handleToggleBreak}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5
                  ${isBreakActive 
                    ? "bg-amber-600 text-white" 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }
                `}
                title="Pausar clase por intermedio"
              >
                <Coffee className="w-3.5 h-3.5" />
                {isBreakActive ? "Reanudar Clase" : "Pausar (Break)"}
              </button>

              <button 
                onClick={handleToggleStream}
                disabled={isStreaming || !activeClass.youtube_stream_key}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5
                  ${streamActive 
                    ? "bg-red-600 text-white" 
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }
                  disabled:opacity-40
                `}
                title="Transmitir streaming a YouTube Live"
              >
                {isStreaming ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : streamActive ? (
                  <Square className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                {streamActive ? "Detener Live" : "Transmitir Live"}
              </button>
            </div>
          )}

          {/* Leave/Exit button */}
          <div className="bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
            {isAdmin ? (
              <button 
                onClick={handleTerminateClass}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer shadow-sm transition-colors"
              >
                Terminar Clase
              </button>
            ) : (
              <button 
                onClick={onLeave}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-colors"
              >
                Salir
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── CHAT & ATTENDEES SIDEBAR (3/12 cols) ─── */}
      <div className="lg:col-span-3 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-950/40">
          <MessageSquare className="w-4 h-4 text-brand-blue" />
          <h4 className="font-bold text-xs text-slate-300 uppercase tracking-widest">Chat de la Clase</h4>
        </div>

        {/* Message feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-4">
              <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
              <span className="text-xs">¡Inicia la conversación! Envía un mensaje a la clase.</span>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="text-xs space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold ${msg.isAdmin ? 'text-amber-400' : 'text-slate-300'}`}>
                    {msg.sender}
                  </span>
                  {msg.isAdmin && (
                    <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[8px] font-black uppercase px-1 rounded-sm">Profesor</span>
                  )}
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <div className="bg-slate-950/40 border border-slate-800/30 p-2 rounded-xl text-slate-200 leading-relaxed break-words">
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input message form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/30 flex gap-2">
          <input 
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="Enviar un mensaje..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 transition-all"
          />
          <button 
            type="submit"
            className="p-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl transition-colors border-none cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── HELPER CLIENT RENDERER FOR VIDEO TRACK ───
function VideoRenderer({ trackRef, className }: { trackRef: any; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (trackRef.publication && videoRef.current) {
      trackRef.publication.track?.attach(videoRef.current);
    }
    return () => {
      if (trackRef.publication && videoRef.current) {
        trackRef.publication.track?.detach(videoRef.current);
      }
    };
  }, [trackRef]);

  return <video ref={videoRef} autoPlay playsInline className={className} />;
}

// ─── MICROPHONE DOCK TOGGLE BUTTON ───
function MicButton({ room }: { room: Room }) {
  const [enabled, setEnabled] = useState(room.localParticipant.isMicrophoneEnabled);

  const toggleMic = async () => {
    const nextState = !enabled;
    await room.localParticipant.setMicrophoneEnabled(nextState);
    setEnabled(nextState);
  };

  return (
    <button 
      onClick={toggleMic}
      className={`p-2 rounded-lg transition-all border-none cursor-pointer flex items-center justify-center
        ${enabled 
          ? "bg-slate-800 hover:bg-slate-700 text-slate-200" 
          : "bg-red-500/20 text-red-500 border border-red-500/30"
        }
      `}
      title={enabled ? "Silenciar micrófono" : "Activar micrófono"}
    >
      {enabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
    </button>
  );
}

// ─── CAMERA DOCK TOGGLE BUTTON ───
function CameraButton({ room }: { room: Room }) {
  const [enabled, setEnabled] = useState(room.localParticipant.isCameraEnabled);

  const toggleCamera = async () => {
    const nextState = !enabled;
    await room.localParticipant.setCameraEnabled(nextState);
    setEnabled(nextState);
  };

  return (
    <button 
      onClick={toggleCamera}
      className={`p-2 rounded-lg transition-all border-none cursor-pointer flex items-center justify-center
        ${enabled 
          ? "bg-slate-800 hover:bg-slate-700 text-slate-200" 
          : "bg-red-500/20 text-red-500 border border-red-500/30"
        }
      `}
      title={enabled ? "Apagar cámara" : "Encender cámara"}
    >
      {enabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
    </button>
  );
}

// ─── SCREEN SHARE DOCK TOGGLE BUTTON ───
function ScreenShareButton({ room }: { room: Room }) {
  const [enabled, setEnabled] = useState(room.localParticipant.isScreenShareEnabled);

  const toggleScreenShare = async () => {
    try {
      const nextState = !enabled;
      await room.localParticipant.setScreenShareEnabled(nextState);
      setEnabled(nextState);
    } catch (err) {
      console.error("Screen sharing cancelled or failed:", err);
    }
  };

  return (
    <button 
      onClick={toggleScreenShare}
      className={`p-2 rounded-lg transition-all border-none cursor-pointer flex items-center justify-center
        ${enabled 
          ? "bg-brand-blue text-white" 
          : "bg-slate-800 hover:bg-slate-700 text-slate-200"
        }
      `}
      title={enabled ? "Detener pantalla compartida" : "Compartir pantalla"}
    >
      <Monitor className="w-4 h-4" />
    </button>
  );
}
