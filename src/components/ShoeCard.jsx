import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { CiHeart } from "react-icons/ci";
import './css/Card.css'; 
import { Link } from 'react-router-dom';

export default function ShoeCard(props) {
    return (
        <Col xs={12} md={4} className="mb-4 d-flex justify-content-center align-items-center" data-id={props.id}>
            <Card className='shoecard'>
                <p className="discount-label">وفر 30%</p>
                <Card.Img variant="top" src={props.image} alt={props.name} />
                <CiHeart className='heart'/>
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <Card.Text className='prices'>
                        <span className="deleted-price">700 جنيها</span>
                        <strong className="current-price">{props.currentPrice} جنيها</strong>
                    </Card.Text>
                    <Link to={`/product/${props.id}`}>
                        <button className="btn-full-width">
                            عرض الخيارات
                        </button>
                    </Link>
                </Card.Body>
            </Card>
        </Col>
    );
}
