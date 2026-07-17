'use client';

import { useState, useEffect } from 'react';
import CopyButton from '../components/CopyButton';
import { supabase } from '../utils/supabase';

interface FeedItem {
  id: string;
  content: string;
  created_at: string;
}

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);

  // Fetch network feed database entries from Supabase on load
  useEffect(() => {
    async function fetchFeed() {
      try {
        const { data, error } = await supabase
          .from('feed') 
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (!error && data) {
          setFeed(data);
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    }
    fetchFeed();
  }, []);

  // Handle the AI Terminal call
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput('Establishing quantum uplink connection...');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setOutput(data.text);
      } else {
        setOutput(`Uplink Error: ${data.error || 'Connection timed out.'}`);
      }
    } catch (err: any) {
      setOutput(`System Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-6 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-green-900 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-green-400">PULSE NETWORK</h1>
          <p className="text-xs text-green-600">NEURO-OS TERMINAL CONSOLE</p>
        </div>
        <div className="text-right">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping mr-2"></span>
          <span className="text-xs text-green-400 font-bold">UPLINK STATUS: ACTIVE</span>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
        {/* Left: Feed Column */}
        <div className="md:col-span-2 border border-green-900 bg-black/40 p-4 rounded flex flex-col">
          <h2 className="text-sm font-bold uppercase text-green-400 mb-4 border-b border-green-900 pb-2">
            System Broadcast Feed
          </h2>
          <div className="flex-grow space-y-4 overflow-y-auto max-h-[400px] pr-2">
            {feed.length === 0 ? (
              <div className="border-l-2 border-green-900 pl-3 py-1">
                <p className="text-xs text-green-700 italic">No network broadcasts detected. Standing by...</p>
                <span className="text-[10px] text-green-800">00:00:00</span>
              </div>
            ) : (
              feed.map((item) => (
                <div key={item.id} className="border-l-2 border-green-700 pl-3 py-1">
                  <p className="text-xs text-green-300">{item.content}</p>
                  <span className="text-[10px] text-green-700">
                    {new Date(item.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: AI Console Column */}
        <div className="border border-green-900 bg-black/40 p-4 rounded flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase text-green-400 mb-4 border-b border-green-900 pb-2">
              AI Terminal Assistant
            </h2>
            
            {/* AI Output Terminal Screen */}
            <div className="bg-black border border-green-950 p-3 rounded h-48 overflow-y-auto mb-4 text-xs text-green-300 relative">
              {output || "Awaiting neural terminal instructions..."}
              {output && (
                <div className="absolute top-2 right-2">
                  <CopyButton text={output} />
                </div>
              )}
            </div>
          </div>

          {/* Prompt Entry & Execution */}
          <div className="space-y-3">
            <textarea
              className="w-full bg-black border border-green-850 text-green-400 p-2 rounded text-xs focus:outline-none focus:border-green-400 resize-none h-20 placeholder-green-800"
              placeholder="Enter instructions for terminal synthesis..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-green-950 hover:bg-green-800 text-green-100 py-2 rounded text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
            >
              {loading ? 'Synthesizing...' : 'AI Generate 🤖'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-green-900 mt-6 pt-4 text-center">
        <p className="text-[10px] text-green-800">
          SECURE DECRYPT PROTOCOL // CODENAME: PULSE // ALL RIGHTS PRIVILEGED.
        </p>
      </footer>
    </div>
  );
}