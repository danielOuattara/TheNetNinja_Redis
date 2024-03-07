"use server";

/* 

- store a book as a hash in redis db
- create a book id
- can be books:1, books:2, etc
- save new hash for the book

*/

import { client } from "@/lib/database";
import { redirect } from "next/navigation";

export async function createBook(formData: FormData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData);

  const bookId = new Date().getTime().toString();

  await client.hSet(`books:${bookId}`, {
    title,
    rating,
    author,
    blurb,
  });

  redirect("/");
}
