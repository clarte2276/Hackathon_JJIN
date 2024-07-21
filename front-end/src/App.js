import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import Login from "./components/mypage/Login";
import Signup from "./components/mypage/Signup";
import Mypage from "./components/mypage/Mypage";
import Chatbot from "./components/chat/Chatbot";
import Reservation from "./components/form/Reservation";
import Reservation2 from "./components/form/Reservation2";
import Notice from "./components/notice/Notice";
import CreateNotice from "./components/notice/CRUD/CreateNotice";
import ReadNotice from "./components/notice/CRUD/ReadNotice";
import UpdateNotice from "./components/notice/CRUD/UpdateNotice";
import Suggest from "./components/suggest/Suggest";
import CreateSuggest from "./components/suggest/CRUD/CreateSuggest";
import ReadSuggest from "./components/suggest/CRUD/ReadSuggest";
import UpdateSuggest from "./components/suggest/CRUD/UpdateSuggest";
import SelectSpace from "./components/home/SelectSpace";
import RandomChat from "./components/chat/RandomChat";

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
        <Route path="/bag/form2" element={<Reservation2 />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/notice/process/new_Post" element={<CreateNotice />} />
        <Route path="/notice/PostView/:no" element={<ReadNotice />} />
        <Route
          path="/notice/Postview/:no/process/update"
          element={<UpdateNotice />}
        />
        <Route path="/suggest" element={<Suggest />} />
        <Route path="/suggest/process/new_Post" element={<CreateSuggest />} />
        <Route path="/suggest/PostView/:no" element={<ReadSuggest />} />
        <Route
          path="/suggest/Postview/:no/process/update"
          element={<UpdateSuggest />}
        />
        <Route path="/select/space" element={<SelectSpace />} />
        <Route path="/randomchat" element={<RandomChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
