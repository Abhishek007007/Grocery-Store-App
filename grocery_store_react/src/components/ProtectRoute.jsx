import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_data } from "../redux/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

async function get_user(user) {
  try {
    const resp = await axios.get(
      import.meta.env.VITE_API_BASE_URL + "/userauth/api/user/",
      {
        headers: {
          Authorization: "Bearer " + user.access_token,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    return resp;
  } catch (error) {
    Cookies.remove("access");
    console.log(error);
    return null;
  }
}

async function refresh_token(user) {
  try {
    const resp = await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/userauth/api/refresh/",
      { refreshtoken: user.refresh_token },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    Cookies.set("access", resp.data.access);
    Cookies.set("refresh", resp.data.refresh);
    return resp;
  } catch (error) {
    Cookies.remove("refresh");
    console.log(error);
    return null;
  }
}

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function handleInitialization() {
      const resp = await get_user(user);
      if (resp !== null) {
        dispatch(set_data({ ...user, ...resp.data.data, isLoggedIn: true }));
        navigate("/");
      } else {
        const refreshed = await refresh_token(user);
        if (refreshed !== null) {
          dispatch(
            set_data({
              ...user,
              ...refreshed.data.data,
              isLoggedIn: true,
              access_token: Cookies.get("access"),
              refresh_token: Cookies.get("refresh"),
            })
          );
          navigate("/");
        }
      }
    }
    if (!user.isLoggedIn) {
      handleInitialization();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <h1>Loading</h1>;
  }

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
