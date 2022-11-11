import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useBook } from '../../context/books';
import MainLayout from '../../layout/mainLayout';
import { Worker, Viewer, PageChangeEvent } from '@react-pdf-viewer/core'


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
            width: "50%",
            height: 300
        }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">

                <Viewer
                    theme='dark'
                    fileUrl={url}
                    onPageChange={handlePageChange}
                    />
            </Worker>
        </div>
    );
}

const BookDetail = () => {    
    const { bookId } = useParams()
    const { book, updateReadStatus } = useBook(bookId)
    const progress = book ? Math.round(book.readStatus.reduce<number>((acc: number, cur: boolean) => {
        if (cur) {
            return acc+1
        }
        return acc
    }, 0) / book?.length * 100) : 0
    return (
        <MainLayout>
            {
                book
                ? (
                    <div>
                        <h2>Book Id: {book.id}</h2>
                        <h2>Book Name: {book.name}</h2>
                        <h2>Book Length: {book.length}</h2>
                        <h2>Progress: {progress}%</h2>
                        <PdfReader url={book.url} updateReadStatus={updateReadStatus} />
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
