import { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth, setAuth } = useAuth();

  return (
    <>{auth?.session_info ? <Outlet /> : <Navigate to="unauthorized" />}</>
  );
};

export default RequireAuth;
