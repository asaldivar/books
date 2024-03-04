export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [books, earliest, latest] = await db.$transaction([
      db.book.count(),
      db.book.findFirst({
        orderBy: { publicationYear: "asc" },
        select: { publicationYear: true },
      }),
      db.book.findFirst({
        orderBy: { publicationYear: "desc" },
        select: { publicationYear: true },
      }),
    ]);

    return NextResponse.json({
      books,
      earliestPublicationYear: earliest?.publicationYear,
      latestPublicationYear: latest?.publicationYear,
    });
  } catch (err) {
    console.log("Could not get books statistics :>> ", err);
    return NextResponse.json([], { status: 500 });
  }
}
