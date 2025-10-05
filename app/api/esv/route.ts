import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passage = searchParams.get('passage');

  if (!passage) {
    return NextResponse.json(
      { error: 'Passage parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.ESV_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ESV API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(passage)}&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=false`,
      {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('ESV API request failed');
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      passages: data.passages,
      reference: data.canonical,
    });
  } catch (error) {
    console.error('Error fetching ESV passage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch passage from ESV API' },
      { status: 500 }
    );
  }
}
