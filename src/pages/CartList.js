import axios from "axios";

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Image, Form } from "react-bootstrap";
import { Links, useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/config";

function App({ user }) {
    const thStyle = { fontSize: '1.2rem' }; // 테이블 헤더 스타일

    // 보여 주고자하는 '카트 상품' 배열 정보
    const [cartProducts, setCartProducts] = useState([]);

    // 화면에 보여 주는 주문 총 금액을 위한 스테이트
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);

    const navigate = useNavigate();

    // 사용자의 정보가 바뀔때 화면을 렌터링 해주어야 합니다.
    // user?,id : Optional Chaining(물음표를 적어 주면 오류가 발생하지 않고 undefined를 반환해 줍니다.)
    // 즉, 오류 호면을 보여주지 않고 아무런 일이 없었다는 듯이 동작합.
    useEffect(() => {
        if (user && user?.id) {
            fetchCartProducts();
        }
    }, [user]);

    // 특정 고객이 장바구니에 담은 '카트 상품' 목록을 조회합니다.
    const fetchCartProducts = async () => {
        try {
            const url = `${API_BASE_URL}/cart/list/${user.id}`;
            const response = await axios.get(url);
            console.log('카트 상품 조회 결과');
            console.log(response.data);

            setCartProducts(response.data || []);

        } catch (error) {
            console.log('오류 정보');
            console.log(error);
            alert(`'카트 상품' 정보가 존재하지 않아서 상품 목록 페이지로 이동합니다.`);
            navigate('/product/list');
        }
    };

    // '전체 선택' 체크 박스를 Toggle 했습니다.    
    const toggleAllCheckBox = (isAllCheck) => {
        //isAllCheck : `전체 선택` 체크 박스의 boolean 값
        setCartProducts((previous) => {
            // 모든 객체(카트 상품)들의 나머지 속성은 보존하고, 체크 상태(checked)를
            // '전체 선택' 체크 상태와 동일하게 설정합니다.
            const updatedProducts = previous.map((product) => ({
                ...product,
                checked: isAllCheck
            }));

            // 비동기적 렌더링 문제로 수정된 updatedProducts 항목을 매개 변수로 넘겨야 정상적으로 동작힙니다.
            refreshOrderTotalPrice(updatedProducts);
            return updatedProducts;
        });


    };

    // 체크 박스의 상태가 Toggle될때 마다, 전체 요금을 다시 재계산하는 함수입니다.
    const refreshOrderTotalPrice = (products) => {
        let total = 0; //총 금액 변수

        products.forEach((bean) => {
            if (bean.checked) { // 선택된 체크 박스에 대하여 
                total += bean.price * bean.quantity; // 총 금액 누적
            }
        });

        setOrderTotalPrice(total); // State 업데이트
    };

    // 개별 체크 박스를 클릭 하였습니다.
    const toggleCheckBox = (cartProductId) => {
        console.log(`카트 상품 아이디 : ${cartProductId}`);

        setCartProducts((previous) => {
            const updatedProducts = previous.map((product) => (
                product.cartProductId === cartProductId
                    ? { ...product, checked: !product.checked }
                    : product
            ));

            refreshOrderTotalPrice(updatedProducts);
            return updatedProducts;
        });
    };

    // 카트
    const changeQuantity = async (cartProductId, quantity) => {
        // NaN : Not A Number        
        if (isNaN(quantity)) { // 숫자 형식이 아니면
            // 값을 0으로 변경한 다음, 상태 업데이트
            setCartProducts((previous) => {
                previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: 0 }
                        : product
                );
            });

            alert('변경 수량은 최소 1 이상이어야 합니다.');
            return;
        }

        try {

            // 사용 예시 : 100번 항목을 10개로 수정해 주세요.
            // http://localhost:9000/cart/edit/100?quantity=10
            const url = `${API_BASE_URL}/cart/edit/${cartProductId}?quantity=${quantity}`;

            //patch 동작은 전체가 아닌 일부 데이터를 변경하고자 할때 사용됩니다.
            // 스프링의 WebConfig 클래스안의 addCorsMappings() 메소드를 참조하시길 바랍니다.
            const response = await axios.patch(url);

            console.log(response.data || '');

            // cartProducts의 수량 정보를 갱신합니다.
            setCartProducts((previous) => {
                const updatedProducts = previous.map((product) =>
                    product.cartProductId === cartProductId
                        ? { ...product, quantity: quantity }
                        : product
                );

                refreshOrderTotalPrice(updatedProducts);
                return updatedProducts;
            });

        } catch (error) {
            console.log('카트 상품 수량 변경 실패');
            console.log(error);
        }
    };

    // 선택된 항목의 '카트상품' 아이디를 이용하여 해당 품목을 목록에서 배제합니다.
    const deleteCartProduct = async (cartProductId) => {
        const isConfirmed = window.confirm('해당 카트 상품을 정말로 삭제하시겠습니까?');

        if (isConfirmed) {
            console.log('삭제할 카트 상품 아이디 : ' + cartProductId)

            try {
                const url = `${API_BASE_URL}/cart/delete/${cartProductId}`;
                const response = await axios.delete(url);

                //카트 상품 목록을 갱신하고, 요금을 다시 계산합니다.
                setCartProducts((previous) => {
                    const updatedProducts = previous.filter((bean) => bean.cartProductId !== cartProductId);

                    refreshOrderTotalPrice(updatedProducts);
                    return updatedProducts;
                });

                alert(response.data)

            } catch (error) {
                console.log('카트 상품 삭제 동작 오류');
                console.log(error);
            }
        } else {
            alert('카트 상품 삭제를 취소하셨습니다.');
        }

    };

    // 사용자가 '주문하기' 버튼을 클릭하였습니다.
    const makeOrder = async () => {
        // 체크 박스가 on 상태인 것만 필터링 합니다.
        const selectedProducts = cartProducts.filter((bean) => bean.checked);
        console.log('--->' + { ...selectedProducts });
        if (selectedProducts.length === 0) {
            alert('주문할 상품을 선택해 주세요.');
            return;
        }

        try {
            const url = `${API_BASE_URL}/order`;

            // 스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있습니다.
            // 주의) parameters 작성시 OrderDto의 변수 이름과 동일하게 작성해야 합니다.
            const parameters = {
                memberId: user.id,
                status: 'PENDING',
                orderItems: selectedProducts.map((product) => ({
                    cartProductId: product.cartProductId, // 카트 상품 번호
                    productId: product.productId, // 상품 번호
                    quantity: product.quantity,   // 구매 수량
                }))
            };

            console.log(parameters);
            const response = await axios.post(url, parameters);
            alert(response.data);

            // 방금 주문한 품목은 이제 장바구니 목록에서 제거되어야 합니다.
            // 주문상품 제거하기
            setCartProducts((previous) => previous.filter((product) => !product.checked));

            // 총 주문 금액 초기화
            setOrderTotalPrice(0); // 총 주문 금액 초기화

        } catch (error) {
            console.log('주문 기능 실패');
            console.log(error);
        };

        alert('주문 성공');
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                {/* xxrem은 주의 글꼴의 xx배를 의미합니다. */}
                <span style={{ color: 'blur', fontSize: '2rem' }}>{user?.name}</span>
                <span style={{ fontSize: '1.3rem' }}>님의 장바구니</span>
            </h2>
            <Table striped style={thStyle}>
                <thead>
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                label="전체 선택"
                                onChange={(event) => toggleAllCheckBox(event.target.checked)}
                            />
                        </th>
                        <th>상품 정보</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <tr key={product.cartProductId}>
                                <td className="text-center align-middle">
                                    {/* 전체 선택  */}
                                    <Form.Check
                                        type="checkbox"
                                        checked={product.checked}
                                        // style={{ transform: "scale(1.4)", cursor: "pointer" }}
                                        onChange={() => toggleCheckBox(product.cartProductId)}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <Row> {/* 좌측 4칸은 이미지 영역, 우측 8칸은 상품 이름 영역 */}
                                        <Col xs={4}>
                                            <Image
                                                src={`${API_BASE_URL}/images/${product.image}`}
                                                thumbnail
                                                alt={product.name}
                                                width={80}
                                                height={80}
                                            />
                                        </Col>
                                        <Col xs={8} className="d-flex align-items-center">
                                            {product.name}
                                        </Col>
                                    </Row>
                                </td>
                                <td className="text-center align-middle">
                                    <Form.Control
                                        type="number"
                                        min={1}
                                        value={product.quantity}
                                        onChange={(event) => changeQuantity(product.cartProductId, parseInt(event.target.value))}
                                        style={{ width: '80px', margin: '0 auto' }}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    {(product.price * product.quantity).toLocaleString()} 원
                                </td>
                                <td className="text-center align-middle">
                                    <Button variant="danger" size="sm"
                                        onClick={() => deleteCartProduct(product.cartProductId)}>
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center align-middle">
                                장바구니가 비어 있습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {/* 좌측 정렬(text-start), 가운데 정렬(text_center), 우측 정렬(text-end) */}
            <h3 className="text-end mt3">총 주문 금액 : {orderTotalPrice.toLocaleString()}원</h3>
            <div className="text-end">
                <Button variant="primary" size="lg" onClick={makeOrder}>
                    주문하기
                </Button>
            </div>
        </ Container >
    );
}

export default App;