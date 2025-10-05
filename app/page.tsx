'use client';

import { useState, useEffect } from 'react';

type Tab = 'lyrics' | 'bible';

interface BibleBook {
  book: string;
  chapters: {
    chapter: string;
    verses: { verse: string; text: string; }[];
  }[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('lyrics');

  return (
    <div className="min-h-screen bg-white">
      {/* Logo */}
      <div className="fixed top-8 left-8 z-50">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 right-0 p-8 z-50">
        <div className="flex gap-8 items-center">
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`text-lg font-medium transition-colors ${
              activeTab === 'lyrics' ? 'text-black' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Lyrics
          </button>
          <button
            onClick={() => setActiveTab('bible')}
            className={`text-lg font-medium transition-colors ${
              activeTab === 'bible' ? 'text-black' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Bible
          </button>
          <button
            onClick={() => {
              document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all text-base shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center px-4 md:px-8">
        <div className="text-center max-w-7xl">
          <h1 className="text-6xl sm:text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-black mb-8 md:mb-12 leading-none tracking-tight">
            SlideGen
          </h1>
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-gray-600 mb-12 md:mb-20 max-w-5xl mx-auto leading-relaxed font-light px-4">
            Transform lyrics and Bible verses into beautiful presentations
          </p>
        </div>
      </header>

      {/* Content Area */}
      <main id="content" className="min-h-screen bg-white px-8 py-24">
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
            Enter any Bible reference (e.g., "John 3:16", "Psalm 23", "Romans 8:28-39")
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
