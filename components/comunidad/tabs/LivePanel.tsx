"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Volume2,
  Sun,
  Moon,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LiveKitRoom, 
  useTracks, 
  useRoomContext,
  useParticipants,
  useConnectionState,
  VideoTrack,
  isTrackReference
} from "@livekit/components-react";
import { RoomEvent, Track, Room, ConnectionState } from "livekit-client";

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

// Polling interval when there's a scheduled class (check more often for status changes)
const POLL_INTERVAL_ACTIVE = 10_000;   // 10s â€” detect when admin starts class
const POLL_INTERVAL_IDLE = 30_000;     // 30s â€” idle background refresh

export default function LivePanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [completedClasses, setCompletedClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [error, setError] = useState<string | null>(null);

  // Form states for creating a class
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomName, setRoomName] = useState("");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form for adding completed class recording
  const [showAddRecording, setShowAddRecording] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [recordingDescription, setRecordingDescription] = useState("");
  const [recordingVideoId, setRecordingVideoId] = useState("");
  const [recordingDate, setRecordingDate] = useState("");
  const [submittingRecording, setSubmittingRecording] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // â”€â”€â”€ Reliable admin check via server API (bypasses RLS) â”€â”€â”€
  const checkAdmin = useCallback(async () => {
    try {
      const res = await fetch("/api/live/check-admin");
      const data = await res.json();
      setIsAdmin(!!data.isAdmin);
      setAdminChecked(true);
      return !!data.isAdmin;
    } catch (err) {
      console.error("Error checking admin status:", err);
      setAdminChecked(true);
      return false;
    }
  }, []);

  // â”€â”€â”€ Fetch active/scheduled live classes â”€â”€â”€
  const fetchClassInfo = useCallback(async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data: classes, error: classError } = await supabase
        .from("live_classes")
        .select("*")
        .in("status", ["active", "scheduled"])
        .order("status", { ascending: false })
        .order("scheduled_at", { ascending: true })
        .limit(1);

      if (classError) throw classError;
      setActiveClass(classes && classes.length > 0 ? classes[0] : null);

      // Fetch completed classes (recordings)
      const { data: completed, error: completedError } = await supabase
        .from("live_classes")
        .select("*")
        .eq("status", "completed")
        .order("scheduled_at", { ascending: false })
        .limit(10);

      if (completedError) throw completedError;
      setCompletedClasses(completed || []);

      setError(null);
    } catch (err: any) {
      console.error("Error fetching live classes:", err);
      setError("No se pudieron cargar las clases en vivo.");
    }
  }, []);

  // â”€â”€â”€ Initial load: check admin + fetch classes â”€â”€â”€
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([checkAdmin(), fetchClassInfo()]);
      setLoading(false);
    };
    init();
  }, [checkAdmin, fetchClassInfo]);

  // â”€â”€â”€ Auto-polling to detect class status changes â”€â”€â”€
  useEffect(() => {
    if (token) return; // Don't poll while connected to a room

    const interval = activeClass?.status === "scheduled" ? POLL_INTERVAL_ACTIVE : POLL_INTERVAL_IDLE;

    pollRef.current = setInterval(() => {
      fetchClassInfo();
    }, interval);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [token, activeClass?.status, fetchClassInfo]);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([checkAdmin(), fetchClassInfo()]);
    setLoading(false);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !roomName.trim() || !scheduledAt) return;
    setSubmitting(true);
    setError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data, error: insertError } = await supabase
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

      if (insertError) throw insertError;

      setActiveClass(data);
      setTitle("");
      setDescription("");
      setRoomName("");
      setYoutubeKey("");
      setScheduledAt("");
    } catch (err: any) {
      setError("Error al agendar clase: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartClass = async () => {
    if (!activeClass) return;
    setLoading(true);
    setError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: startError } = await supabase
        .from("live_classes")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", activeClass.id);

      if (startError) throw startError;
      await fetchClassInfo();
    } catch (err: any) {
      setError("Error al iniciar clase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!activeClass) return;
    setIsConnecting(true);
    setError(null);
    try {
      const response = await fetch(`/api/live/token?roomName=${activeClass.room_name}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setToken(data.token);
    } catch (err: any) {
      setError("Error al conectar: " + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLeaveRoom = () => {
    setToken(null);
    fetchClassInfo();
  };

  // â”€â”€â”€ Add completed class recording (admin only) â”€â”€â”€
  const handleAddRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingTitle.trim() || !recordingVideoId.trim() || !recordingDate) return;
    setSubmittingRecording(true);
    setError(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from("live_classes")
        .insert({
          title: recordingTitle.trim(),
          description: recordingDescription.trim() || null,
          room_name: `recording-${Date.now()}`,
          youtube_video_id: recordingVideoId.trim(),
          scheduled_at: new Date(recordingDate).toISOString(),
          status: "completed"
        });

      if (insertError) throw insertError;

      // Refresh completed classes list
      await fetchClassInfo();
      
      // Reset form
      setRecordingTitle("");
      setRecordingDescription("");
      setRecordingVideoId("");
      setRecordingDate("");
      setShowAddRecording(false);
    } catch (err: any) {
      setError("Error al agregar grabación: " + err.message);
    } finally {
      setSubmittingRecording(false);
    }
  };

  // â”€â”€â”€ Loading state â”€â”€â”€
  if (loading && !adminChecked) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
        <span className="text-sm text-gray-400 font-medium">Cargando transmisión...</span>
      </div>
    );
  }

  // â”€â”€â”€ CASE 1: ACTIVE ROOM (LiveKit Session) â”€â”€â”€
  if (token && activeClass) {
    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://programbi.livekit.cloud";

    return (
      <div className={`w-full rounded-3xl overflow-hidden shadow-2xl p-2 sm:p-4 min-h-[500px] border transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-slate-950 text-white border-slate-800' 
          : 'bg-white text-slate-900 border-slate-200'
        }
      `}>
        <LiveKitRoom
          token={token}
          serverUrl={livekitUrl}
          connect={true}
          audio={isAdmin}
          video={false}
          onDisconnected={handleLeaveRoom}
          className="flex flex-col h-full gap-4"
        >
          <ClassroomView 
            isAdmin={isAdmin} 
            activeClass={activeClass} 
            onLeave={handleLeaveRoom}
            theme={theme}
            setTheme={setTheme}
          />
        </LiveKitRoom>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0 cursor-pointer"
            >
              Cerrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refresh button (top right) */}
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40 cursor-pointer bg-transparent border-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

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

      {/* â”€â”€â”€ COMPLETED CLASSES (RECORDINGS) SECTION â”€â”€â”€ */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-black text-lg text-gray-900 mb-1">Clases Grabadas</h3>
            <p className="text-sm text-gray-400">Revisa las masterclasses anteriores cuando quieras.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddRecording(!showAddRecording)}
              className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
            >
              {showAddRecording ? "Cancelar" : "Agregar Grabación"}
            </button>
          )}
        </div>

        {/* Admin form to add recording */}
        <AnimatePresence>
          {isAdmin && showAddRecording && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddRecording}
              className="mb-6 p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Título de la Grabación *</label>
                  <input 
                    type="text" 
                    required 
                    value={recordingTitle} 
                    onChange={e => setRecordingTitle(e.target.value)} 
                    placeholder="Ej. Masterclass SQL Server - Sesión 1" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">ID de Video de YouTube *</label>
                  <input 
                    type="text" 
                    required 
                    value={recordingVideoId} 
                    onChange={e => setRecordingVideoId(e.target.value)} 
                    placeholder="Ej. dQw4w9WgXcQ" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
                <textarea 
                  value={recordingDescription} 
                  onChange={e => setRecordingDescription(e.target.value)} 
                  placeholder="Breve descripción del contenido de la clase..." 
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none min-h-[60px]" 
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fecha de la Clase *</label>
                <input 
                  type="datetime-local" 
                  required 
                  value={recordingDate} 
                  onChange={e => setRecordingDate(e.target.value)} 
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={submittingRecording}
                  className="px-6 py-3 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all border-none cursor-pointer"
                >
                  {submittingRecording ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  {submittingRecording ? "Agregando..." : "Agregar Grabación"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Recordings grid */}
        {completedClasses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedClasses.map((recording) => (
              <motion.a
                key={recording.id}
                href={recording.youtube_video_id ? `https://www.youtube.com/watch?v=${recording.youtube_video_id}` : "#"}
                target={recording.youtube_video_id ? "_blank" : undefined}
                rel={recording.youtube_video_id ? "noopener noreferrer" : undefined}
                whileHover={{ scale: 1.02 }}
                className="group bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 border border-gray-200 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0 group-hover:bg-red-100 transition-colors">
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{recording.title}</h4>
                    {recording.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{recording.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(recording.scheduled_at).toLocaleDateString("es-CL")}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Video className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">No hay grabaciones disponibles</h4>
            <p className="text-sm text-gray-400">Las clases grabadas aparecerán aquí.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// â”€â”€â”€ CLASSROOM INTERNAL VIEW COMPONENT â”€â”€â”€
interface ClassroomViewProps {
  isAdmin: boolean;
  activeClass: LiveClass;
  onLeave: () => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

function ClassroomView({ isAdmin, activeClass, onLeave, theme, setTheme }: ClassroomViewProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState();
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

  // Tracks — only real published tracks (no placeholders)
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false }
  ]);

  const participants = useParticipants();

  // Connection status indicator
  const isConnected = connectionState === ConnectionState.Connected;
  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  // Listen for data channel messages (break start/stop, chat messages)
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

  // Host Action: Start/stop streaming room layout to YouTube Live
  const handleToggleStream = async () => {
    if (isStreaming) return;
    setIsStreaming(true);
    try {
      const actionType = streamActive ? "stop" : "start";

      const res = await fetch("/api/live/egress", {
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

    const encoder = new TextEncoder();
    const payload = encoder.encode(JSON.stringify({
      type: nextState ? "break_start" : "break_stop",
      duration: 600
    }));

    room.localParticipant.publishData(payload, { reliable: true });

    if (nextState) {
      setBreakTimer(600);
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
    
    room.localParticipant.publishData(payload, { reliable: true });

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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Identify real published tracks (filter out placeholders)
  const screenShareTrack = tracks.find(t => t.source === Track.Source.ScreenShare && isTrackReference(t));
  const cameraTrack = tracks.find(t => t.source === Track.Source.Camera && isTrackReference(t));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px] w-full relative">
      {/* â”€â”€â”€ MAIN STAGE / VIDEO SCREEN (9/12 cols) â”€â”€â”€ */}
      <div className={`lg:col-span-9 rounded-2xl overflow-hidden flex flex-col justify-between p-4 relative border transition-colors duration-300
        ${theme === 'dark'
          ? 'bg-slate-900 border-slate-800'
          : 'bg-slate-100 border-slate-200 shadow-inner'
        }
      `}>
        
        {/* Host Header bar with Status indicators */}
        <div className={`flex justify-between items-center px-4 py-2.5 rounded-xl border transition-colors duration-300 absolute top-4 left-4 right-4 z-20
          ${theme === 'dark'
            ? 'bg-slate-950/80 border-slate-800/50 text-white'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
          }
        `}>
          <div className="flex items-center gap-2">
            {isReconnecting ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            )}
            <h4 className={`font-bold text-xs truncate max-w-[150px] sm:max-w-md ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {activeClass.title}
            </h4>
            {isReconnecting && (
              <span className="text-[10px] text-amber-400 font-bold">Reconectando...</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors
              ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}
            `}>
              <Users className="w-3 h-3" />
              {participants.length}
            </span>
            {streamActive && (
              <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2.5 py-0.5 rounded-md border border-red-500/30 uppercase tracking-widest flex items-center gap-1">
                RTMP Transmitiendo
              </span>
            )}
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center
                ${theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-amber-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                }
              `}
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Video stream container */}
        <div className={`flex-1 flex items-center justify-center relative rounded-xl overflow-hidden mt-12 mb-16 transition-colors duration-300
          ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-200'}
        `}>
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
            {screenShareTrack && isTrackReference(screenShareTrack) ? (
              <VideoTrack trackRef={screenShareTrack} className="w-full h-full object-contain" />
            ) : cameraTrack && isTrackReference(cameraTrack) ? (
              <VideoTrack trackRef={cameraTrack} className="w-full h-full object-cover" />
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
          {/* Media Toggles â€” only for admin/host (students have canPublish: false) */}
          {isAdmin && (
            <div className={`flex gap-2 p-1.5 rounded-xl border transition-colors duration-300
              ${theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-md'}
            `}>
              <MicButton room={room} theme={theme} />
              <CameraButton room={room} theme={theme} />
              <ScreenShareButton room={room} theme={theme} />
            </div>
          )}

          {/* Host Administration Commands */}
          {isAdmin && (
            <div className={`flex gap-2 p-1.5 rounded-xl border transition-colors duration-300
              ${theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-md'}
            `}>
              <button 
                onClick={handleToggleBreak}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5
                  ${isBreakActive 
                    ? "bg-amber-600 text-white" 
                    : theme === 'dark'
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
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
                    : theme === 'dark'
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
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
          <div className={`p-1.5 rounded-xl border transition-colors duration-300
            ${theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-md'}
          `}>
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
                className={`px-4 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition-colors
                  ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}
                `}
              >
                Salir
              </button>
            )}
          </div>
        </div>
      </div>

      {/* â”€â”€â”€ CHAT & ATTENDEES SIDEBAR (3/12 cols) â”€â”€â”€ */}
      <div className={`lg:col-span-3 rounded-2xl overflow-hidden border flex flex-col h-full transition-colors duration-300
        ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-gray-200'}
      `}>
        {/* Sidebar Header */}
        <div className={`p-4 border-b flex items-center gap-2 transition-colors duration-300
          ${theme === 'dark' ? 'border-slate-800 bg-slate-950/40 text-slate-300' : 'border-gray-200 bg-gray-105 text-slate-750'}
        `}>
          <MessageSquare className="w-4 h-4 text-brand-blue" />
          <h4 className="font-bold text-xs uppercase tracking-widest">Chat de la Clase</h4>
        </div>

        {/* Message feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-4">
              <MessageSquare className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`} />
              <span className="text-xs">¡Inicia la conversación! Envía un mensaje a la clase.</span>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="text-xs space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold
                    ${msg.isAdmin 
                      ? 'text-amber-400' 
                      : theme === 'dark' 
                        ? 'text-slate-300' 
                        : 'text-slate-700'
                    }
                  `}>
                    {msg.sender}
                  </span>
                  {msg.isAdmin && (
                    <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[8px] font-black uppercase px-1 rounded-sm">Profesor</span>
                  )}
                  <span className="text-[10px] text-slate-500">{msg.time}</span>
                </div>
                <div className={`border p-2 rounded-xl leading-relaxed break-words transition-colors duration-300
                  ${theme === 'dark' 
                    ? 'bg-slate-950/40 border-slate-800/30 text-slate-200' 
                    : 'bg-white border-gray-200 text-slate-800'
                  }
                `}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input message form */}
        <form onSubmit={handleSendMessage} className={`p-3 border-t flex gap-2 transition-colors duration-300
          ${theme === 'dark' ? 'border-slate-800 bg-slate-950/30' : 'border-gray-200 bg-gray-105'}
        `}>
          <input 
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="Enviar un mensaje..."
            className={`flex-1 rounded-xl px-3 py-2 text-xs placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-brand-blue/30 transition-all
              ${theme === 'dark' 
                ? 'bg-slate-950 border-slate-800 text-white focus:border-brand-blue' 
                : 'bg-white border-gray-300 text-slate-900 focus:border-brand-blue focus:ring-brand-blue/20'
              }
            `}
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

// ─── MICROPHONE DOCK TOGGLE BUTTON (Host only) ───
function MicButton({ room, theme }: { room: Room; theme?: 'light' | 'dark' }) {
  const [enabled, setEnabled] = useState(room.localParticipant.isMicrophoneEnabled);

  useEffect(() => {
    const sync = () => setEnabled(room.localParticipant.isMicrophoneEnabled);
    room.on(RoomEvent.LocalTrackPublished, sync);
    room.on(RoomEvent.LocalTrackUnpublished, sync);
    room.on(RoomEvent.TrackMuted, sync);
    room.on(RoomEvent.TrackUnmuted, sync);
    return () => {
      room.off(RoomEvent.LocalTrackPublished, sync);
      room.off(RoomEvent.LocalTrackUnpublished, sync);
      room.off(RoomEvent.TrackMuted, sync);
      room.off(RoomEvent.TrackUnmuted, sync);
    };
  }, [room]);

  const toggleMic = async () => {
    const nextState = !enabled;
    await room.localParticipant.setMicrophoneEnabled(nextState);
  };

  return (
    <button 
      onClick={toggleMic}
      className={`p-2 rounded-lg transition-all border-none cursor-pointer flex items-center justify-center
        ${enabled 
          ? theme === 'dark'
            ? "bg-slate-800 hover:bg-slate-700 text-slate-200" 
            : "bg-slate-100 hover:bg-slate-200 text-slate-650"
          : "bg-red-500/20 text-red-500 border border-red-500/30"
        }
      `}
      title={enabled ? "Silenciar micrófono" : "Activar micrófono"}
    >
      {enabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
    </button>
  );
}

// ─── CAMERA DOCK TOGGLE BUTTON (Host only) ───
function CameraButton({ room, theme }: { room: Room; theme?: 'light' | 'dark' }) {
  const [enabled, setEnabled] = useState(room.localParticipant.isCameraEnabled);

  useEffect(() => {
    const sync = () => setEnabled(room.localParticipant.isCameraEnabled);
    room.on(RoomEvent.LocalTrackPublished, sync);
    room.on(RoomEvent.LocalTrackUnpublished, sync);
    room.on(RoomEvent.TrackMuted, sync);
    room.on(RoomEvent.TrackUnmuted, sync);
    return () => {
      room.off(RoomEvent.LocalTrackPublished, sync);
      room.off(RoomEvent.LocalTrackUnpublished, sync);
      room.off(RoomEvent.TrackMuted, sync);
      room.off(RoomEvent.TrackUnmuted, sync);
    };
  }, [room]);

  const toggleCamera = async () => {
    const nextState = !enabled;
    await room.localParticipant.setCameraEnabled(nextState);
  };

  return (
    <button 
      onClick={toggleCamera}
      className={`p-2 rounded-lg transition-all border-none cursor-pointer flex items-center justify-center
        ${enabled 
          ? theme === 'dark'
            ? "bg-slate-800 hover:bg-slate-700 text-slate-200" 
            : "bg-slate-100 hover:bg-slate-200 text-slate-650"
          : "bg-red-500/20 text-red-500 border border-red-500/30"
        }
      `}
      title={enabled ? "Apagar cámara" : "Encender cámara"}
    >
      {enabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
    </button>
  );
}

// ─── SCREEN SHARE DOCK TOGGLE BUTTON (Host only) ───
function ScreenShareButton({ room, theme }: { room: Room; theme?: 'light' | 'dark' }) {
  const [enabled, setEnabled] = useState(room.localParticipant.isScreenShareEnabled);

  useEffect(() => {
    const sync = () => setEnabled(room.localParticipant.isScreenShareEnabled);
    room.on(RoomEvent.LocalTrackPublished, sync);
    room.on(RoomEvent.LocalTrackUnpublished, sync);
    room.on(RoomEvent.TrackMuted, sync);
    room.on(RoomEvent.TrackUnmuted, sync);
    return () => {
      room.off(RoomEvent.LocalTrackPublished, sync);
      room.off(RoomEvent.LocalTrackUnpublished, sync);
      room.off(RoomEvent.TrackMuted, sync);
      room.off(RoomEvent.TrackUnmuted, sync);
    };
  }, [room]);

  const toggleScreenShare = async () => {
    try {
      const nextState = !enabled;
      await room.localParticipant.setScreenShareEnabled(nextState);
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
          : theme === 'dark'
            ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
            : "bg-slate-100 hover:bg-slate-200 text-slate-650"
        }
      `}
      title={enabled ? "Detener pantalla compartida" : "Compartir pantalla"}
    >
      <Monitor className="w-4 h-4" />
    </button>
  );
}
