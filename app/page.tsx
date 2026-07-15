'use client';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [usernameInput, setUsernameInput] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [postType, setPostType] = useState('text');
  const [content, setContent] = useState('');
  const [feed, setFeed] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) fetchProfile(activeUser.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchProfile(activeUser.id);
      } else {
        setProfile(null);
      }
    });

    fetchFeed();

    // Real-Time Syncing Channel
    const feedChannel = supabase
      .channel('realtime-posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchFeed();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(feedChannel);
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data);
      setUsernameInput(data.username || '');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !usernameInput.trim()) return;
    setUpdatingProfile(true);

    const cleanUsername = usernameInput.trim().replace(/[^a-zA-Z0-9_]/g, '');

    const { error } = await supabase
      .from('profiles')
      .update({ username: cleanUsername })
      .eq('id', user.id);

    if (error) {
      alert(error.message);
    } else {
      alert('Network alias updated successfully!');
      fetchProfile(user.id);
      fetchFeed(); // Instantly update user handle displayed on posts
    }
    setUpdatingProfile(false);
  };

  // Fetch feed and join with profiles to get the creator's username
  const fetchFeed = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          username
        )
      `)
      .order('created_at', { ascending: false });
    
    if (!error && data) setFeed(data);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    
    const { error } = authView === 'signup' 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
    } else if (authView === 'signup') {
      alert('Registration successful! Please sign in with your credentials.');
      setAuthView('login');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleCreatePost = async () => {
    if (!content || !user) return;
    setLoading(true);
    
    const { error } = await supabase.from('posts').insert([
      { user_id: user.id, content, post_type: postType }
    ]);

    if (!error) {
      setContent('');
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: postType }),
      });
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      } else {
        alert("System offline or invalid API key configuration.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to contact AI uplink.");
    }
    setAiLoading(false);
  };

  const handleLikePost = async (postId: number, currentLikes: string[]) => {
    if (!user) return alert("You must connect your system to interact!");
    const likesArray = currentLikes || [];
    const hasLiked = likesArray.includes(user.id);
    
    const updatedLikes = hasLiked 
      ? likesArray.filter(id => id !== user.id)
      : [...likesArray, user.id];

    const { error } = await supabase
      .from('posts')
      .update({ likes: updatedLikes })
      .eq('id', postId);

    if (error) alert(error.message);
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to terminate this data record?")) return;
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) alert(error.message);
  };

  // Filter posts dynamically
  const filteredFeed = activeFilter === 'all' 
    ? feed 
    : feed.filter(post => post.post_type === activeFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Pulse<span className="text-cyan-400 font-light">Network</span>
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right font-mono">
                <span className="text-xs font-semibold text-cyan-400">
                  @{profile?.username || 'identifying...'}
                </span>
                <span className="text-[9px] text-emerald-400 flex items-center justify-end gap-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping" /> Uplink Active
                </span>
              </div>
              <button 
                onClick={handleSignOut} 
                className="text-xs bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:text-rose-400 px-3 py-2 rounded-lg transition duration-200 font-medium"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Grid Layout */}
      <main className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-8 flex-1">
        
        {/* Left Control Panel */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/20 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-6">
            {!user ? (
              <div>
                <div className="flex border-b border-slate-800 pb-4 mb-6 gap-4">
                  <button 
                    onClick={() => setAuthView('login')} 
                    className={`text-sm font-semibold transition ${authView === 'login' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setAuthView('signup')} 
                    className={`text-sm font-semibold transition ${authView === 'signup' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Create Account
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 tracking-wide uppercase mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition placeholder-slate-600" 
                      placeholder="you@domain.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 tracking-wide uppercase mb-1.5">Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition placeholder-slate-600" 
                      placeholder="••••••••"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition disabled:opacity-50"
                  >
                    {loading ? 'Processing Auth...' : authView === 'login' ? 'Access Console' : 'Register Core'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Settings Segment */}
                <div>
                  <h2 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-2 mb-3">SYSTEM ALIAS</h2>
                  <form onSubmit={handleUpdateProfile} className="flex gap-2">
                    <input 
                      type="text" 
                      value={usernameInput} 
                      onChange={(e) => setUsernameInput(e.target.value)} 
                      placeholder="set_alias"
                      maxLength={15}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button 
                      type="submit" 
                      disabled={updatingProfile}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] px-3 py-2 rounded-lg font-bold transition disabled:opacity-50"
                    >
                      Save
                    </button>
                  </form>
                </div>

                {/* Post Creator */}
                <div className="pt-4 border-t border-slate-800/80 space-y-4">
                  <h2 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">TRANSMIT DATAFEED</h2>
                  
                  <div>
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                      {['text', 'code', 'intel'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setPostType(type)}
                          className={`py-1 text-xs font-bold rounded-lg uppercase tracking-wider transition ${postType === type ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-slate-400 tracking-wide uppercase">Payload</label>
                      <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={aiLoading}
                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 disabled:opacity-40"
                      >
                        {aiLoading ? 'Synthesizing...' : 'AI Generate 🤖'}
                      </button>
                    </div>
                    <textarea 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder-slate-600 resize-none" 
                      placeholder={postType === 'code' ? '// Paste snippet here...' : 'Enter system transmission details...'}
                    />
                  </div>

                  <button 
                    onClick={handleCreatePost} 
                    disabled={loading || !content} 
                    className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-3 px-4 rounded-xl text-xs tracking-widest uppercase transition duration-200 disabled:opacity-40"
                  >
                    {loading ? 'Broadcasting...' : 'Broadcast Stream 🚀'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Dynamic Live Feed Panel */}
        <section className="lg:col-span-2 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-4">
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800 self-start">
              {['all', 'text', 'code', 'intel'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider transition ${
                    activeFilter === filter 
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700/50 shadow-inner' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800 self-start">
              Transmission Logs: {filteredFeed.length}
            </span>
          </div>
          
          {/* Posts Feed */}
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {filteredFeed.length === 0 ? (
              <div className="border border-dashed border-slate-800 p-12 text-center rounded-2xl text-slate-500 text-sm bg-slate-900/10">
                No telemetry signals matching active matrix coordinates.
              </div>
            ) : (
              filteredFeed.map((post) => {
                const userHasLiked = user && post.likes?.includes(user.id);
                const isOwner = user && post.user_id === user.id;
                // Gracefully grab custom profile name, fallback to raw user id
                const authorAlias = post.profiles?.username || 'user_' + post.user_id?.substring(0, 5);

                return (
                  <div key={post.id} className="bg-gradient-to-br from-slate-900/40 via-slate-900/20 to-transparent border border-slate-800/80 p-5 rounded-2xl hover:border-slate-700/60 hover:bg-slate-900/50 transition duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          post.post_type === 'code' ? 'bg-amber-950/40 text-amber-400 border-amber-800/40' : 
                          post.post_type === 'intel' ? 'bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-800/40' : 
                          'bg-cyan-950/40 text-cyan-400 border-cyan-800/40'
                        }`}>
                          {post.post_type}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {post.post_type === 'code' ? (
                        <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl overflow-x-auto text-xs font-mono text-cyan-300/95 leading-relaxed mb-2">
                          <code>{post.content}</code>
                        </pre>
                      ) : (
                        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900/60 flex justify-between items-center text-[10px] font-mono text-slate-600">
                      <div className="flex items-center gap-4">
                        <span>SYS_ID: #{post.id}</span>
                        <button 
                          onClick={() => handleLikePost(post.id, post.likes)}
                          className={`flex items-center gap-1.5 transition text-xs font-bold ${
                            userHasLiked ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <span>{userHasLiked ? '❤️' : '🤍'}</span>
                          <span>{post.likes?.length || 0}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold font-mono">@{authorAlias}</span>
                        {isOwner && (
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="text-rose-500 hover:text-rose-400 transition ml-2 text-xs font-bold"
                            title="Delete Log"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}