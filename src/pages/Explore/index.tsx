import { Button, Grid, Typography } from '@mui/material';
import { useExplore } from '../../context/books';
import MainLayout from '../../layout/mainLayout';

const Explore = () => {
    const { exploreBooks } = useExplore()
    return (
        <MainLayout>
            <Grid>
                <Typography variant="h4">Explore</Typography>
            </Grid>
            <Grid>
                {
                    exploreBooks.length > 0
                    ? (
                        <Grid>
                            {
                                exploreBooks.map((book) => (
                                    <Grid>
                                        <Typography>---------</Typography>
                                        <Typography variant='h6'>Name: {book.name}</Typography>
                                        <Typography variant='h6'>Author(s): {book.authors.join(', ')}</Typography>
                                        <Typography variant='h6'>Total price: ${book.unitPrice * book.length}</Typography>
                                        {/* TODO: Add onClick event handler */}
                                        <Button variant='outlined'>
                                            <Typography variant='h6'>
                                                Add to list
                                            </Typography>
                                        </Button>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    )
                    : (
                        <Grid>
                            <h3> No books to explore </h3>
                        </Grid>
                    )
                }
            </Grid>
        </MainLayout>
    )
}

export default Explore;
