import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

function Review() {
    const [ItemToDisplay, setItemToDisplay] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const {item } = location.state || {};
    const { isAuthenticated, userid } = useSelector((state) => state.auth);
    const [review, setReview] = useState({
        reviewId: '',
        reviewerId: userid,
        rating: 0,
        comment: '',
    });

    const CancelReview = () => {
        navigate('/purchasehistory');
    }

    useEffect(() => {
        setItemToDisplay(item);
    }, [item]);

    const SubmitReview = async (event) => {
        event.preventDefault();
        review.reviewId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let reviewList = item.review;
        console.log(review);
        reviewList = [...reviewList, review];
        item.review = reviewList;

        // get the user firstly;
        const targetUserId = item.sellerId;
        console.log(targetUserId);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findone/users/${targetUserId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            } 
        });

        if (response.status === 200) {
            const targetUser = response.data.data.user;
            const selllist = targetUser.selllist;
            // update the item in the selllist
            for (let i = 0; i < selllist.length; i++) {
                if (selllist[i].itemId === item.itemId) {
                    selllist[i] = item;
                    break;
                }
            }
            targetUser.selllist = selllist;
            console.log(targetUser);
            // update the user
            try {
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${targetUserId}`, {user: targetUser}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                    }
                });
                if (response.status !== 200) {
                    alert ('Failed to submit review');
                } else {
                    alert('Review submitted successfully');
                    navigate('/purchasehistory');
                }
            } catch (error) {
                console.log(error);
                alert('Failed to submit review');
            }
        } else {
            alert ('Could not find the item');
        }
        
    }

    const handleRatingChange = (event) => {
        setReview({ ...review, rating: event.target.value });
    };
    
    const handleCommentChange = (event) => {
        setReview({ ...review, comment: event.target.value });
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
            <div>
                <h2>Item Review</h2>
                <form 
                    style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                    onSubmit={SubmitReview}
                >
                    <label>
                        Rating:
                        <select value={review.rating} onChange={handleRatingChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </label>
                    <label>
                        Comment:
                        <input type="text" value={review.comment} onChange={handleCommentChange} />
                    </label>
                    <button type="submit" style={{ backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }} >Submit</button>
                    <button type="button" style={{ backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }} onClick={CancelReview}>Cancel</button>
                </form>
            </div>
            <ItemDetails item={ItemToDisplay} />
            
        </div>
    )
}

const ItemDetails = ({ item }) => {
    return (
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
                </>
            ) : (
                <p>No item details available.</p>
            )}
        </div>
    )
}

export default Review;