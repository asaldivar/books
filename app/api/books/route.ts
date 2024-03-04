import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get("limit") || 5;
  const id = req.nextUrl.searchParams.get("id");
  const createdAt = req.nextUrl.searchParams.get("created_at");

  try {
    const totalBooksCount = await db.book.count();

    const firstBook = await db.book.findFirst({
      orderBy: [{ createdAt: "asc" }],
    });

    const isFirstBook = firstBook?.id === id;

    const books = await db.book.findMany({
      take: Number(limit),
      cursor: id && createdAt ? { id, createdAt } : undefined,
      orderBy: [{ createdAt: "asc" }],
      skip: id && createdAt && !isFirstBook ? 1 : 0,
    });

    const isLast = books.length < Number(limit);

    return NextResponse.json({ books, totalBooksCount, isLast });
  } catch (err) {
    console.log("Could not GET books :>> ", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title, author, publicationYear } = await req.json();

  // Check if all required fields are provided
  if (!title || !author || !publicationYear) {
    return NextResponse.json(
      {
        error: "Title, author, and publication year are required",
      },
      { status: 400 }
    );
  }

  // Check if publicationYear is a valid year in the past
  const currentYear = new Date().getFullYear();
  if (isNaN(publicationYear) || publicationYear > currentYear) {
    return NextResponse.json(
      {
        error: "Publication year must be a valid year in the past",
      },
      { status: 400 }
    );
  }

  const book = await db.book.create({
    data: {
      title,
      author,
      publicationYear,
    },
  });

  return NextResponse.json(book);
}
