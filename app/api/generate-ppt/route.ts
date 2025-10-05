import { NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export async function POST(request: Request) {
  try {
    const { lyrics, title } = await request.json();
    
    if (!lyrics || !lyrics.trim()) {
      return NextResponse.json(
        { error: 'Please provide lyrics' },
        { status: 400 }
      );
    }

    // Split by empty lines to respect original grouping
    // This preserves the user's intended verse/chorus structure
    const groups = lyrics.split(/\n\s*\n/);
    
    const slidesContent: string[] = [];
    
    for (const group of groups) {
      // Process each group
      let lines = group.split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => {
          // Remove lines with brackets (section headers)
          if (line.startsWith('[') && line.endsWith(']')) return false;
          return line.length > 0;
        });

      // Special case: Split parentheses onto their own lines
      const processedLines: string[] = [];
      for (const line of lines) {
        const parenMatch = line.match(/^(.+?)\s*(\(.+?\))$/);
        if (parenMatch) {
          const mainText = parenMatch[1].trim();
          const parenText = parenMatch[2].trim();
          processedLines.push(mainText);
          processedLines.push(parenText);
        } else {
          processedLines.push(line);
        }
      }
      lines = processedLines;

      // Smart grouping within each group
      let i = 0;
      while (i < lines.length) {
        const remaining = lines.length - i;
        
        if (remaining === 1) {
          slidesContent.push(lines[i]);
          i += 1;
        } else if (remaining === 2) {
          slidesContent.push(lines.slice(i, i + 2).join('\n'));
          i += 2;
        } else if (remaining === 3) {
          slidesContent.push(lines.slice(i, i + 2).join('\n'));
          slidesContent.push(lines[i + 2]);
          i += 3;
        } else if (remaining >= 4) {
          slidesContent.push(lines.slice(i, i + 2).join('\n'));
          i += 2;
        }
      }
    }

    // Create PowerPoint
    const pptx = new PptxGenJS();
    
    // Add title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText(title, { 
      x: '10%',
      y: '30%',
      w: '80%',
      h: 2,
      fontSize: 36,
      bold: true,
      align: 'center',
      color: '2A5CAA',
      valign: 'middle'
    });
    
    // Optional subtitle can be added here if needed
    
    // Add lyrics slides
    slidesContent.forEach((content: string) => {
      const slide = pptx.addSlide();
      
      // Set black background
      slide.background = { color: '000000' };
      
      // Add all lines as a single text block, centered on the slide
      slide.addText(content, {
        x: 0.5,
        y: '25%',
        w: 9,
        h: '50%',
        fontSize: 44,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
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
