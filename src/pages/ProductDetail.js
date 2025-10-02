/* 
상품 상세 보기
전체 화면을 좌우측을 1대2로 분리합니다.
왼쪽은 상품의 이미지 정보, 오른쪽은 상품의 정보 및 `장바구니`와 `구매하기` 버튼을 만듭니다.
*/

import { Container, Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function App({ user }) {
    const { id } = useParams(); // id 파라미터 챙기기
    const [product, setProduct] = useState(null); // 백엔드에서 넘어온 상품 정보
    // 로딩 상태를 의미하는 state로, 값이 true이면 현재 로딩 중입니다.
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(0);


    const navigate = useNavigate();

    // 파라미터 id가 갱신이 되면 화면을 다시 rendering 시킵니다.
    useEffect(() => {
        const url = `${API_BASE_URL}/product/detail/${id}`;

        axios
            .get(url)
            .then((response) => {
                setProduct(response.data);
                setLoading(false); // 상품 정보를 읽어 왔습니다.
            })
            .catch((error) => {
                console.log(error);
                alert('상품 정보를 불러 오는 중에 오류가 발생하였습니다.');
                navigate(-1); // 이전 페이지로 이동하기
            });
    }, [id]);

    // 아직 backend에서 읽어 오지 못한 경우를 대비한 코딩입니다.
    if (loading === true) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 읽어 오는 중입니다.
                </h3>
            </Container>
        );
    }

    // 상품에 대한 정보가 없는 경우를 대비한 코딩입니다.
    if (!product) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 찾을 수 없습니다.
                </h3>
            </Container>
        );
    }

    //장바구니 관련 코딩들
    //const [quantity, setQuantity] = useState(0);

    // 수량 체인지 관련 이벤트 핸들러 함수 정의
    const QuantityChange = (event) => {
        const newValue = parseInt(event.target.value);
        setQuantity(newValue);
    };

    // 사용자가 수량을 입력하고, '장바구니' 버튼을 눌렀습니다.
    const addToCart = async () => {
        if (quantity < 1) {
            alert(`구매 수량은 1개 이상이어야합니다.`);
            return;
        }

        // alert(`${product.name} ${quantity} 개를 장바구니에 담기`);
        try {
            const url = `${API_BASE_URL}/cart/insert`;

            // Cart에 담을 내용은 회원 아이디, 상품 아이디, 수량입니다.
            // BackEnd 영역에서 CartProductDto 라는 클래스와 매치 됩니다.
            const parameters = {
                memberId: user.id,
                productId: product.id,
                quantity: quantity
            };

            const response = await axios.post(url, parameters);

            alert(response.data);
            navigate('/product/list'); //상품 목록 페이지로 이동

        } catch (error) {
            console.log('오류 발생 : ' + error);

            if (error.response) {
                alert('장바구니 추가 실패');
            }
        }
    }

    // 사용자가 '주문하기' 버튼을 클릭하였습니다.
    const buyNow = async () => {

        if (quantity < 1) {
            alert('수량은 1개이상 선택해 주셔야 합니다.');
            return;
        }

        try {
            const url = `${API_BASE_URL}/order`;

            // 스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
            // 주의) parameters 작성시 OrderDto의 변수 이름과 동일하게 작성해야 합니다.
            // 상세 보기 페이지에서는 무조건 1개의 상품만 주문을 할수 있습니다.
            const parameters = {
                memberId: user.id,
                status: 'PENDING',
                orderItems: [{
                    productId: product.id, // 상품 번호
                    quantity: quantity,   // 구매 수량
                }]
            };

            console.log('주문할 데이터 정보');
            console.log(parameters);
            const response = await axios.post(url, parameters);
            console.log(response.data);
            alert(`${product.name} ${quantity}개를 주문하였습니다.`);

            navigate('/product/list'); // 목록 페이지로 이동

        } catch (error) {
            console.log('주문 기능 실패');
            console.log(error);
        };

        alert('주문 성공');
    };

    return (
        <Container className="my-4">
            <Card>
                <Row className="g-0">
                    {/* 좌측 상품 이미지 */}
                    <Col md={4}>
                        <Card.Img
                            variant="top"
                            src={`${API_BASE_URL}/images/${product.image}`}
                            alt={`${product.name}`}
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Col>
                    {/* 우측 상품 정보 및 구매 관련 버튼 */}
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="fd-3">
                                {product.name}
                            </Card.Title>
                            <Table striped>
                                <tbody>
                                    <tr>
                                        <td className="text-center">가격</td>
                                        <td>{product.price}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">카테고리</td>
                                        <td>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">재고</td>
                                        <td>{product.stock}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">설명</td>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">등록일자</td>
                                        <td>{product.inputdate}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            {/* 구매 수량 입력란 */}
                            {/* as={Row}는 렌더링시 기본 값인 <div> 말고 Row로 렌더링하도록 해줍니다.*/}
                            <Form.Group as={Row} className="mb-3 align-items-center">
                                {/* <Row className="g-0"> */}
                                <Col xs={3} className="text-center">
                                    <strong>구매 수량</strong>
                                </Col>
                                <Col xs={5} className="text-center">
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        disabled={!user}
                                        value={quantity}
                                        onChange={QuantityChange}
                                    />
                                </Col>
                                {/* </Row> */}
                            </Form.Group>

                            {/* 버튼(이전 목록, 장바구니, 구매하기) */}
                            <div className="d-flex justify-content-center mt-3">
                                <Button variant="primary" className="me-3 px-4" href="/product/list">
                                    이전 목록
                                </Button>
                                <Button variant="success" className="me-3 px-4"
                                    onClick={() => {
                                        if (!user) {
                                            alert('로그인이 필요한 서비스입니다.');
                                            return navigate('/member/login');
                                        } else {
                                            addToCart();
                                        }
                                    }}
                                >
                                    장바구니
                                </Button>
                                <Button variant="danger" className="me-3 px-4"
                                    onClick={() => {
                                        if (!user) {
                                            alert('로그인이 필요한 서비스입니다.');
                                            return navigate('/member/login');
                                        } else {
                                            buyNow();
                                        }
                                    }}
                                >
                                    구매하기
                                </Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default App;