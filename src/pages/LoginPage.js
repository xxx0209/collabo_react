import axios from "axios";
import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { Link, useNavigate } from 'react-router-dom';

function App({ setUser }) {
    // setUser : 사용자 정보를 저장하기 위한 setter 메소드
    // 파라미터 관련 state 변수 선언    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //폼 유효성 검사(Form Validation Check) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState('');

    const navigate = useNavigate();

    const LoginAction = async (event) => {  //로그인과 관련된 이벤트 처리 함수
        try {

            event.preventDefault();

            const url = `${API_BASE_URL}/member/login`;
            const parameters = { email, password };

            //스프링 부트가 넘겨 주는 정보는 Map<String, Object> 타입 입니다.
            const response = await axios.post(url, parameters);


            // message에는 '로그인 성공 여부'를 알리는 내용, member에는 로그인 한 사람의 객체 정보가 반환 됩니다.
            const { message, member } = response.data;

            if (message === 'success') { //자바에서 맵.put("message", "로그인 성공");
                console.log('로그인 한 사람의 정보');
                console.log(member);
                // 로그인 성공시 사용자 정보를 어딘가에 저장해야 합니다.
                setUser(member);

                navigate('/'); // 로그인 성공 후 홈 페이지로 이동

            } else { // 로그인 실패
                setErrors(message);
            }

        } catch (error) { // error : 예외 객체
            if (error.response && error.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(error.response.data.message || '로그인 실패');
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                setErrors('Server Error');
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">로그인</h2>

                            {errors && <Alert variant="danger">{errors}</Alert>}
                            <Form onSubmit={LoginAction}>
                                <Form.Group className="mb-3">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="이메일을 입력해 주세요."
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="비밀번호을 입력해 주세요."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required />
                                </Form.Group>
                                <Row className="g-2">
                                    <Col xs={8}>
                                        <Button variant="primary" type="submit" className="w-100">
                                            로그인
                                        </Button>
                                    </Col>
                                    <Col xs={4}>
                                        <Link to={'/member/signup'} className="btn btn-outline-secondary w-100">회원 가입</Link>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;