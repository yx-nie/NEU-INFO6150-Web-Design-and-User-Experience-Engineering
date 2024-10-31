import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

function Order() {
    const dispatch = useDispatch();
    const { isAuthenticated, userid } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    const location = useLocation();
    // below userId is the seller's userId
    const {item, userId} = location.state || {};
    console.log(userid);
    console.log(isAuthenticated);
    console.log(userId);
    console.log(item.review);

    const [review, setReview] = useState([]);

    useEffect(() => {
        loadReview();
    }, []);

    const loadReview = async () => {
        // I want to display the reviews regarding the item
        console.log(item.review);
        setReview(item.review);
    }

    
    const oncancel = () => {
        navigate('/');
    }

    const onConfirm = async () => {
        const response1 = await axios.get(`${process.env.REACT_APP_API_URL}/findOne/users/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })
        console.log(response1);
        const user = response1.data.data.user;
        user.buylist.push(item);

        const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${userid}`, {user: user}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })

        if (response.status !== 200) {
            alert('The order is not confirmed');
        } else {
            alert('Order has been confirmed');
            navigate('/purchasehistory');
        }
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
            <div>
                <h2>User Review</h2>
                {review ? (
                    review.map((rev) => (
                        <div key={rev.reviewId}
                        style={{
                            padding: '15px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <p>Rating: {rev.rating}</p>
                            <p>Comment: {rev.comment}</p>
                            <p>Reviewed by User ID: {rev.reviewerId}</p>
                        </div>
                    ))
                ) : (
                    <p>No review available for this item.</p>
                )}
            </div>
            <div style={{
                        padding: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        backgroundColor: '#f9f9f9'
                    }}>
                <h2>Order Item</h2>
                {item ? (
                    <>
                        <h3>{item.name}</h3>
                        <p>Price: {item.price}</p>
                        <p>Description: {item.description}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Category: {item.category}</p>
                        <p>Location From: {item.locationFrom}</p>
                        <p>Location To: {item.locationTo}</p>
                        <p>Seller: {item.seller}</p>
                        <p>Status: {item.status}</p>
                        <p>Condition: {item.condition}</p>
                        <button onClick={() => onConfirm()}>
                           Confirm
                        </button>
                        <button onClick={() => oncancel()}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <p>No item details available.</p>
                )}
            </div>
        </div>
    );
}       

export default Order
