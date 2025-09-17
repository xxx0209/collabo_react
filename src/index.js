// import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css'; // for 부트 스트랩

// Router는 App.js 파일 내의 모든 라우터 정보를 감싸는 역할을합니다.
import { BrowserRouter } from 'react-router-dom'; //신규 생성됨

const root = ReactDOM.createRoot(document.getElementById('root'));

// React.StrictMode : 코드 삭제
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
