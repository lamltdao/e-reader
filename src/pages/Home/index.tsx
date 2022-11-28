import { Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../../context/books";
import MainLayout from "../../layout/mainLayout";

export const Home = () => {  
  const { books } = useBooks();
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
        <Typography variant="h5">Your books</Typography>
      </Grid>
      <br />
      <Grid container>
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
              <Grid item key={book.id}>
                <Link to={`/books/${book.id}`}>
                  <Typography variant="body1">Name: {book.name}</Typography>
                  <Typography variant="body1">Progress: {progress}%</Typography>
                </Link>
              </Grid>
            )
          })
        }
      </Grid>
    </MainLayout>
  );
};
