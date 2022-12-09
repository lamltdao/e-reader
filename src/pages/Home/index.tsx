import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBooks, Book, OwnedBook } from "../../context/books";
import MainLayout from "../../layout/mainLayout";

export const Home = () => {  
  const { books } = useBooks();
  const [curBooks, setCurBooks] = useState<(Book & OwnedBook)[]>([])

  useEffect(() => {
      setCurBooks(books)
  }, [books])
  return (
    <MainLayout>
      <Grid container>
        <Grid container alignItems="center" justifyContent="center">
          <Grid>
            <Typography variant="h4">
              Welcome to E-Reader. Here, you only pay for what you read
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid>
        <Typography variant="h4">Your books</Typography>
      </Grid>
      <br />
      <Grid container flexDirection="column">
        {
          curBooks.length > 0 ? (
            curBooks.map((book) => {
              const numPageRead = book.readStatus.reduce<number>((prev: number, cur: boolean) => {
                if (cur) {
                  return prev+1;
                }
                return prev;
              }, 0)
              const progress = Math.round(numPageRead / book.length * 100)
              return (
                <div key={book.id}>
                  <Grid item>
                    <Grid container flexDirection="row" rowSpacing={1} justifyContent="center" alignItems="start">
                      <Grid item xs={5}>
                        <Typography variant="h6">Name: {book.name}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6">Authors: {book.authors.join(', ')}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="h6">Progress: {progress}%</Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Link to={`/books/${book.id}`}>
                          <Typography>View book</Typography>
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                  <br/>
                </div>
              )
            })
          ) : (
            <Grid item>
              <Typography variant="h6">No book</Typography>
            </Grid>
          )
        }
      </Grid>
    </MainLayout>
  );
};
