import React from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../../context/books";
import MainLayout from "../../layout/mainLayout";

export const Home = () => {
  const { books } = useBooks();
  return (
    <MainLayout>
      <div>
        <h1>Your books</h1>
      </div>
      <div>
        {
          books.map((book) => {
            const numPageRead = book.readStatus.reduce<number>((prev: number, cur: boolean) => {
              if (cur) {
                return prev+1;
              }
              return prev;
            }, 0)
            const progress = Math.round(numPageRead / book.length * 100)
            return (
              <div key={book.id}>
                <Link to={`/books/${book.id}`}>
                  <h5>Name: {book.name}</h5>
                  <h5>Progress: {progress}%</h5>
                </Link>
              </div>
            )
          })
        }
      </div>
    </MainLayout>
  );
};
