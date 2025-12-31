import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Change this to a Promise
) {
  try {
    // 1. Await the params before using them (Next.js 15/16 Requirement)
    const { id } = await context.params;

    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    // Logic for expiry and views (keep your existing logic here, just ensure id is used correctly)
    // ... your view/expiry logic ...

    return NextResponse.json({
      title: paste.title,
      content: paste.content,
      remaining_views: paste.max_views ? paste.max_views - paste.current_views : null,
      expires_at: paste.expires_at,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}