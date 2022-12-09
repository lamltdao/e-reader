import React from "react";
import { BrowserRouter } from "react-router-dom";
import { FirebaseProvider } from "./context/firebase";
import { AuthenticationProvider } from "./context/authentication";
import { BooksProvider } from "./context/books";
import { ThemeProvider } from "@mui/system";
import { theme } from './context/theme';

type RootProviderProps = {
  children: React.ReactNode;
};

export const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <FirebaseProvider>
          <AuthenticationProvider>
            <BooksProvider>
                {children}
            </BooksProvider>
          </AuthenticationProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
