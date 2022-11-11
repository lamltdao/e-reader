import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useBook } from '../../context/books';
import MainLayout from '../../layout/mainLayout';
import { Document, Page } from 'react-pdf';

// const PdfReader = () => {
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);

//     function onDocumentLoadSuccess(pdf: ) {
//         const { numPages } = pdf
//         setNumPages(numPages);
//     }

//     return (
//         <div>
//         <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
//             <Page pageNumber={pageNumber} />
//         </Document>
//         <p>
//             Page {pageNumber} of {numPages}
//         </p>
//         </div>
//     );
// }

const BookDetail = () => {
    const { bookId } = useParams()
    const currentBook = useBook(bookId)
    const progress = currentBook ? Math.round(currentBook.readStatus.reduce<number>((acc: number, cur: boolean) => {
        if (cur) {
            return acc+1
        }
        return acc
    }, 0) / currentBook?.length * 100) : 0
    return (
        <MainLayout>
            {
                currentBook
                ? (
                    <div>
                        <h2>Book Id: {currentBook.id}</h2>
                        <h2>Book Name: {currentBook.name}</h2>
                        <h2>Book Length: {currentBook.length}</h2>
                        <h2>Progress: {progress}%</h2>
                    </div>
                )
                : (
                    <div>
                        <h2>No book</h2>
                    </div>
                )
            }
        </MainLayout>
    )
}

export default BookDetail;
