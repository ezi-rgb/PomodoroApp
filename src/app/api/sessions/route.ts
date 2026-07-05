import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionSchema } from "@/lib/validations";

export async function GET() {
  try {
    const sessions = await prisma.pomodoroSession.findMany({
      orderBy: { startedAt: "desc" },
      take: 100,
      include: { task: true },
    });
    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const session = await prisma.pomodoroSession.create({
      data: {
        taskId: parsed.data.taskId,
        userId: "default",
        type: parsed.data.type,
        duration: parsed.data.duration,
        completed: parsed.data.completed,
        startedAt: new Date(parsed.data.startedAt),
        endedAt: parsed.data.endedAt ? new Date(parsed.data.endedAt) : null,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
