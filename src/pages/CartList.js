import axios from "axios";

import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Image, Form } from "react-bootstrap";
import { Links, useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/config";

function App({ user }) {
    const thStyle = { fontSize: '1.2rem' }; // 테이블 헤더 스타일
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
                                onChange={''}
                            />
                        </th>
                        <th>상품 정보</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>xxx</td>
                        <td>xxx</td>
                        <td>xxx</td>
                        <td>xxx</td>
                        <td>xxx</td>
                    </tr>
                </tbody>
            </Table>
            {/* 좌측 정렬(text-start), 가운데 정렬(text_center), 우측 정렬(text-end) */}
            <h3 className="text-end mt3">총 주문 금액 : 0원</h3>
            <div className="text-end">
                <Button variant="primary" size="lg" onClick={''}>
                    주문하기
                </Button>
            </div>
        </ Container >
    );
}

export default App;