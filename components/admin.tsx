"use client";

import { useEffect, useState } from "react";
import { Book } from "@prisma/client";

import {
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { BookForm } from "@/components/book-form";
import { UpdateBookForm } from "./update-book-form";
import { ArrowUpRightFromSquare } from "lucide-react";

export function Admin() {
  const [searchValue, setSearchValue] = useState("");
  const [prevCursor, setPrevCursor] = useState<Book>();
  const [nextCursor, setNextCursor] = useState<Book>();
  const [isLastBook, setIsLastBook] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

  const fetchBooks = async (cursor: Book | undefined) => {
    try {
      const [firstBook] = books;
      setPrevCursor(firstBook);
      const url = cursor
        ? `/api/books?id=${cursor?.id}&created_at=${cursor?.createdAt}`
        : "/api/books";
      const response = await fetch(url);
      const {
        books: booksData,
        totalBooksCount,
        isLast,
      } = await response.json();
      setIsLastBook(isLast);
      setBooks(booksData);
      const [lastBook] = booksData.slice(-1);
      setNextCursor(lastBook);
      setTotalBooksCount(totalBooksCount);
    } catch (err) {
      console.log("Could not fetch books :>> ", err);
    }
  };

  useEffect(() => {
    fetchBooks(undefined);
  }, []);

  const handlePrevPage = () => {
    if (prevCursor) {
      fetchBooks(prevCursor);
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      fetchBooks(nextCursor);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const fetchBook = async () => {
    if (!searchValue) return fetchBooks(undefined);

    const response = await fetch(`/api/books/search?q=${searchValue}`);
    const { books, totalBooksCount } = await response.json();
    setBooks(books);
    setTotalBooksCount(totalBooksCount);
  };

  const handleSearch = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    fetchBook();
  };

  const deleteBook = async (id: string) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
      const { id: removedId } = await response.json();
      const updatedBooks = books.filter(({ id }) => id !== removedId);
      setBooks(updatedBooks);
    } catch (err) {
      console.log("Could not delete book :>> ", err);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manage Books</CardTitle>
            <CardDescription>View and manage the list of books</CardDescription>
          </div>
          <CardFooter>
            <Link
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              href="/statistics"
            >
              View Statistics
            </Link>
          </CardFooter>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Label className="sr-only" htmlFor="search">
                Search
              </Label>
              <SearchIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="flex-1 w-auto min-w-[200px] border-0 box-shadow-none"
                id="search"
                placeholder="Search by title or author..."
                type="search"
                value={searchValue}
                onChange={handleChange}
              />
              <Button className="h-9" onClick={handleSearch}>
                Search
              </Button>
            </div>
            <BookForm />
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-center">Year</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Boolean(books.length) &&
                  books.map(book => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.id}</TableCell>
                      <TableCell className="font-medium">
                        {book.title}
                      </TableCell>
                      <TableCell className="font-medium">
                        {book.author}
                      </TableCell>
                      <TableCell className="text-center">
                        {book.publicationYear}
                      </TableCell>
                      <TableCell className="flex justify-end text-right">
                        <Link href={`/book/${book.id}`}>
                          <Button size="icon" variant="ghost">
                            <ArrowUpRightFromSquare className="h-4 w-4" />
                            <span className="sr-only">Open</span>
                          </Button>
                        </Link>
                        <UpdateBookForm book={book} />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteBook(book.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-2 text-sm justify-end">
            <Button
              className="rounded-full"
              size="icon"
              variant="ghost"
              onClick={handlePrevPage}
              disabled={!prevCursor}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <span className="font-medium">
              1-{books.length} of {totalBooksCount}
            </span>
            <Button
              className="rounded-full"
              size="icon"
              variant="ghost"
              onClick={handleNextPage}
              disabled={!nextCursor || isLastBook}
            >
              <ChevronRightIcon className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function ChevronLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
