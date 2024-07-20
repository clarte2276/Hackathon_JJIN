import './App.css';
import Login from './components/mypage/Login';
import Signup from './components/mypage/Signup';
import Mypage from './components/mypage/Mypage';
import Chatbot from './components/chat/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/loginpage" element={<Login />} />
        <Route path="/signuppage" element={<Signup />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/Chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
