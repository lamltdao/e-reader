import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, getFirestore, query } from 'firebase/firestore'
import { useFirebase } from "./firebase";
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
type Book = {
    id: string;
    name: string;
    length: number;
    url: string;
};

type OwnedBook = {
    readStatus: boolean[];
}

type BooksContextState = {
    books: (Book & OwnedBook)[];
};

const BooksContext = createContext<
    BooksContextState | undefined
>(undefined);

type BooksProviderProps = {
    children: ReactNode;
};

const BooksProvider = ({ children }: BooksProviderProps) => {
    const [books, setBooks] = useState<(Book & OwnedBook)[]>([])
    const { user } = useFirebase()
    const booksCollection = collection(getFirestore(), "books")
    useEffect(() => {
        if (user) {
            const ownedBooksCollection = collection(getFirestore(), "users", user.uid, "owned_books");
            const newBooks: (Book & OwnedBook)[] = []
            getDocs(query(
                ownedBooksCollection
            )).then(snap => {
                Promise.all(
                    snap.docs.map(async document => {
                        const book = {
                            id: document.id,
                            readStatus: document.data().readStatus,
                            name: "",
                            length: 0,
                            url: ""
                        }
                        const bookUrlRef = ref(getStorage(), `books/${document.id}.pdf`);
                        book.url = await getDownloadURL(bookUrlRef);
                        
                        const d = doc(booksCollection, document.id)
                        const bookInfo = await getDoc(d)
                        const { name, length } = bookInfo.data() as {
                            name: string;
                            length: number;
                        }
                        book.name = name
                        book.length = length
                        newBooks.push(book)
                    })
                ).then(() => {
                    setBooks(newBooks)
                })
            })
        }
    }, [])
    const value = {
        books,
    }
    return (
        <BooksContext.Provider
            value={value}
        >
            {children}
        </BooksContext.Provider>
    );
};

const useBooks = () => {
    const context = useContext(BooksContext);

    if (context === undefined) {
        throw new Error(
        "useBooks must be used within a BooksProvider"
        );
    }

    return context;
};

const useBook = (bookId: string | undefined) => {
    const { user } = useFirebase()
    const [book, setBook] = useState<Book & OwnedBook | null>(null)
    const booksCollection = collection(getFirestore(), "books")
    useEffect(() => {
        bookId && getDoc(doc(booksCollection, bookId))
            .then(bookDocument => {
                if (bookDocument.exists()) {
                    const { name, length, url } = bookDocument.data() as Book
                    const book: Book & OwnedBook = {
                        id: bookDocument.id,
                        name,
                        length,
                        readStatus: [],
                        url,
                    }
                    if (user?.uid) {
                        const ownedBooksCollection = collection(getFirestore(), "users", user.uid, "owned_books")
                        const ownedBooksRef = doc(ownedBooksCollection, book.id)
                        getDoc(ownedBooksRef)
                            .then(ownedBooksSnap => {
                                const ownedBooks = ownedBooksSnap.data() as OwnedBook
                                book.readStatus = ownedBooks.readStatus
                                setBook(book)
                            })
                    }
                }
            })
    })
    return book
}

export { BooksProvider, useBooks, useBook };
