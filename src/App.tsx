import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { WelcomePage } from "./COMPONENTS/WELCOMEPAGE/WelcomePage";
import { Login } from "./ROUTES/LOGINPAGE/Login";
import { Table } from "./ROUTES/TABLE/Table";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/table" element={<Table />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
