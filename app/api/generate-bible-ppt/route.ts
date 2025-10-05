import { NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export async function POST(request: Request) {
  try {
    const { verses, title } = await request.json();
    
    if (!verses || !verses.trim()) {
      return NextResponse.json(
        { error: 'Please provide verses' },
        { status: 400 }
      );
    }

    // Split verses by lines - each line becomes a slide
    const lines = verses.split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    // Create PowerPoint
    const pptx = new PptxGenJS();
    
    // Set slide size to standard 16:9
    pptx.layout = 'LAYOUT_16x9';
    
    // Add title slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: '2C3E50' };
    
    titleSlide.addText(title, { 
      x: '10%',
      y: '35%',
      w: '80%',
      h: 2,
      fontSize: 48,
      bold: true,
      align: 'center',
      color: 'FFFFFF',
      valign: 'middle'
    });
    
    // Add subtitle
    titleSlide.addText('Bible Verses', {
      x: '10%',
      y: '50%',
      w: '80%',
      h: 1,
      fontSize: 24,
      align: 'center',
      color: 'ECF0F1',
    });
    
    // Add verse slides
    lines.forEach((verse: string) => {
      const slide = pptx.addSlide();
      
      // Set black background
      slide.background = { color: '000000' };
      
      // Add verse text - centered and large with white text
      slide.addText(verse, {
        x: 0.5,
        y: '30%',
        w: 9,
        h: '40%',
        fontSize: 36,
        bold: false,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
        fontFace: 'Georgia'
      });
    });
    
    // Generate the PowerPoint file
    const pptxBuffer = await pptx.write({
      compression: true,
      outputType: 'nodebuffer',
    }) as Buffer;
    
    // Convert to base64 for sending to the client
    const base64Data = pptxBuffer.toString('base64');
    
    return NextResponse.json({
      success: true,
      downloadUrl: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64Data}`
    });
    
  } catch (error: any) {
    console.error('Error generating PowerPoint:', error);
    
    const errorMessage = error.message || 'Failed to generate presentation. Please try again.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
