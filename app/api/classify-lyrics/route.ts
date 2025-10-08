import { NextResponse } from 'next/server';

async function loadClassifier() {
  const { classifyLines, initializeClassifier } = await import('../../../src/ai/classifier.js');
  return { classifyLines, initializeClassifier };
}

// Cache centroids globally to avoid recomputing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let centroidsCache: any = null;

export async function POST(request: Request) {
  try {
    const { lyrics } = await request.json();
    
    if (!lyrics || !lyrics.trim()) {
      return NextResponse.json(
        { error: 'Please provide lyrics' },
        { status: 400 }
      );
    }

    // Load classifier
    const { classifyLines, initializeClassifier } = await loadClassifier();
    
    // Initialize centroids (cached after first call)
    if (!centroidsCache) {
      console.log('Initializing AI classifier centroids...');
      centroidsCache = await initializeClassifier();
      console.log('Centroids initialized successfully');
    }

    // Split lyrics into lines
    const lines = lyrics.split('\n');
    
    // Classify all lines
    const results = await classifyLines(
      lines,
      centroidsCache!.headerCentroid,
      centroidsCache!.lyricCentroid
    );

    // Return classification results
    return NextResponse.json({
      success: true,
      results: results.map(r => ({
        text: r.text,
        type: r.type,
        confidence: r.confidence,
        method: r.method,
        isAmbiguous: r.isAmbiguous || false
      }))
    });
    
  } catch (error) {
    console.error('Error classifying lyrics:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to classify lyrics';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
