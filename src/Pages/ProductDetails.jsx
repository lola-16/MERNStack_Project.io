import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import './Css/ProductDetails.css';
import ShoeCard from '../components/ShoeCard';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addProduct } from '../Rtk/Slices/CartSlice';

const ProductDetails = (props) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addProduct({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
        }));
    };

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedError, setRelatedError] = useState(null);
    const [customerRating, setCustomerRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [ratingError, setRatingError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product) return;

            try {
                setRelatedLoading(true);
                setRelatedError(null);
                const response = await axios.get(`http://localhost:8080/api/products/category/${product.category}`);
                setRelatedProducts(response.data);
            } catch (err) {
                console.error('Error fetching related products:', err);
                setRelatedError('Failed to load related products.');
            } finally {
                setRelatedLoading(false);
            }
        };
        fetchRelatedProducts();
    }, [product]);

    const handleStarClick = (index) => {
        setCustomerRating(index + 1); 
    };

    const submitRating = async () => {
        if (!customerRating) return;
    
        try {
            const ratingData = {
                product: product._id,
                rating: customerRating,
            };
            console.log('Submitting rating:', ratingData);
            const response = await axios.post('http://localhost:8080/api/reviews', ratingData);
            console.log('Rating submitted successfully:', response.data);
            setRatingSubmitted(true);
            setRatingError(null);
        } catch (error) {
            console.error('Error submitting rating:', error.response ? error.response.data : error);
            setRatingSubmitted(false);
            setRatingError('Failed to submit rating. Please try again.');
        }
    };
    
    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
                <Link to="/" className="btn btn-primary">Go Back</Link>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">Product not found.</Alert>
                <Link to="/" className="btn btn-primary">Go Back</Link>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-3">
            <Row className="text-center desc h-100 g-2">
                <Col xs={12} md={6}>
                    <img src={product.image} alt={product.name} className="img-fluid" />
                </Col>
                <Col xs={12} md={6}>
                    <h1 className='mb-5'>{product.name}</h1>
                    <p style={{ fontSize: 30 }} className='mb-3'>{product.price} جنيها {product.deletedPrice && <del>{product.deletedPrice} جنيها</del>}</p>
                    <h2>الاحجام المتاحة</h2>
                    <div className='sizes'>
                        {product.sizes && product.sizes.length > 0 ? (
                            product.sizes.map((size, index) => (
                                <span key={index} className="size">{size}</span>
                            ))
                        ) : (
                            <p>لا توجد أحجام متاحة لهذا المنتج.</p>
                        )}
                    </div>
                    <Row className="text-center cart">
                        <Col>
                            <Button className="car-btn w-100" onClick={handleAddToCart}>اضافة لعربة التسوق</Button>
                        </Col>
                    </Row>
                    <div className="rate m-2">
                        {Array.from({ length: 5 }, (_, index) => (
                            <FaStar key={index} color={index < (product.rating || 0) ? "#ffc107" : "#e4e5e9"} />
                        ))}
                    </div>
                    <Row className="text-center d-flex justify-content-center align-items-center g-3">
                        <Col xs={6} md={4}>
                            <div className="card-detail">
                                <i className="fa-solid fa-medal" />
                                <h3>جودة عالية</h3>
                            </div>
                        </Col>
                        <Col xs={6} md={4}>
                            <div className="card-detail">
                                <i className="fa-solid fa-truck-fast" />
                                <h3>شحن سريع</h3>
                            </div>
                        </Col>
                        <Col xs={6} md={4}>
                            <div className="card-detail">
                                <i className="fa-solid fa-share-from-square" />
                                <h3>استبدال سهل</h3>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <div className="description text-end mt-4">
                <h2>الوصف</h2>
                <hr />
                <p>{product.description}</p>
            </div>

            {/* Customer Review Part */}
            <div className="customer-review text-end mt-4">
                <h2>تقييمك للمنتج!</h2>
                <hr />
                <div className="rate">
                    {Array.from({ length: 5 }, (_, index) => (
                        <FaStar
                            key={index}
                            color={index < customerRating ? "#ffc107" : "#e4e5e9"}
                            onClick={() => handleStarClick(index)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </div>
                <button className="btn btn-primary mt-3" onClick={submitRating}>
                    ارسال التقييم
                </button>
                {ratingSubmitted && <p className="mt-2 text-success">تم إرسال تقييمك بنجاح!</p>}
                {ratingError && <p className="text-danger mt-2">{ratingError}</p>}
            </div>

            <div className="related text-end mt-4">
                <h2>العناصر المشابهة</h2>
                <hr />
                {relatedLoading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : relatedError ? (
                    <Alert variant="danger">{relatedError}</Alert>
                ) : relatedProducts.length > 0 ? (
                    <Row className="row" id="product-list">
                        {relatedProducts.map((sock) => (
                            <ShoeCard
                                key={sock._id}
                                id={sock._id}
                                image={sock.image}
                                name={sock.name}
                                deletedPrice={sock.deletedPrice}
                                currentPrice={sock.price}
                            />
                        ))}
                    </Row>
                ) : (
                    <p>لا توجد عناصر مشابهة.</p>
                )}
            </div>
        </Container>
    );
};

export default ProductDetails;
