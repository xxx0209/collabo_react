import axios from "axios";
import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from 'react-router-dom';

function App() {

    // 파라미터 관련 state 변수 선언
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');

    //폼 유효성 검사(Form Validation Check) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState({
        name: '', email: '', password: '', address: '', general: ''
    });

    const navigate = useNavigate();

    /*
        구분        async/await 사용           then/catch 사용
        필수 여부    없어도 됨                   가능
        가독성    더 깔끔                       체인이 길어지면 복잡
        에러 처리    try...catch 한 번에 가능       .catch() 따로 작성
        추천 여부    대부분의 비동기 코드에서 추천   간단한 한 줄짜리 Promise라면 가능
    */
    const SignupAction = async (event) => {
        try {

            event.preventDefault();

            const url = `${API_BASE_URL}/member/signup`;
            const parameters = { name, email, password, address }
            const response = await axios.post(url, parameters);

            if (response.status === 200) { // 스프링의 MemberController 파일 참조
                alert(response.data);
                navigate('member/login');
            }

        } catch (error) { // error : 예외 객체
            if (error.response && error.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(error.response.data);
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                setErrors((previous) => ({ ...previous, general: '회원 가입 중에 오류가 발생하였습니다.' }));
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">회원 가입</h2>
                            {/* 일반 오류 발생시 사용자에게 alert 메시지를 보여 줍니다. */}
                            {/* contextual : 상황에 맞는 적절한 스타일 색상을 지정하는 기법 */}

                            {/* 
                                !! 연산자는 어떠한 값을 강제로 boolean 형태로 변경해주는 자바스크립트 기법 입니다.
                                
                                isInvalid 속성은 해당 control의 유효성을 검사하는 속성입니다.
                                값이 true이면 Form.Control.Feedback에 빨간 색상으로 오류 메세지를 보여 줍니다.
                            */}

                            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                            <Form onSubmit={SignupAction}>
                                <Form.Group className="mb-3">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이름을 입력해 주세요."
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이메일을 입력해 주세요."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        isInvalid={!!errors.email}
                                        required />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호을 입력해 주세요."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        isInvalid={!!errors.password}
                                        required />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="주소를 입력해 주세요."
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        isInvalid={!!errors.address}
                                        required />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    회원가입
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;