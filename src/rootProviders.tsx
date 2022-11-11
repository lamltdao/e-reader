import React from "react";
import { BrowserRouter } from "react-router-dom";
import { FirebaseProvider } from "./context/firebase";
import { AuthenticationProvider } from "./context/authentication";
import { BooksProvider } from "./context/books";

type RootProviderProps = {
  children: React.ReactNode;
};

export const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <AuthenticationProvider>
          <BooksProvider>
            {children}
          </BooksProvider>
        </AuthenticationProvider>
      </FirebaseProvider>
    </BrowserRouter>
  );
};
