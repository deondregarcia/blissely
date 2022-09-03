import React from "react";
import Axios from "axios";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";
import { LogoutButton, LoginButton } from "../Buttons/Buttons";

const Navbar = () => {
  const { auth, setAuth } = useAuth();

  const logout = () => {
    setAuth({});
    Axios.get("/logout")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="navbar-container">
      <h1 className="navbar-header">Bliss</h1>

      <div onClick={() => console.log("button test")}>Log</div>

      <div className="login-logout-container">
        {auth.session_info ? (
          <LogoutButton />
        ) : (
          <LoginButton googleLink="http://localhost:3000/auth/google" />
        )}
      </div>

      <div className="login">
        <button onClick={logout}>Logout</button>
        <button onClick={() => console.log(auth)}>Console Log Auth</button>
        <button
          onClick={() => console.log(auth.session_info ? "true" : "false")}
        >
          Console Log Auth Boolean
        </button>
        <h3>
          <a href="http://localhost:3000/auth/google">Login with Google</a>
        </h3>
      </div>
    </div>
  );
};

export default Navbar;
