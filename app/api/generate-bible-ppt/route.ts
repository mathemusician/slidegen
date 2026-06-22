import { NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

const CHURCH_BG_PATH = path.join(process.cwd(), 'public/backgrounds/church-bible-default.jpg');

type ResolvedBackground =
  | { type: 'image'; data: string; isChurchPreset: boolean }
  | { type: 'color'; color: string; isChurchPreset: boolean };

function loadChurchBackground(): ResolvedBackground {
  const buffer = fs.readFileSync(CHURCH_BG_PATH);
  return {
    type: 'image',
    data: `image/jpeg;base64,${buffer.toString('base64')}`,
    isChurchPreset: true,
  };
}

function resolveBackground(
  background?: { type?: string; value?: string }
): ResolvedBackground {
  if (background?.type === 'preset' && background.value === 'church-bible') {
    return loadChurchBackground();
  }
  if (background?.type === 'image' && background.value) {
    return { type: 'image', data: background.value, isChurchPreset: false };
  }
  if (background?.type === 'color' && background.value) {
    return { type: 'color', color: background.value, isChurchPreset: false };
  }
  // Church bible background is the default for scripture slides
  return loadChurchBackground();
}

function applySlideBackground(
  slide: ReturnType<PptxGenJS['addSlide']>,
  resolved: ResolvedBackground
) {
  if (resolved.type === 'image') {
    slide.background = { data: resolved.data };
  } else {
    slide.background = { color: resolved.color };
  }
}

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
    // After split with a capture group, the array alternates:
    // [prefixText?, capturedNum, verseText, capturedNum, verseText, ...]
    // If the text has a superscription before the first [number] marker
    // (common in Psalms), the first element is non-numeric prefix text.
    let startIndex = 0;
    let superscription = '';
    if (verseParts.length > 0 && !/^\d+$/.test(verseParts[0])) {
      superscription = verseParts[0].trim();
      startIndex = 1;
    }
    for (let i = startIndex; i < verseParts.length; i += 2) {
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

    const resolvedBg = resolveBackground(background);
    const color = textColor || 'FFFFFF';
    const font = fontFamily || 'Calibri';

    // Create PowerPoint
    const pptx = new PptxGenJS();
    
    // Set slide size to standard 16:9
    pptx.layout = 'LAYOUT_16x9';
    
    // Add title slide with user's selected styling
    const titleSlide = pptx.addSlide();
    applySlideBackground(titleSlide, resolvedBg);
    
    // Display reference in the upper two-thirds (above the bible image)
    titleSlide.addText(title, { 
      x: '5%',
      y: resolvedBg.isChurchPreset ? (superscription ? '18%' : '28%') : (superscription ? '30%' : '40%'),
      w: '90%',
      h: resolvedBg.isChurchPreset ? '18%' : '20%',
      fontSize: resolvedBg.isChurchPreset ? 48 : 64,
      bold: true,
      align: 'center',
      color,
      valign: 'middle',
      fontFace: font
    });
    
    // If there's a superscription (common in Psalms), show it below the title
    if (superscription) {
      titleSlide.addText(superscription, {
        x: '10%',
        y: resolvedBg.isChurchPreset ? '38%' : '55%',
        w: '80%',
        h: '12%',
        fontSize: 24,
        italic: true,
        bold: false,
        align: 'center',
        color,
        valign: 'top',
        fontFace: font
      });
    }
    
    // Add verse slides
    lines.forEach((verse: { text: string; verseNum: string } | string) => {
      const slide = pptx.addSlide();
      
      // Handle both old format (string) and new format (object)
      const verseText = typeof verse === 'string' ? verse : verse.text;
      const verseNum = typeof verse === 'string' ? '' : verse.verseNum;
      
      applySlideBackground(slide, resolvedBg);
      
      if (resolvedBg.isChurchPreset) {
        // Passage reference at top; verse uses most of slide above the compact bible image
        slide.addText(title, {
          x: '5%',
          y: '5%',
          w: '90%',
          h: '8%',
          fontSize: 26,
          bold: true,
          align: 'center',
          color,
          valign: 'top',
          fontFace: font
        });

        slide.addText(verseText, {
          x: '7%',
          y: '13%',
          w: '86%',
          h: '46%',
          fontSize: 36,
          bold: false,
          color,
          align: 'center',
          valign: 'middle',
          fontFace: font
        });
      } else {
        // Standard layout for solid colors / custom uploads
        slide.addText(verseText, {
          x: 0.5,
          y: '30%',
          w: 9,
          h: '40%',
          fontSize: 36,
          bold: false,
          color,
          align: 'center',
          valign: 'middle',
          fontFace: font
        });
        
        if (verseNum) {
          slide.addText(`v. ${verseNum}`, {
            x: 8.5,
            y: 5,
            w: 1,
            h: 0.3,
            fontSize: 14,
            bold: false,
            color,
            align: 'right',
            valign: 'bottom',
            fontFace: font
          });
        }
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
