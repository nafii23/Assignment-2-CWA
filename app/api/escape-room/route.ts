import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all escape room outputs
export async function GET() {
  try {
    const outputs = await prisma.escapeRoomOutput.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(outputs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch outputs' },
      { status: 500 }
    );
  }
}

// POST - Create new escape room output
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, htmlContent, timeSpent, stagesCompleted } = body;

    if (!title || !htmlContent || timeSpent === undefined || stagesCompleted === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const output = await prisma.escapeRoomOutput.create({
      data: {
        title,
        htmlContent,
        timeSpent,
        stagesCompleted,
      },
    });

    return NextResponse.json(output, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create output' },
      { status: 500 }
    );
  }
}