import './App.css';

import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {

  const appName = "IT Academy Coffee Shop";

  // user : 로그인 한 사람의 정보를 저장하고 있는 state
  // 클라이언트에서 사용자 정보를 저장하기 위하여 localStorage를 사용 하겠습니다.
  const [user, setUser] = useState(null);

  // JSON.parse()는 JSON형태의 문자열을 자바 스크립트 객체 형태로 변환해 줍니다.
  useEffect(() => {
    const loginUser = localStorage.getItem('user');
    setUser(JSON.parse(loginUser));
  }, []); // 2번째 매개 변수가 empty array이므로 1번만 rendering 됩니다.

  const handleLoginSuccess = (userData) => {
    // userData : LoginPage.js 에서 반환 받은 member 정보입니다.
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('로그인 성공');
  };

  const navigate = useNavigate();

  // 로그인한 사용자가 '로그 아웃' 버튼을 클릭했습니다.
  const handleLogout = (event) => {
    event.preventDefault();

    setUser(null);
    localStorage.removeItem('user');
    console.log('로그 아웃 성공');
    navigate('/member/login');
  };

  return (
    <>
      <MenuItems appName={appName} user={user} handleLogout={handleLogout} />

      {/* 분리된 라우터 정보 */}
      <AppRoutes user={user} handleLoginSuccess={handleLoginSuccess} />

      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p>&copy 2025 {appName}. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
