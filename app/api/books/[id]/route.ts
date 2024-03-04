import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id)
    return NextResponse.json({ error: "Id is required" }, { status: 400 });

  try {
    const book = await db.book.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json(book);
  } catch (err) {
    console.log("Could not GET book :>> ", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id)
    return NextResponse.json({ error: "Id is required" }, { status: 400 });

  const { title, author, publicationYear } = await req.json();

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

  try {
    const updatedBook = await db.book.update({
      where: { id },
      data: { title, author, publicationYear },
    });

    return NextResponse.json(updatedBook);
  } catch (err) {
    console.log("Could not update book :>> ", err);
    return NextResponse.json(
      { error: "Could not update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id)
    return NextResponse.json({ error: "Id is required" }, { status: 400 });

  try {
    const deletedBook = await db.book.delete({
      where: { id },
    });

    return NextResponse.json(deletedBook);
  } catch (err) {
    console.log("Error :>> ", err);
  }
}
