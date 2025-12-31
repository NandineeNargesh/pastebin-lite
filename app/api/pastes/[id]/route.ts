import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { title } from 'process';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    // 1. Handle Deterministic Time for Testing
    const isTestMode = process.env.TEST_MODE === '1';
    const testTimeHeader = request.headers.get('x-test-now-ms');
    const now = (isTestMode && testTimeHeader) 
                ? new Date(parseInt(testTimeHeader)) 
                : new Date();

    // 2. Find the paste in the database
    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    // 3. Check if it exists
    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    // 4. Check if Expired (Time-based)
    if (paste.expires_at && now > paste.expires_at) {
      return NextResponse.json({ error: "Paste expired" }, { status: 404 });
    }

    // 5. Check if View Limit Exceeded
    if (paste.max_views !== null && paste.current_views >= paste.max_views) {
      return NextResponse.json({ error: "View limit reached" }, { status: 404 });
    }

    // 6. Update View Count (Increment)
    const updatedPaste = await prisma.paste.update({
      where: { id },
      data: { current_views: { increment: 1 } },
    });

    // 7. Success Response
    return NextResponse.json({
      title: updatedPaste.title,
      content: updatedPaste.content,
      remaining_views: updatedPaste.max_views 
        ? Math.max(0, updatedPaste.max_views - updatedPaste.current_views) 
        : null,
      expires_at: updatedPaste.expires_at?.toISOString() || null,
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}