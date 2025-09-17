import { Nav, NavDropdown } from "react-bootstrap";

// useNavigate 훅은 특정한 페이지로 이동하고자 할 때 사용되는 훅입니다.
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    return (
        <>
            <Nav.Link href="#home">상품 보기</Nav.Link>
            <NavDropdown title="기본 연습">
                <NavDropdown.Item onClick={() => (navigate(`/fruit`))}>과일 1개</NavDropdown.Item>
                <NavDropdown.Item onClick={() => (navigate(`/fruit/list`))}>과일 리스트</NavDropdown.Item>
            </NavDropdown>
        </>
    );
}

export default App;