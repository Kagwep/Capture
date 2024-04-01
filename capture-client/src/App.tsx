import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home"
import RoomDetails from "./pages/RoomDetails";
import AllRooms from "./pages/AllRooms";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import MainLayout from './layout/MainLayout';
import GameplayLayout from './layout/GameplayLayout';


const App = () => {

  
  return (
    <div className="overflow-hidden">
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route
            path="/virtual-gallery"
            element={<MainLayout><AllRooms /></MainLayout>}
          />
          <Route
            path="/game-play"
            element={<GameplayLayout><RoomDetails /></GameplayLayout>}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
