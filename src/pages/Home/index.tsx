import React from "react";
import { useAuthentication } from "../../context/authentication";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const { doLogout, user } = useAuthentication();

  const logout = async () => {
    await doLogout();

    navigate("/login");
  };

  return (
    <>
      <h1>Welcome to home page {user?.email} :)</h1>
      <button onClick={logout} type="button">
        Logout
      </button>
    </>
  );
};
