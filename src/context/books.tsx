import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc } from 'firebase/firestore'
import { useFirebase } from "./firebase";
import { getDownloadURL, getStorage, ref } from 'firebase/storage'

type Book = {
    id: string;
    name: string;
    length: number;
    url: string;
    unitPrice: number;
    authors: string[];
};

type OwnedBook = {
    readStatus: boolean[];
    currentPrice: number;
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

const getBookUrl = async (bookId: string) => {
    const bookUrlRef = ref(getStorage(), `books/${bookId}.pdf`);
    return await getDownloadURL(bookUrlRef);
}
const BooksProvider = ({ children }: BooksProviderProps) => {
    const [books, setBooks] = useState<(Book & OwnedBook)[]>([])
    const { user } = useFirebase()
    useEffect(() => {        
        if (user) {
            const ownedBooksCollection = collection(getFirestore(), "users", user.uid, "owned_books");
            const newBooks: (Book & OwnedBook)[] = []
            getDocs(query(
                ownedBooksCollection
            )).then(snap => {
                Promise.all(
                    snap.docs.map(async document => {
                        const docData = document.data() as OwnedBook
                        const book = {
                            id: document.id,
                            readStatus: docData.readStatus,
                            currentPrice: docData.currentPrice,
                            name: "",
                            length: 0,
                            url: "",
                            unitPrice: 0,
                            authors: [] as string[],
                        }
                        book.url = await getBookUrl(document.id);
                        const booksCollection = collection(getFirestore(), "books")
                        const d = doc(booksCollection, document.id)
                        const bookInfo = await getDoc(d)
                        const {
                            name,
                            length,
                            unitPrice,
                            authors,
                        } = bookInfo.data() as {
                            name: string;
                            length: number;
                            unitPrice: number;
                            authors: string[];
                        }
                        book.name = name
                        book.length = length
                        book.unitPrice = unitPrice
                        book.authors = authors
                        newBooks.push(book)
                    })
                ).then(() => {
                    setBooks(newBooks)
                })
            })
        }
    }, [user])
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

    const updateReadStatus = (pageIdx: number) => {
        setBook((prev) => {
            if (prev && user && book) {
                const prevReadStatus = prev.readStatus
                let prevCurrentPrice = prev.currentPrice
                if (!prevReadStatus[pageIdx]) {
                    prevReadStatus[pageIdx] = true
                    prevCurrentPrice += book.unitPrice
                }
                const ownedBooksCollection = collection(getFirestore(), "users", user.uid, "owned_books")
                setDoc(doc(ownedBooksCollection, prev.id), {
                    readStatus: prevReadStatus,
                    currentPrice: prevCurrentPrice,
                })
                return {
                    ...prev,
                    readStatus: prevReadStatus,
                    currentPrice: prevCurrentPrice,
                }
            }
            return prev
        })
    }
    useEffect(() => {
        const booksCollection = collection(getFirestore(), "books")
        bookId && getDoc(doc(booksCollection, bookId))
            .then(bookDocument => {
                if (bookDocument.exists()) {
                    const {
                        name,
                        length,
                        unitPrice,
                        authors,
                    } = bookDocument.data() as {
                        name: string;
                        length: number;
                        unitPrice: number;
                        authors: string[];
                    }
                    getBookUrl(bookDocument.id)
                    .then((url) => {
                        const book: Book & OwnedBook = {
                            id: bookDocument.id,
                            name,
                            length,
                            readStatus: [],
                            url,
                            unitPrice,
                            currentPrice: 0,
                            authors,
                        }
                        if (user?.uid) {
                            const ownedBooksCollection = collection(getFirestore(), "users", user.uid, "owned_books")
                            const ownedBooksRef = doc(ownedBooksCollection, book.id)
                            getDoc(ownedBooksRef)
                                .then(ownedBooksSnap => {
                                    const ownedBooks = ownedBooksSnap.data() as OwnedBook
                                    book.readStatus = ownedBooks.readStatus
                                    book.currentPrice = ownedBooks.currentPrice
                                    setBook(book)
                                })
                        }
                    })
                }
            })
    }, [bookId, user?.uid])
    return { book, updateReadStatus }
}

const useExplore = () => {
    const { user } = useFirebase()
    const [ownedBookIds, setOwnedBookIds] = useState<String[]>([])
    const [exploreBooks, setExploreBooks] = useState<Book[]>([])
    useEffect(() => {
        if (user && user.uid) {
            const ownedBooksCollection = collection(
                getFirestore(),
                "users",
                user.uid,
                "owned_books"
            )
            getDocs(query(ownedBooksCollection))
            .then((docs) => {
                const ids = docs.docs.map(d => d.id)
                setOwnedBookIds(ids)
            })
        }
    }, [user])
    useEffect(() => {
        const booksCollection = collection(getFirestore(), "books")
        const exploreList: Book[] = []
        getDocs(query(booksCollection))
            .then(bookDocuments => {
                Promise.all(
                    bookDocuments.docs.map(async (doc) => {
                        const id = doc.id
                        if (!ownedBookIds.includes(id)) {
                            const { name, length, unitPrice, authors } = doc.data() as {
                                name: string;
                                length: number;
                                unitPrice: number;
                                authors: string[];
                            }
                            const url = await getBookUrl(id)
                            const book: Book = {
                                id,
                                name,
                                length,
                                url,
                                unitPrice,
                                authors,
                            }
                            exploreList.push(book)
                        }
                    })
                )
                .then(() => {
                    setExploreBooks(exploreList)
                })
            })
    }, [ownedBookIds])
    return {
        exploreBooks
    }
}

export { BooksProvider, useBooks, useBook, useExplore };
