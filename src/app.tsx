import { Navigate, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { useAuthentication } from "./context/authentication";
import BookDetail from "./pages/BookDetail";

export const App = () => {
  const { isFetchingUser, isLogged } = useAuthentication();

  if (!isLogged && isFetchingUser) return <h1>Loading user...</h1>;

  return isLogged ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

const AuthenticatedApp = () => {
  const { isLogged } = useAuthentication();

  if (!isLogged) {
    return <Navigate to="/login" />
  } 

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/:bookId" element={<BookDetail />} />
    </Routes>
  );
};

const UnauthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
