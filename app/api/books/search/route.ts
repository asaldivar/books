import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("q");

  if (!search)
    return NextResponse.json(
      { error: "Title and/or author is required" },
      { status: 400 }
    );

  try {
    const [books, totalBooksCount] = await db.$transaction([
      db.book.findMany({
        where: {
          OR: [
            { title: { contains: search } },
            { author: { contains: search } },
          ],
        },
      }),
      db.book.count({
        where: {
          OR: [
            { title: { contains: search } },
            { author: { contains: search } },
          ],
        },
      }),
    ]);

    return NextResponse.json({ books, totalBooksCount });
  } catch (err) {
    console.log("Could not GET books :>> ", err);
    return NextResponse.json([], { status: 500 });
  }
}
