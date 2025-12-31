import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content,title, ttl_seconds, max_views } = body;

    // 1. Validation: Content is required and must be a string
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // 2. Validate ttl_seconds (must be integer >= 1 if provided)
    let expiresAt: Date | null = null;
    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json({ error: "ttl_seconds must be an integer >= 1" }, { status: 400 });
      }
      // Calculate the future date
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    // 3. Validate max_views (must be integer >= 1 if provided)
    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json({ error: "max_views must be an integer >= 1" }, { status: 400 });
      }
    }

    // 4. Save to Neon Database
    const paste = await prisma.paste.create({
      data: {
        content,
title:title || null,
        max_views: max_views || null,
        expires_at: expiresAt,
      },
    });

    // 5. Generate the shareable URL
    const baseUrl = request.nextUrl.origin;
    return NextResponse.json({
      id: paste.id,
      url: `${baseUrl}/p/${paste.id}`,
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}