import logo from './logo.svg';
import './App.css';
import { Container, Nav, Navbar } from 'react-bootstrap';

import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';

function App() {

  const appName = "IT Academy Coffee Shop";

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand href='/'>{appName}</Navbar.Brand>
          <Nav className="me-auto">
            <MenuItems />
          </Nav>
        </Container>
      </Navbar>

      {/* 분리된 라우터 정보 */}
      <AppRoutes />


      <footer className="bg-dark text-light text-center py-3 mt-5">
        <p>&copy 2025 {appName}. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
