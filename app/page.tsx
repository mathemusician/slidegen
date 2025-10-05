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
      <header className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-7xl">
          <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-black mb-12 leading-none tracking-tight">
            SlideGen
          </h1>
          <p className="text-3xl md:text-4xl lg:text-5xl text-gray-600 mb-20 max-w-5xl mx-auto leading-relaxed font-light">
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
    <div>
      <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-16">Create from Lyrics</h2>
      
      <form onSubmit={handleSubmit} className="space-y-16">
        <div>
          <label className="block text-lg text-gray-500 mb-4 tracking-wider">
            TITLE
          </label>
          <input
            type="text"
            placeholder="Enter presentation title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-0 py-6 text-4xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors bg-transparent placeholder:text-gray-300"
          />
        </div>

        <div>
          <label className="block text-lg text-gray-500 mb-4 tracking-wider">
            LYRICS
          </label>
          <textarea
            placeholder="Paste your lyrics here..."
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={12}
            required
            className="w-full px-0 py-6 text-2xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors resize-none bg-transparent placeholder:text-gray-300"
          />
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-16 py-6 bg-white border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white disabled:opacity-50 transition-all text-2xl"
          >
            {loading ? 'Generating...' : 'Generate Presentation'}
          </button>
        </div>
      </form>

      {downloadUrl && (
        <div className="mt-20 p-12 bg-gray-50 rounded-3xl text-center">
          <p className="text-xl font-medium text-gray-500 mb-8 tracking-wider">YOUR PRESENTATION IS READY</p>
          <a
            href={downloadUrl}
            download={`${title || 'Lyrics'}.pptx`}
            className="inline-block px-16 py-6 bg-white border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-all text-2xl"
          >
            Download PowerPoint
          </a>
        </div>
      )}
    </div>
  );
}

function BibleGenerator() {
  const [books, setBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [verseStart, setVerseStart] = useState('');
  const [verseEnd, setVerseEnd] = useState('');
  const [bibleData, setBibleData] = useState<BibleBook | null>(null);
  const [availableChapters, setAvailableChapters] = useState<number>(0);
  const [availableVerses, setAvailableVerses] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    fetch('/bible/Books.json')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Error loading books:', err));
  }, []);

  useEffect(() => {
    if (!selectedBook) return;
    
    const filename = selectedBook.replace(/ /g, '');
    fetch(`/bible/${filename}.json`)
      .then(res => res.json())
      .then((data: BibleBook) => {
        setBibleData(data);
        setAvailableChapters(data.chapters.length);
        setSelectedChapter('1');
        setVerseStart('1');
        setVerseEnd('');
      })
      .catch(err => console.error('Error loading book data:', err));
  }, [selectedBook]);

  useEffect(() => {
    if (!bibleData || !selectedChapter) return;
    
    const chapterData = bibleData.chapters.find(c => c.chapter === selectedChapter);
    if (chapterData) {
      setAvailableVerses(chapterData.verses.length);
      setVerseStart('1');
      setVerseEnd(chapterData.verses.length.toString());
    }
  }, [selectedChapter, bibleData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook || !selectedChapter || !verseStart) return;

    setLoading(true);
    setDownloadUrl('');

    const chapterData = bibleData?.chapters.find(c => c.chapter === selectedChapter);
    if (!chapterData) {
      setLoading(false);
      return;
    }

    const start = parseInt(verseStart);
    const end = verseEnd ? parseInt(verseEnd) : start;
    const selectedVerses = chapterData.verses
      .filter(v => {
        const verseNum = parseInt(v.verse);
        return verseNum >= start && verseNum <= end;
      })
      .map(v => `${v.text} (${selectedBook} ${selectedChapter}:${v.verse})`);

    const versesText = selectedVerses.join('\n');
    const title = `${selectedBook} ${selectedChapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ''}`;

    try {
      const response = await fetch('/api/generate-bible-ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verses: versesText, title }),
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
    <div>
      <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-16">Create from Bible</h2>
      
      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <label className="block text-lg text-gray-500 mb-4 tracking-wider">
              BOOK
            </label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full px-0 py-6 text-3xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors bg-transparent"
              required
            >
              <option value="">Select book</option>
              {books.map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg text-gray-500 mb-4 tracking-wider">
              CHAPTER
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full px-0 py-6 text-3xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors bg-transparent"
              disabled={!selectedBook}
              required
            >
              <option value="">Select chapter</option>
              {Array.from({ length: availableChapters }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <label className="block text-lg text-gray-500 mb-4 tracking-wider">
              VERSE START
            </label>
            <input
              type="number"
              value={verseStart}
              onChange={(e) => setVerseStart(e.target.value)}
              min="1"
              max={availableVerses}
              className="w-full px-0 py-6 text-3xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors bg-transparent"
              disabled={!selectedChapter}
              required
            />
          </div>

          <div>
            <label className="block text-lg text-gray-500 mb-4 tracking-wider">
              VERSE END
            </label>
            <input
              type="number"
              value={verseEnd}
              onChange={(e) => setVerseEnd(e.target.value)}
              min={verseStart || 1}
              max={availableVerses}
              placeholder="Optional"
              className="w-full px-0 py-6 text-3xl font-light border-0 border-b-2 border-gray-300 focus:border-black focus:ring-0 transition-colors bg-transparent placeholder:text-gray-300"
              disabled={!selectedChapter}
            />
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-16 py-6 bg-white border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white disabled:opacity-50 transition-all text-2xl"
          >
            {loading ? 'Generating...' : 'Generate Presentation'}
          </button>
        </div>
      </form>

      {downloadUrl && (
        <div className="mt-20 p-12 bg-gray-50 rounded-3xl text-center">
          <p className="text-xl font-medium text-gray-500 mb-8 tracking-wider">YOUR PRESENTATION IS READY</p>
          <a
            href={downloadUrl}
            download={`${selectedBook}_${selectedChapter}.pptx`}
            className="inline-block px-16 py-6 bg-white border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-all text-2xl"
          >
            Download PowerPoint
          </a>
        </div>
      )}
    </div>
  );
}
