import { Button, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useExplore, addBookToList, Book } from '../../context/books';
import { useFirebase } from '../../context/firebase';
import MainLayout from '../../layout/mainLayout';

const Explore = () => {
    const { exploreBooks, isLoading } = useExplore()
    const [curExploreBooks, setCurExploreBooks] = useState<Book[]>([])
    const { user } = useFirebase();

    useEffect(() => {
        setCurExploreBooks(exploreBooks)
    }, [exploreBooks])
    
    return (
        <MainLayout>
            <Grid>
                <Typography variant="h4">Explore</Typography>
            </Grid>
            <Grid
                container
                flexDirection="row"
                justifyContent="center"
            >
                {
                    isLoading ? (
                        <Grid>
                            <h3> Loading ... </h3>
                        </Grid>
                    ) : (
                        curExploreBooks.length > 0
                        ? (
                            <Grid>
                                {
                                    curExploreBooks.map((book) => (
                                        <ul key={book.id}>
                                            <li>
                                                <Grid container flexDirection="row">
                                                    <Grid item xs={3}>
                                                        <Typography variant='h5'>Name: {book.name}</Typography>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <Typography variant='h5'>Authors: {book.authors.join(', ')}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Typography variant='h5'>Total price: ${(book.unitPrice * book.length).toFixed(2)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <Button variant='outlined' onClick={() => {
                                                            if (user) {
                                                                addBookToList(user.uid, book.id, book.length)
                                                                .then(() => {
                                                                    setCurExploreBooks((prev) => {
                                                                        if (prev) {
                                                                            const newCurExploreBooks = prev.filter(b => b.id !== book.id)
                                                                            return newCurExploreBooks
                                                                        }
                                                                        return prev;
                                                                    })
                                                                })
                                                            }
                                                        }}>
                                                            <Typography variant='h6'>
                                                                Add to list
                                                            </Typography>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </li>
                                            <br />
                                        </ul>
                                    ))
                                }
                            </Grid>
                        )
                        : (
                            <Grid>
                                <h3> No books to explore </h3>
                            </Grid>
                        )
                    )
                }
            </Grid>
        </MainLayout>
    )
}

export default Explore;
