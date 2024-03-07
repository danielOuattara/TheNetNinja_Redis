"use server";

/* 

- store a book as a hash in redis db
- create a book id
- can be books:1, books:2, etc
- save new hash for the book

*/

import { client } from "@/lib/database";
import { redirect } from "next/navigation";

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData);

  const bookId = new Date().getTime().toString();

  // add the book to the sorted set
  const unique = await client.ZADD(
    "books",
    {
      value: title,
      score: bookId,
    },
    { NX: true },
  );

  if (unique === 0) {
    return {
      error: "Book already in database. Add another book",
    };
  }

  // save new hash for the book
  await client.HSET(`books:${bookId}`, {
    title,
    rating,
    author,
    blurb,
  });

  await client.disconnect();

  redirect("/");
}
