"use client";

import React, { useEffect, useState } from "react";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Book } from "@prisma/client";

export default function BookPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [book, setBook] = useState<Book>();

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${id}`);
      const data = await response.json();
      setBook(data);
    } catch (err) {
      console.log("Could net get book data :>> ", err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  if (!book) return <p className="text-lg text-gray-500">No book found.</p>;

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-base">{book.title}</CardTitle>
          <CardDescription>By {book.author}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <CardDescription>Published in {book.publicationYear}</CardDescription>
      </CardFooter>
    </Card>
  );
}
