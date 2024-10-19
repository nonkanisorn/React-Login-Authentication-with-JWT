import { React, useEffect, useState } from "react";
import Nav from "../component/Nav";
import Adminpage from "../component/Adminpage";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminRoute({ children }) {
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData.token;
  const checkAdmin = async () => {
    const res = await axios.post("http://localhost:5056/verifyadmin", {
      token: token,
    });
    if (res.data === "admin") {
      setIsAdmin(true);
    } else {
      nav("/login");
    }
  };
  const back = () => {
    window.history.back();
  };
  useEffect(() => {
    checkAdmin();
  }, []);
  return isAdmin ? (
    <>
      <Nav></Nav>
      {children}
    </>
  ) : (
    <>
      <div>ไม่มีสิทธิ์</div>
      <button onClick={back}>ย้อนกลับ</button>
    </>
  );
  // }
}

export default AdminRoute;
