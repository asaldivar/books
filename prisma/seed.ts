const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

const books = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publicationYear: 1960,
  },
  { id: "3", title: "1984", author: "George Orwell", publicationYear: 1949 },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publicationYear: 1813,
  },
  {
    id: "5",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publicationYear: 1951,
  },
  {
    id: "6",
    title: "Animal Farm",
    author: "George Orwell",
    publicationYear: 1945,
  },
  {
    id: "7",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publicationYear: 1937,
  },
];

async function main() {
  for (const book of books) {
    await prismaClient.book.create({
      data: {
        id: book.id,
        title: book.title,
        author: book.author,
        publicationYear: book.publicationYear,
      },
    });
    console.log(`Created book: ${book.title}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
