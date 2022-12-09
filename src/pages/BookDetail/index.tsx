import { useParams } from 'react-router-dom';
import { useBook } from '../../context/books';
import MainLayout from '../../layout/mainLayout';
import { Worker, Viewer, PageChangeEvent, ScrollMode } from '@react-pdf-viewer/core'
import { Grid, Typography } from '@mui/material';
import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

// Import styles
import '@react-pdf-viewer/toolbar/lib/styles/index.css';


type PdfReaderProps = {
    url: string;
    updateReadStatus: (n: number) => void;
}
const PdfReader = ({url, updateReadStatus }: PdfReaderProps) => {
    const handlePageChange = (e: PageChangeEvent) => {
        updateReadStatus(e.currentPage)
    }

    const bookmarkPluginInstance = bookmarkPlugin();
    const toolbarPluginInstance = toolbarPlugin();
    const { Bookmarks } = bookmarkPluginInstance;
    const { Toolbar } = toolbarPluginInstance;
    return (
        <Grid container flexDirection="row">
            <Grid item xs={4}>
                <Bookmarks />
            </Grid>
            <Grid item xs={8}>
                <div style={{
                    height: '800px',
                    border: '5px solid rgba(0, 0, 0, 0.3)',
                }}>
                    <Toolbar />
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                        <Viewer
                            theme='dark'
                            fileUrl={url}
                            onPageChange={handlePageChange}
                            scrollMode={ScrollMode.Vertical}
                            plugins={[bookmarkPluginInstance, toolbarPluginInstance]}
                            />
                    </Worker>
                </div>
            </Grid>
        </Grid>
    );
}

const BookDetail = () => {    
    const { bookId } = useParams()
    const { book, updateReadStatus, isLoading } = useBook(bookId)
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
                isLoading ? (
                    <Grid>
                        <Typography>Loading...</Typography>
                    </Grid>
                ) : (
                    book
                    ? (
                        <Grid
                            container
                            flexDirection="row"
                            justifyContent="center"
                        >
                            <Grid item xs={6}>
                                <Typography variant='h6'>Name: {book.name}</Typography>
                                <Typography variant='h6'>Authors: {book.authors.join(', ')}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Price: ${book.currentPrice.toFixed(2)}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='h6'>Progress: {progress}%</Typography>
                            </Grid>
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
                )

            }
        </MainLayout>
    )
}

export default BookDetail;
