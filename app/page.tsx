'use client';

import { useState } from 'react';

type Tab = 'lyrics' | 'bible';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('lyrics');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">SlideGen</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'lyrics' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border border-gray-300 hover:border-gray-400'
              }`}
            >
              SLIDE GENERATOR
            </button>
            <button
              onClick={() => setActiveTab('bible')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'bible' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black border border-gray-300 hover:border-gray-400'
              }`}
            >
              BIBLE
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-20">
        <div className="text-center max-w-7xl">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-bold text-black mb-8 leading-none tracking-tight">
            SlideGen
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl text-gray-600 italic font-light">
            Generate slides from scripture
          </p>
        </div>
      </header>

      {/* Content Area */}
      <main className="min-h-screen bg-white px-8 py-24">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'lyrics' ? <LyricsGenerator /> : <BibleGenerator />}
        </div>
      </main>
    </div>
  );
}

function LyricsGenerator() {
  const [lyrics, setLyrics] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setDownloadUrl('');

    try {
      const response = await fetch('/api/generate-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics, title: title || 'Lyrics' }),
      });

      const data = await response.json();
      setDownloadUrl(data.downloadUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-0">
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 md:mb-16">Create from Lyrics</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-16">
        <div>
          <label className="block text-base md:text-lg text-gray-500 mb-3 md:mb-4 tracking-wider">
            TITLE
          </label>
          <input
            type="text"
            placeholder="Enter presentation title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-0 py-4 md:py-6 text-2xl md:text-4xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors bg-transparent placeholder:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-base md:text-lg text-gray-500 mb-3 md:mb-4 tracking-wider">
            LYRICS
          </label>
          <textarea
            placeholder="Paste your lyrics here..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={10}
            required
            className="w-full px-0 py-4 md:py-6 text-xl md:text-2xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors resize-none bg-transparent placeholder:text-gray-300"
          />
        </div>

        <div className="flex justify-center pt-4 md:pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-12 sm:px-16 md:px-20 py-6 sm:py-7 md:py-8 bg-white border-2 md:border-3 border-black text-black rounded-full font-bold hover:bg-black hover:text-white disabled:opacity-50 transition-all text-xl sm:text-2xl md:text-3xl shadow-lg"
          >
            {loading ? 'Generating...' : 'Generate Presentation'}
          </button>
        </div>
      </form>

      {downloadUrl && (
        <div className="mt-12 md:mt-20 p-8 md:p-12 bg-gray-50 rounded-3xl text-center">
          <p className="text-lg md:text-xl font-medium text-gray-500 mb-6 md:mb-8 tracking-wider">YOUR PRESENTATION IS READY</p>
          <a
            href={downloadUrl}
            download={`${title || 'Lyrics'}.pptx`}
            className="inline-block w-full sm:w-auto px-12 sm:px-16 md:px-20 py-6 sm:py-7 md:py-8 bg-white border-2 md:border-3 border-black text-black rounded-full font-bold hover:bg-black hover:text-white transition-all text-xl sm:text-2xl md:text-3xl shadow-lg"
          >
            Download PowerPoint
          </a>
        </div>
      )}
    </div>
  );
}

function BibleGenerator() {
  const [passage, setPassage] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [reference, setReference] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passage.trim()) return;

    setLoading(true);
    setDownloadUrl('');

    try {
      // Fetch verses from ESV API
      const esvResponse = await fetch(`/api/esv?passage=${encodeURIComponent(passage)}`);
      const esvData = await esvResponse.json();

      if (!esvData.success) {
        throw new Error('Failed to fetch passage');
      }

      const versesText = esvData.passages[0];
      const ref = esvData.reference;
      setReference(ref);

      // Generate PowerPoint
      const response = await fetch('/api/generate-bible-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verses: versesText, title: ref }),
      });

      const data = await response.json();
      setDownloadUrl(data.downloadUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-0">
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 md:mb-16">Create from Bible</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-16">
        <div>
          <label className="block text-base md:text-lg text-gray-500 mb-3 md:mb-4 tracking-wider">
            PASSAGE
          </label>
          <input
            type="text"
            placeholder="e.g., John 3:16-17, Psalm 23, Romans 8:28-39"
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
            className="w-full px-0 py-4 md:py-6 text-2xl md:text-4xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors bg-transparent placeholder:text-gray-300"
            required
          />
          <p className="mt-3 text-sm text-gray-500">
            Enter any Bible reference (e.g., &quot;John 3:16&quot;, &quot;Psalm 23&quot;, &quot;Romans 8:28-39&quot;)
          </p>
        </div>

        <div className="flex justify-center pt-4 md:pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-12 sm:px-16 md:px-20 py-6 sm:py-7 md:py-8 bg-white border-2 md:border-3 border-black text-black rounded-full font-bold hover:bg-black hover:text-white disabled:opacity-50 transition-all text-xl sm:text-2xl md:text-3xl shadow-lg"
          >
            {loading ? 'Generating...' : 'Generate Presentation'}
          </button>
        </div>
      </form>

      {downloadUrl && (
        <div className="mt-12 md:mt-20 p-8 md:p-12 bg-gray-50 rounded-3xl text-center">
          <p className="text-lg md:text-xl font-medium text-gray-500 mb-6 md:mb-8 tracking-wider">YOUR PRESENTATION IS READY</p>
          <p className="text-base text-gray-600 mb-6">{reference}</p>
          <a
            href={downloadUrl}
            download={`${reference}.pptx`}
            className="inline-block w-full sm:w-auto px-12 sm:px-16 md:px-20 py-6 sm:py-7 md:py-8 bg-white border-2 md:border-3 border-black text-black rounded-full font-bold hover:bg-black hover:text-white transition-all text-xl sm:text-2xl md:text-3xl shadow-lg"
          >
            Download PowerPoint
          </a>
        </div>
      )}
    </div>
  );
}
