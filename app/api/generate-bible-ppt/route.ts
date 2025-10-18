import { NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export async function POST(request: Request) {
  try {
    const { verses, title, background, textColor, fontFamily } = await request.json();
    
    if (!verses || !verses.trim()) {
      return NextResponse.json(
        { error: 'Please provide verses' },
        { status: 400 }
      );
    }

    // Split verses - each verse becomes a slide
    // ESV API returns verses with [verse number] format
    // We'll split by verse numbers to create individual slides
    const versePattern = /\[(\d+)\]\s*/g;
    const verseParts = verses.split(versePattern).filter((part: string) => part.trim().length > 0);
    
    const individualVerses: { text: string; verseNum: string }[] = [];
    for (let i = 0; i < verseParts.length; i += 2) {
      if (i + 1 < verseParts.length) {
        const verseNum = verseParts[i];
        const verseText = verseParts[i + 1].trim();
        individualVerses.push({ text: verseText, verseNum: verseNum });
      }
    }
    
    // If no verse numbers found, split by newlines as fallback
    const lines = individualVerses.length > 0 
      ? individualVerses 
      : verses.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length > 0).map((line: string) => ({ text: line, verseNum: '' }));

    // Create PowerPoint
    const pptx = new PptxGenJS();
    
    // Set slide size to standard 16:9
    pptx.layout = 'LAYOUT_16x9';
    
    // Add title slide with user's selected styling
    const titleSlide = pptx.addSlide();
    
    // Use same background as verse slides
    if (background && background.type === 'image' && background.value) {
      titleSlide.background = { data: background.value };
    } else if (background && background.type === 'color' && background.value) {
      titleSlide.background = { color: background.value };
    } else {
      titleSlide.background = { color: '000000' };
    }
    
    // Display reference with user's text color - centered and prominent
    titleSlide.addText(title, { 
      x: '5%',
      y: '40%',
      w: '90%',
      h: '20%',
      fontSize: 64,
      bold: true,
      align: 'center',
      color: textColor || 'FFFFFF',
      valign: 'middle',
      fontFace: fontFamily || 'Calibri'
    });
    
    // Add verse slides
    lines.forEach((verse: { text: string; verseNum: string } | string) => {
      const slide = pptx.addSlide();
      
      // Handle both old format (string) and new format (object)
      const verseText = typeof verse === 'string' ? verse : verse.text;
      const verseNum = typeof verse === 'string' ? '' : verse.verseNum;
      
      // Set background from user preference
      if (background && background.type === 'image' && background.value) {
        // For image backgrounds, use the base64 data
        // Frontend will crop to 16:9 to prevent stretching
        slide.background = { data: background.value };
      } else if (background && background.type === 'color' && background.value) {
        // For color backgrounds, use the hex value
        slide.background = { color: background.value };
      } else {
        // Default to black background
        slide.background = { color: '000000' };
      }
      
      // Add verse text - centered and large
      slide.addText(verseText, {
        x: 0.5,
        y: '30%',
        w: 9,
        h: '40%',
        fontSize: 36,
        bold: false,
        color: textColor || 'FFFFFF',
        align: 'center',
        valign: 'middle',
        fontFace: fontFamily || 'Calibri'
      });
      
      // Add verse number reference at bottom-right (if available)
      if (verseNum) {
        slide.addText(`v. ${verseNum}`, {
          x: 8.5,
          y: 5,
          w: 1,
          h: 0.3,
          fontSize: 14,
          bold: false,
          color: textColor || 'FFFFFF',
          align: 'right',
          valign: 'bottom',
          fontFace: fontFamily || 'Calibri'
        });
      }
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
    
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate presentation. Please try again.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
