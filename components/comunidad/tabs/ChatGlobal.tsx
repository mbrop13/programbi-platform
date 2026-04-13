import { useState, useRef, useEffect } from "react";
import { Hash, MessageSquare, Plus, Search, Send, Paperclip, Settings, User, Smile, Phone, Video, Pin, AtSign, Bell, ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatGlobalProps {
  isRestricted?: boolean;
}

export default function ChatGlobal({ isRestricted }: ChatGlobalProps = {}) {
  const [activeChannel, setActiveChannel] = useState("general");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const channels = [
    { id: "anuncios", name: "anuncios", type: "announcement", unread: 2 },
    { id: "general", name: "general", type: "text", unread: 0 },
    { id: "python", name: "python-help", type: "support", unread: 5 },
    { id: "sql", name: "sql-queries", type: "support", unread: 0 },
    { id: "powerbi", name: "power-bi", type: "support", unread: 1 },
  ];

  const messages = [
    { id: 1, author: "Manuel Oliva", initials: "MO", role: "admin", color: "bg-gradient-to-br from-brand-blue to-indigo-600", time: "11:40 AM", content: "Bienvenidos a todos. Si tienen dudas sobre el material de la clase anterior, déjenlo acá. Recuerden que mañana tenemos sesión en vivo a las 8PM 🚀" },
    { id: 2, author: "Ana Data", initials: "AD", color: "bg-emerald-500", time: "11:42 AM", content: "Genial, gracias por la explicación. Ahora entiendo mejor cómo funcionan los índices de BD. ¿Podrías compartir el notebook?" },
    { id: 3, author: "Carlos Dev", initials: "CD", color: "bg-orange-500", time: "11:45 AM", content: "Yo también me sumo a la pregunta de Ana 👆 Me perdí la parte de los índices clustered vs non-clustered." },
    { id: 4, author: "Manuel Oliva", initials: "MO", role: "admin", color: "bg-gradient-to-br from-brand-blue to-indigo-600", time: "11:48 AM", content: "Claro, les comparto el enlace al notebook en un momento. También subiré un mini-video explicando los índices paso a paso 📹" },
  ];

  const onlineUsers = [
    { name: "Manuel Oliva", initials: "MO", role: "admin", color: "bg-gradient-to-br from-brand-blue to-indigo-600", status: "online" },
    { name: "Ana Data", initials: "AD", color: "bg-emerald-500", status: "online" },
    { name: "Carlos Dev", initials: "CD", color: "bg-orange-500", status: "idle" },
    { name: "María SQL", initials: "MS", color: "bg-violet-500", status: "offline" },
  ];

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      
      {/* ─── CHANNEL SIDEBAR ─── */}
      <div className="w-[260px] bg-gray-50/80 border-r border-gray-200/60 flex-col hidden md:flex shrink-0">
         {/* Server Header */}
         <div className="h-[60px] flex items-center px-5 border-b border-gray-200/60 shrink-0 gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight">ProgramBI</h3>
              <p className="text-[10px] text-gray-400 font-medium">Comunidad de Data</p>
            </div>
         </div>
         
         {/* Channel List */}
         <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-4">
            <div>
               <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
                 <span>Canales</span>
                 <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600 transition-colors" />
               </div>
               <div className="space-y-0.5">
                  {channels.map(channel => (
                     <button 
                       key={channel.id}
                       onClick={() => setActiveChannel(channel.id)}
                       className={`w-full flex items-center justify-between gap-2 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all
                         ${activeChannel === channel.id 
                           ? 'bg-brand-blue/10 text-brand-blue font-semibold' 
                           : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                     >
                        <span className="flex items-center gap-2">
                          <Hash className="w-4 h-4 opacity-50" />
                          {channel.name}
                        </span>
                        {channel.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {channel.unread}
                          </span>
                        )}
                     </button>
                  ))}
               </div>
            </div>

            <div>
               <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
                 <span>Mensajes Directos</span>
                 <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-gray-600 transition-colors" />
               </div>
               <div className="space-y-0.5">
                  <button className="w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all">
                     <div className="relative">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">M</div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-[1.5px] ring-gray-50"></div>
                     </div>
                     Manuel Oliva
                  </button>
               </div>
            </div>
         </div>

         {/* Active User Bar */}
         <div className="p-3 bg-gray-100/80 border-t border-gray-200/60 shrink-0">
            <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100">
               <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">T</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 leading-tight">Tu Usuario</div>
                    <div className="text-[10px] text-emerald-500 font-bold">En línea</div>
                  </div>
               </div>
               <button className="text-gray-300 hover:text-gray-500 p-1 rounded transition-colors">
                  <Settings className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* ─── MAIN CHAT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
         {isRestricted && (
           <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 border-l border-white/20">
             <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-brand-blue">
               <Lock className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad Premium</h3>
             <p className="text-gray-600 text-center max-w-sm mb-6">Suscríbete para leer el historial completo y conectar en tiempo real con otros estudiantes y expertos.</p>
             <a href="/comunidad" className="bg-brand-blue text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">Ver Planes</a>
           </div>
         )}
         {/* Channel Header */}
         <div className="h-[60px] border-b border-gray-200/60 flex items-center justify-between px-5 bg-white/80 backdrop-blur-md z-10 shrink-0">
             <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2">
                   <Hash className="w-5 h-5 text-gray-300" />
                   <h3 className="font-bold text-gray-900">{activeChannel}</h3>
                 </div>
                 <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
                 <span className="text-xs text-gray-400 font-medium hidden sm:block">Canal general de la comunidad</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors hidden sm:flex">
                   <Pin className="w-4 h-4" />
                 </button>
                 <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors hidden sm:flex">
                   <Bell className="w-4 h-4" />
                 </button>
                 <div className="relative hidden sm:block">
                   <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <input type="text" placeholder="Buscar..." className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm w-44 focus:outline-none focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 transition-all" />
                 </div>
                 <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors lg:hidden">
                    <User className="w-4 h-4" />
                 </button>
             </div>
         </div>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto p-5 space-y-1 custom-scrollbar">
             {/* Date Divider */}
             <div className="flex items-center gap-4 my-4">
                 <div className="h-px bg-gray-100 flex-1"></div>
                 <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Hoy</span>
                 <div className="h-px bg-gray-100 flex-1"></div>
             </div>

             {messages.map((msg) => (
               <div key={msg.id} className="flex gap-3.5 group hover:bg-gray-50/50 -mx-3 px-3 py-2 rounded-xl transition-colors">
                   <div className={`w-10 h-10 rounded-xl ${msg.color} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm`}>
                     {msg.initials}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                         <span className="font-bold text-sm text-gray-900 hover:underline cursor-pointer">{msg.author}</span>
                         {msg.role === "admin" && (
                           <span className="text-[9px] font-black bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded-md tracking-wide">ADMIN</span>
                         )}
                         <span className="text-[11px] text-gray-400 font-medium">{msg.time}</span>
                      </div>
                      <p className="text-gray-700 text-[15px] leading-relaxed">{msg.content}</p>
                   </div>
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-0.5 pt-1">
                     <button className="p-1 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                       <Smile className="w-4 h-4" />
                     </button>
                   </div>
               </div>
             ))}
             <div ref={messagesEndRef} />
         </div>

         {/* Message Input */}
         <div className="p-4 shrink-0">
            <div className="bg-gray-50/80 border border-gray-200 rounded-2xl px-4 py-2 flex items-end gap-2 focus-within:border-brand-blue/40 focus-within:ring-2 focus-within:ring-brand-blue/10 focus-within:bg-white transition-all">
                <button className="text-gray-300 hover:text-brand-blue p-1 mb-1 transition-colors rounded-lg hover:bg-blue-50">
                   <Plus className="w-5 h-5" />
                </button>
                <textarea 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={`Mensaje en #${activeChannel}`} 
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-32 min-h-[28px] py-1 custom-scrollbar text-[15px] text-gray-700 placeholder:text-gray-400"
                  rows={1}
                />
                <div className="flex items-center gap-0.5 mb-1">
                  <button className="text-gray-300 hover:text-gray-500 p-1 transition-colors rounded-lg hover:bg-gray-100">
                     <Smile className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="text-gray-300 hover:text-brand-blue disabled:hover:text-gray-300 p-1 transition-colors rounded-lg hover:bg-blue-50 disabled:hover:bg-transparent"
                  >
                     <Send className="w-5 h-5" />
                  </button>
                </div>
            </div>
         </div>
      </div>

      {/* ─── MEMBERS SIDEBAR ─── */}
      <div className="w-[240px] bg-gray-50/50 border-l border-gray-200/60 hidden lg:flex flex-col shrink-0 p-4">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
             En línea — {onlineUsers.filter(u => u.status !== 'offline').length}
          </div>
          <div className="space-y-1">
             {onlineUsers.filter(u => u.status !== 'offline').map((user, i) => (
               <div key={i} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-100/80 cursor-pointer transition-colors group">
                   <div className="relative">
                      <div className={`w-8 h-8 rounded-lg ${user.color} text-white flex items-center justify-center font-bold text-[10px] shadow-sm`}>{user.initials}</div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-gray-50
                        ${user.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                   </div>
                   <div className="flex-1 min-w-0">
                     <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate block transition-colors">{user.name}</span>
                     {user.role === 'admin' && <span className="text-[9px] text-brand-blue font-bold">Admin</span>}
                   </div>
               </div>
             ))}
          </div>

          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-1">
             Desconectados — {onlineUsers.filter(u => u.status === 'offline').length}
          </div>
          <div className="space-y-1">
             {onlineUsers.filter(u => u.status === 'offline').map((user, i) => (
               <div key={i} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-100/80 cursor-pointer transition-colors opacity-50 hover:opacity-100">
                   <div className="relative">
                      <div className={`w-8 h-8 rounded-lg bg-gray-300 text-white flex items-center justify-center font-bold text-[10px]`}>{user.initials}</div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gray-400 rounded-full ring-2 ring-gray-50"></div>
                   </div>
                   <span className="text-sm font-medium text-gray-500 truncate">{user.name}</span>
               </div>
             ))}
          </div>
      </div>
    </div>
  )
}
