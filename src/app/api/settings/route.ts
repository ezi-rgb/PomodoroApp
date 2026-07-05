import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateSettingsSchema } from "@/lib/validations";

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId: "default" },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId: "default" },
      });
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const settings = await prisma.settings.upsert({
      where: { userId: "default" },
      update: parsed.data,
      create: { userId: "default", ...parsed.data },
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
