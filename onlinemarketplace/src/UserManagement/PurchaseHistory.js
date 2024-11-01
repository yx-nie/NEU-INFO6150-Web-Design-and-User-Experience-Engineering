import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PurchaseHistory() {
    const navigate = useNavigate();
    const [item, setItem] = useState({
        itemId: '',
        name: '',
        price: '',
        description: '',
        quantity: '',
        image: '',
        category: '',
        locationFrom: '',
        locationTo: '',
        seller: '',
        sellerId: '',
        status: '',
        condition: '',
        review: []
    });
    const [items, setItems] = useState([]);
    const { isAuthenticated, userid } = useSelector((state) => state.auth);
    //const hasUserid = localStorage.getItem('userid');
    const [user, setUser] = useState({});

    useEffect(() => {
        loadItems();
    }, []);

    function onSelect () {
        console.log(item);
        setItem(item);
    }

    const loadItems = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findOne/users/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        });
        setUser(response.data.data.user)
        setItems(response.data.data.user.buylist);
    };

    const handleDeleteItem = async () => {
        console.log(item.itemId);
        const updatedItems = items.filter(itm => itm.itemId !== item.itemId);
        
        console.log(updatedItems);
        user.buylist = updatedItems;

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${userid}`, {user: user}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });
            console.log(response);
            if (response.status !== 200) {
                alert('Failed to delete item');
            } else {
                setItems(updatedItems);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const AddReview = async (item) => {
        navigate('/review', { state: { item} });
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
            <div>
                <ItemDetails item={item} setItem={setItem} />
                <button
                    style={{ backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={() => AddReview(item)}
                >
                    Add Review
                </button>
                <button
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={() => handleDeleteItem}
                >
                    Delete
                </button>
            </div>


            <ItemList items={items} onSelect={setItem} />
        </div>
    )
}



const ItemList = ({items, onSelect}) => {
    
    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Item List</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {items.map(item => (
                    <div 
                    key={item.itemId} 
                    onClick={() => onSelect(item)} 
                    style={{
                        padding: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        backgroundColor: '#f9f9f9'
                    }}
                >
                    <h3 style={{ margin: '0 0 5px' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 5px' }}><strong>Price:</strong> ${item.price}</p>
                    <p style={{ margin: '0 0 5px' }}><strong>Description:</strong>{item.description}</p>
                    <p style={{ margin: '0' }}><strong>Quantity:</strong> {item.quantity}</p>
                    <p style={{ margin: '0' }}><strong>Category:</strong> {item.category}</p>
                    <p style={{ margin: '0' }}><strong>Location From:</strong> {item.locationFrom}</p>
                    <p style={{ margin: '0' }}><strong>Seller:</strong> {item.seller}</p>
                    <p style={{ margin: '0' }}><strong>Status:</strong> {item.status}</p>
                    <p style={{ margin: '0' }}><strong>Condition:</strong> {item.condition}</p>
                </div>
                ))}
            </ul>
        </div>
    )
}

const ItemDetails = ({ item, onSave, onDelete, onAddNew, setItem }) => {

    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            {item ? (
                <>
                    <h2>Item Details</h2>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" placeholder="Name" value={item.name || ''} readOnly/>
                    </div>
                    <div>
                        <label>Price:</label>
                        <input type="text" name="price" placeholder="Price" value={item.price || ''} readOnly/>
                    </div>
                    <div>
                        <label>Description:</label>
                        <input type="text" name="description" placeholder="Description" value={item.description || ''} readOnly/>
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input type="text" name="quantity" placeholder="Quantity" value={item.quantity || ''} readOnly/>
                    </div>
                    <div>
                        <label>Category:</label>
                        <input type="text" name="category" placeholder="Category" value={item.category || ''} readOnly/>
                    </div>
                    <div>
                        <label>Location From:</label>
                        <input type="text" name="locationFrom" placeholder="Location From" value={item.locationFrom || ''} readOnly/>
                    </div>
                    <div>
                        <label>Seller:</label>
                        <input type="text" name="seller" placeholder="Seller" value={item.seller || ''} readOnly/>
                    </div>
                    <div>
                        <label>Status:</label>
                        <input type="text" name="status" placeholder="Status" value={item.status || ''} readOnly/>
                    </div>
                    <div>
                        <label>Condition:</label>
                        <input type="text" name="condition" placeholder="Condition" value={item.condition || ''} readOnly/>
                    </div>
                </>
            ) : (
                <p>Select an item from the list to view</p>
            )}
        </div>
    );
};

export default PurchaseHistory