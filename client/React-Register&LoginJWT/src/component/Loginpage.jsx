import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const [inputID, setInputID] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [userData, setUserData] = useState({});
  const nav = useNavigate();
  console.log(inputID, inputPassword);
  const Login = async () => {
    try {
      const res = await axios.post("http://localhost:5056/login", {
        ID: inputID,
        Password: inputPassword,
      });
      console.log("us", res);
      const role = res.data.user.role;
      console.log("role", role);
      const newUserData = { user: res.data.user, token: res.data.token };
      localStorage.setItem("user", JSON.stringify(newUserData));
      if (role === "admin") {
        nav("/admin");
      } else if (role === "user") {
        nav("/welcome");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <input
        placeholder="ID"
        onChange={(e) => setInputID(e.target.value)}
      ></input>
      <br />
      <input
        placeholder="Password"
        onChange={(e) => setInputPassword(e.target.value)}
      ></input>
      <br />
      <button onClick={Login}>Login</button>
    </>
  );
}

export default Loginpage;
