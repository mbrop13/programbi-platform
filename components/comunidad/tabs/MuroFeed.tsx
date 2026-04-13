import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, TrendingUp, Trophy, ArrowRight, Heart, MessageCircle, Send, Loader2, Bookmark, Share2, MoreHorizontal, Smile, ImageIcon, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts, createPost, toggleLike, addComment, isCurrentUserAdmin } from "@/lib/supabase/comunidad";

interface MuroFeedProps {
  isRestricted?: boolean;
}

export default function MuroFeed({ isRestricted }: MuroFeedProps = {}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuestionPost, setIsQuestionPost] = useState(false);

  useEffect(() => {
     async function init() {
        try {
           const adminCheck = await isCurrentUserAdmin();
           setIsAdmin(adminCheck);
           const data = await getPosts();
           setPosts(data);
        } catch (err) {
           console.error("Failed fetching muro feed", err);
        } finally {
           setLoading(false);
        }
     }
     init();
  }, []);

  const handlePostSubmit = async () => {
     if (!newPostContent.trim()) return;
     setIsSubmitting(true);
     try {
        await createPost(newPostContent, isQuestionPost);
        setNewPostContent("");
        setIsQuestionPost(false);
        const data = await getPosts();
        setPosts(data);
     } catch (err: any) {
        alert(err.message);
     } finally {
        setIsSubmitting(false);
     }
  };

  const handleLike = async (postId: string) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
      try {
         await toggleLike(postId);
      } catch (err) {
         setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 1) - 1 } : p));
      }
  };

  const handleCreateComment = async (postId: string, content: string) => {
      try {
         await addComment(postId, content);
         const data = await getPosts();
         setPosts(data);
      } catch (err: any) {
         console.error(err);
      }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-[1400px] mx-auto">
        {/* ─── MAIN COLUMN ─── */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* WELCOME BANNER (Only on first visit / empty) */}
            {!loading && posts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-brand-blue via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-10 -mb-10"></div>
                <div className="relative z-10">
                  <h2 className="font-display font-black text-2xl sm:text-3xl mb-3">¡Bienvenido a la Comunidad! 🎉</h2>
                  <p className="text-white/80 max-w-lg text-sm sm:text-base leading-relaxed">
                    Aquí encontrarás anuncios, desafíos y el pulso de la academia ProgramBI. Comparte, aprende y conecta con otros estudiantes.
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* ─── POST COMPOSER ─── */}
            {isAdmin ? (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-blue to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    MO
                  </div>
                  <div className="flex-1 space-y-3">
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Escribe un anuncio o comparte algo con la comunidad..."
                      className="w-full bg-gray-50/80 rounded-xl px-4 py-3 border border-gray-200/80 focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white transition-all resize-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[60px]"
                      rows={2}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-blue-50 transition-colors">
                          <ImageIcon className="w-[18px] h-[18px]" />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors">
                          <Smile className="w-[18px] h-[18px]" />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          <Trophy className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                      <button 
                        onClick={handlePostSubmit}
                        disabled={isSubmitting || !newPostContent.trim()}
                        className="px-5 py-2 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                      >
                         {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                         Publicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsQuestionPost(true)}
                disabled={isRestricted}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-blue/20 transition-all text-left flex items-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-brand-blue/10 text-gray-400 group-hover:text-brand-blue flex items-center justify-center transition-colors shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-gray-400 group-hover:text-gray-600 text-sm font-medium transition-colors">¿Tienes una pregunta? Compártela con la comunidad...</span>
              </button>
            )}

            {/* QUESTION COMPOSER MODAL */}
            <AnimatePresence>
              {isQuestionPost && !isAdmin && !isRestricted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                      <span className="bg-indigo-100 px-2 py-1 rounded-md">PREGUNTA</span>
                      <span className="text-gray-400">La comunidad te ayudará</span>
                    </div>
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      autoFocus
                      placeholder="Describe tu duda sobre programación, SQL, datos..."
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[80px]"
                      rows={3}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setIsQuestionPost(false); setNewPostContent(""); }} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                      </button>
                      <button 
                        onClick={handlePostSubmit}
                        disabled={isSubmitting || !newPostContent.trim()}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Publicar Pregunta
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── FEED ─── */}
            <div className="space-y-5 min-h-[300px] relative">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                  <span className="text-sm text-gray-400 font-medium">Cargando publicaciones...</span>
                </div>
              )}

              {posts.map((post, index) => (
                 <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                 >
                   <PostCard 
                      post={post}
                      onLike={() => handleLike(post.id)}
                      onSubmitComment={(text: string) => handleCreateComment(post.id, text)}
                   />
                 </motion.div>
              ))}
            </div>
        </div>

        {/* ─── SIDEBAR ─── */}
        <div className="hidden lg:flex flex-col lg:col-span-4 gap-6 sticky top-24">
            <ContinueLearningCard />
            
            {/* LEADERBOARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                   <Trophy className="w-4 h-4 text-amber-500" />
                   <h3 className="font-bold text-gray-900 text-sm">Top Estudiantes</h3>
               </div>
               <div className="p-4 space-y-3">
                  {[
                    { name: "Ana Data", points: 2340, rank: 1 },
                    { name: "Carlos Dev", points: 1890, rank: 2 },
                    { name: "María SQL", points: 1670, rank: 3 },
                  ].map((student) => (
                    <div key={student.rank} className="flex items-center gap-3">
                       <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs
                         ${student.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                           student.rank === 2 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'}`}>
                         {student.rank}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate">{student.name}</div>
                       </div>
                       <span className="text-xs font-bold text-gray-400">{student.points.toLocaleString()} pts</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* QUICK LINKS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
               <h3 className="font-bold text-gray-900 text-sm mb-4">Recursos</h3>
               <div className="space-y-2">
                  {["📘 Guía de inicio rápido", "🎯 Roadmap de Aprendizaje", "💬 Preguntas Frecuentes"].map((item) => (
                    <button key={item} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium">
                      {item}
                    </button>
                  ))}
               </div>
            </div>
        </div>
    </div>
  )
}

function ContinueLearningCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
       <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
           <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-emerald-500" /> Continuar Aprendiendo
           </h3>
           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">65%</span>
       </div>
       <div className="p-4">
           <div className="relative aspect-video rounded-xl overflow-hidden mb-4 cursor-pointer">
              <Image 
                src="https://img.youtube.com/vi/bX9fXF4e_x8/maxresdefault.jpg" 
                alt="Curso thumbnail"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-blue shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 ml-0.5" />
                  </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                 <div className="h-full bg-gradient-to-r from-brand-blue to-indigo-500 w-[65%] rounded-r-full"></div>
              </div>
           </div>

           <div className="mb-4">
               <h4 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">Modelo de Datos Avanzado</h4>
               <p className="text-xs text-gray-500 line-clamp-1">Power BI Expert · Módulo 7</p>
           </div>
           
           <button className="w-full py-2.5 text-center text-sm font-bold text-white rounded-xl bg-brand-blue hover:bg-blue-600 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
              Continuar Clase <ArrowRight className="w-4 h-4" />
           </button>
       </div>
    </div>
  )
}

function PostCard({ post, onLike, onSubmitComment }: any) {
  const isQuestion = post.channel_id === 'support';
  const authorName = post.author?.full_name || 'Estudiante';
  const timeStr = getRelativeTime(post.created_at);
  const [commentOpen, setCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const handleCommentSubmit = () => {
      if(!newComment.trim()) return;
      onSubmitComment(newComment);
      setNewComment("");
  };

  const handleLikeClick = () => {
      setIsLiked(!isLiked);
      onLike();
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 shrink-0 overflow-hidden text-sm">
             {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
             ) : (
                authorName.charAt(0).toUpperCase()
             )}
          </div>
          <div>
             <div className="flex items-center gap-2">
               <h4 className="font-bold text-gray-900 text-sm">{authorName}</h4>
               {post.author?.role === 'admin' && (
                 <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-wide">ADMIN</span>
               )}
             </div>
             <span className="text-xs text-gray-400 font-medium">{timeStr}</span>
          </div>
        </div>
        <button className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-3">
        {isQuestion && (
           <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-wide">
             ❓ PREGUNTA
           </span>
        )}
        {post.is_pinned && (
           <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black tracking-wide">
             📌 FIJADO
           </span>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-5">
        {post.content}
      </p>
      
      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
         <button 
           onClick={handleLikeClick} 
           className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95
             ${isLiked || post.likes_count > 0 ? 'text-rose-500 hover:bg-rose-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
         >
           <Heart className={`w-[18px] h-[18px] transition-all ${isLiked ? 'fill-rose-500 scale-110' : ''}`} /> 
           {post.likes_count || ''}
         </button>
         <button 
           onClick={() => setCommentOpen(!commentOpen)} 
           className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all
             ${commentOpen ? 'text-brand-blue bg-blue-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
         >
           <MessageCircle className="w-[18px] h-[18px]" /> 
           {post.comments?.length > 0 ? post.comments.length : ''}
         </button>
         <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
           <Bookmark className="w-[18px] h-[18px]" />
         </button>
         <div className="flex-1"></div>
         <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
           <Share2 className="w-[18px] h-[18px]" />
         </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {commentOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              {post.comments?.map((c: any) => (
                 <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl">
                     <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-[10px] shrink-0 text-gray-600">
                        {c.author?.full_name?.charAt(0) || 'U'}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-xs text-gray-900">{c.author?.full_name || 'Estudiante'}</span>
                          <span className="text-[10px] text-gray-400">{getRelativeTime(c.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
                     </div>
                 </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                 <div className="w-7 h-7 rounded-lg bg-brand-blue/10 flex items-center justify-center font-bold text-[10px] text-brand-blue shrink-0">
                    T
                 </div>
                 <div className="flex-1 relative">
                   <input 
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 pr-11 text-sm focus:outline-none focus:border-brand-blue/40 focus:ring-2 focus:ring-brand-blue/10 focus:bg-white transition-all placeholder:text-gray-400"
                      placeholder="Escribe un comentario..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
                   />
                   <button 
                     onClick={handleCommentSubmit} 
                     disabled={!newComment.trim()}
                     className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-blue disabled:opacity-30 text-white p-1.5 rounded-lg hover:bg-blue-600 transition-all"
                   >
                      <Send className="w-3.5 h-3.5" />
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin}m`;
  if (diffHr < 24) return `Hace ${diffHr}h`;
  if (diffDay < 7) return `Hace ${diffDay}d`;
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}
