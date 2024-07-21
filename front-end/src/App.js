import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';
import Login from './components/mypage/Login';
import Signup from './components/mypage/Signup';
import Mypage from './components/mypage/Mypage';
import Chatbot from './components/chat/Chatbot';
import Reservation from './components/form/Reservation';
import Notice from './components/notice/Notice';
import CreateNotice from './components/notice/CRUD/CreateNotice';
import ReadNotice from './components/notice/CRUD/ReadNotice';
import UpdateNotice from './components/notice/CRUD/UpdateNotice';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginpage" element={<Login />} />
        <Route path="/signuppage" element={<Signup />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/Chatbot" element={<Chatbot />} />
        <Route path="/bag/form" element={<Reservation />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/process/new_Post" element={<CreateNotice />} />
        <Route path="/notice/PostView/:no" element={<ReadNotice />} />
        <Route path="/notice/Postview/:no/process/update" element={<UpdateNotice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
