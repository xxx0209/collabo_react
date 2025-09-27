import axios from "axios";

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/config";


/*
step 01
상품 목록을 상품 아이디 역순으로 읽어서 화면에 전체 목록을 보여 줍니다.
하나의 행에 3개의 열씩 보여 줍니다.
필드 검색과 페이징 기능은 구현하지 않았습니다.

step 02
사용자 정보가 'ADMIN'이면, 등록/수정/삭제 버튼이 보이게 코딩
삭제 버튼에 대한 기능 구현
*/
function App({ user }) {
    // 스프링에서 넘겨 받은 상품 목록 state
    const [products, setProducts] = useState([]);

    // 스프링 부트에 "상품 목록"을 요청하기
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`;

        axios
            .get(url, {})
            .then((response) => {
                console.log('응답 받은 데이터');
                // console.log(response.data);
                setProducts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const navigate = useNavigate();

    // 이 함수는 관리자 모드일때 보여 주는 `수정`과 `삭제`를 위한 버튼을 생성해주는 함수입니다.
    const makeAdminButtons = (item, user, navigate) => {
        if (user?.role !== 'ADMIN') return null;

        return (
            <div className="d-flex justify-content-center">
                <Button
                    variant="warning"
                    className="mb-2"
                    size="sm"
                    onClick={(event) => {
                        event.stopPropagation();
                        // alert('수정');
                        navigate(`/product/update/${item.id}`);
                    }}
                >
                    수정
                </Button>
                &nbsp;
                <Button
                    variant="danger"
                    className="mb-2"
                    size="sm"
                    onClick={async (event) => {
                        event.stopPropagation();

                        const isDelete = window.confirm(`'${item.name}' 상품을 삭제하시겠습니까?`);

                        if (isDelete === false) {
                            alert(`'${item.name}' 상품 삭제를 취소하셨습니다.`);
                            return;
                        }

                        try { // 상품을 삭제 후 다시 상품 목록 페이지를 보여 줍니다.
                            // 주의) 상품을 삭제하려면 반드시 primary key인 상품의 아이디를 넘겨 주어야 합니다.
                            await axios.delete(`${API_BASE_URL}/product/delete/${item.id}`);

                            // alert 함수(modal 통신)와 비동기 통신 사용시, 화면 갱신에 유의하도록 합니다.
                            alert(`'${item.name}' 상품이 삭제 되었습니다.`);

                            // 삭제된 id를 배제하고, 상품 목록 state를 다시 갱신합니다.
                            setProducts(prev => prev.filter(p => p.id !== item.id));

                            navigate('/product/list');

                        } catch (error) {
                            console.log(error);
                            alert(`상품 삭제 실패 : ${error.response?.data || error.message}`);
                        }
                    }}
                >
                    삭제
                </Button>
            </div>
        );
    };

    return (
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>
            <Link to={`/product/insert`}>
                {user?.role === 'ADMIN' && (
                    <Button variant="primary" className="mb-3">
                        상품 등록
                    </Button>
                )}
            </Link>

            {/* 필드 검색 영역 */}

            {/* 자료 보여 주는 영역 */}
            <Row>
                {/* products는 상품 배열, item는 상품 1개를 의미 */}
                {products.map((item) => (
                    <Col key={item.id} md={4} className="mb-4">
                        <Card className="h-100"
                            onClick={() => navigate(`/product/detail/${item.id}`)}
                            style={{ cursor: 'pointer' }}>
                            <Card.Img
                                variant="top"
                                src={`${API_BASE_URL}/images/${item.image}`}
                                alt={item.name}
                                style={{ width: '100%', height: '200px' }}
                            />
                            <Card.Body>
                                {/* borderCollapse : 각 셀의 테두리를 합칠 것인지, 별개로 보여 줄지를 설정하는 속성 */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '70%', padding: '4px', border: 'none' }} >
                                                <Card.Title>{item.name}({item.id})</Card.Title>
                                            </td>
                                            {/*  textAlign: 수평 정렬 방식, verticalAlign: 수직 정렬 방식 지정 */}
                                            {/* rowSpan 속성은 행방향으로 병합시 사용 ↔ colSpan  */}
                                            <td rowSpan={2} style={{ padding: '4px', border: 'none', textAlign: 'center', verticalAlign: 'middle' }} >
                                                {makeAdminButtons(item, user, navigate)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: '70%', padding: '4px', border: 'none' }} >
                                                <Card.Text>가격 : {item.price.toLocaleString()} 원</Card.Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* 페이징 처리 영역 */}

        </Container>
    );
}

export default App;