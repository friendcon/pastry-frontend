import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import ProductRegister from './pages/ProductRegister';
import SearchResult from './pages/SearchResult';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import MyPage from './pages/MyPage';
import Notification from './pages/Notification';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/register" element={<ProductRegister />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/chat" element={<ChatList />} />
      <Route path="/chat/:id" element={<ChatRoom />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/notification" element={<Notification />} />
    </Routes>
  );
}