"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title, ttl_seconds: ttl ? parseInt(ttl) : undefined, max_views: maxViews ? parseInt(maxViews) : undefined }),
      });
      const data = await res.json();
      if (res.ok) setUrl(data.url);
      else alert(data.error);
    } catch (err) {
      alert("Error: Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-[#521991] flex flex-col md:flex-row font-sans text-white overflow-hidden">
      
      {/* LEFT SIDE: Branding */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-transparent">
        <h1 className="text-5xl font-black tracking-tight uppercase mb-4">PASTEbin lite</h1>
        <p className="text-lg leading-relaxed mb-4 text-purple-200 max-w-md font-medium">
          Create self-destructing notes and code snippets. Set your view limits and expiry times to keep your data private.
        </p>
        <p className="text-sm font-bold italic text-white/50 tracking-wide">Secure. Fast. Vibrant.</p>
      </div>

      {/* RIGHT SIDE: Form Area */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-transparent">
        <div className="w-full max-w-xl flex flex-col justify-center">
          <div className="mb-6">
             <span className="text-purple-300 font-bold text-xs tracking-widest uppercase italic">Create New Paste</span>
             <h2 className="text-3xl font-bold text-white mt-1">What's the secret?</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Title Block */}
            <div className="bg-[#3e1270] p-4 rounded-lg shadow-2xl">
              <label className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1 block">Paste Title</label>
              <input 
                type="text" 
                placeholder="Ex: API Config or Secret Sauce"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-md text-white outline-none focus:bg-white/10 text-sm transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Content Block */}
            <div className="bg-[#3e1270] p-4 rounded-lg shadow-2xl">
              <label className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1 block">Code / Text Content</label>
              <textarea
                required
                className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-md text-white outline-none focus:bg-white/10 resize-none font-mono text-sm"
                placeholder="Paste your sensitive data here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Configuration Block */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#3e1270] p-4 rounded-lg border border-white/5">
                  <label className="text-white/50 text-[10px] font-bold uppercase mb-1 block text-center">Expiry (Sec)</label>
                  <input 
                    type="number" 
                    placeholder="3600"
                    className="w-full bg-transparent border-b border-white/20 p-1 text-white outline-none focus:border-[#ffcc00] text-center text-sm" 
                    value={ttl} 
                    onChange={(e) => setTtl(e.target.value)} 
                  />
               </div>
               <div className="bg-[#3e1270] p-4 rounded-lg border border-white/5">
                  <label className="text-white/50 text-[10px] font-bold uppercase mb-1 block text-center">Max Views</label>
                  <input 
                    type="number" 
                    placeholder="1"
                    className="w-full bg-transparent border-b border-white/20 p-1 text-white outline-none focus:border-[#ffcc00] text-center text-sm" 
                    value={maxViews} 
                    onChange={(e) => setMaxViews(e.target.value)} 
                  />
               </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ffcc00] hover:bg-[#e6b800] text-[#521991] font-black py-3 px-12 rounded-md transition-all uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 text-sm"
              >
                {loading ? "Generating..." : "Generate Link →"}
              </button>
            </div>
          </form>

          {/* Result Block */}
          {url && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 animate-in fade-in zoom-in duration-300">
              <p className="text-[10px] font-black text-[#ffcc00] mb-2 tracking-[0.2em] uppercase text-center">Your Secure URL:</p>
              <div className="flex gap-2">
                <input readOnly value={url} className="w-full bg-black/20 p-2 rounded text-[10px] text-purple-200 font-mono border border-white/5" />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }} 
                  className={`${copied ? "bg-[#ffcc00] text-[#521991]" : "bg-white text-[#521991]"} px-4 py-2 rounded text-[10px] font-black uppercase transition-colors`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}