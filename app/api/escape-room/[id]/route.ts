import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch single escape room output by ID
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const output = await prisma.escapeRoomOutput.findUnique({
      where: { id: params.id },
    });

    if (!output) {
      return NextResponse.json({ error: 'Output not found' }, { status: 404 });
    }

    return NextResponse.json(output);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch output' }, { status: 500 });
  }
}

// PUT - Update escape room output
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const body = await request.json();
    const { title, htmlContent, timeSpent, stagesCompleted } = body;

    const output = await prisma.escapeRoomOutput.update({
      where: { id: params.id },
      data: { title, htmlContent, timeSpent, stagesCompleted },
    });

    return NextResponse.json(output);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update output' }, { status: 500 });
  }
}

// DELETE - Delete escape room output
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await prisma.escapeRoomOutput.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Output deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete output' }, { status: 500 });
  }
}