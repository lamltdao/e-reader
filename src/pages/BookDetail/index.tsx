import { useParams } from 'react-router-dom';
import { useBook } from '../../context/books';
import MainLayout from '../../layout/mainLayout';
import { Worker, Viewer, PageChangeEvent, ScrollMode } from '@react-pdf-viewer/core'
import { Grid, Typography } from '@mui/material';


type PdfReaderProps = {
    url: string;
    updateReadStatus: (n: number) => void;
}
const PdfReader = ({url, updateReadStatus }: PdfReaderProps) => {
    const handlePageChange = (e: PageChangeEvent) => {
        updateReadStatus(e.currentPage)
    }
    return (
        <div style={{
            width: "70%",
            height: 400,
        }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">

                <Viewer
                    theme='dark'
                    fileUrl={url}
                    onPageChange={handlePageChange}
                    scrollMode={ScrollMode.Vertical}
                    />
            </Worker>
        </div>
    );
}

const BookDetail = () => {    
    const { bookId } = useParams()
    const { book, updateReadStatus } = useBook(bookId)
    const percentRead = book ? book.readStatus.reduce<number>((acc: number, cur: boolean) => {
        if (cur) {
            return acc+1
        }
        return acc
    }, 0) / book?.length * 100 : 0
    const progress = Math.round(percentRead)
    return (
        <MainLayout>
            {
                book
                ? (
                    <Grid
                        container
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <Typography variant='h6'>Name: {book.name}</Typography>
                        <Typography variant='h6'>Authors: {book.authors.join(', ')}</Typography>
                        <Typography variant='h6'>Progress: {progress}%</Typography>
                        <Typography variant='h6'>Price: {book.currentPrice}</Typography>
                        <Grid container alignItems="center" justifyContent="center">
                            <PdfReader url={book.url} updateReadStatus={updateReadStatus} />
                        </Grid>
                    </Grid>
                )
                : (
                    <Grid>
                        <Typography>No book</Typography>
                    </Grid>
                )
            }
        </MainLayout>
    )
}

export default BookDetail;
