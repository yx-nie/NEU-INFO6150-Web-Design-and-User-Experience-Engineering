import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function StoreManagement() {
    const initialState = {
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
    }
    const [item, setItem] = useState(initialState);

    const [items, setItems] = useState([]);
    const {isAuthenticated, userid} = useSelector((state) => state.auth);
    const [user, setUser] = useState({});


    useEffect(() => {
        loadItems();
    }, []);

    function onSelect (item) {
        setItem(item);
    }

    const loadItems = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findOne/users/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })
        setUser(response.data.data.user)
        setItems(response.data.data.user.selllist || []);
    }

    const onSave = async (item) => {
        const updatedItems = items.map(itm => itm.itemId === item.itemId ? item : itm);
        
        console.log(updatedItems);
        user.selllist = updatedItems;
        console.log(user);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${userid}`, {user :user }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });
            console.log(response);
            if (response.status !== 200) {
                alert('Failed to save item');
            } else {
                alert('Item saved successfully');
                setItems(updatedItems);
                setItem(initialState);
                
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddNewItem = async () => {
        if (item.quantity <= 0) {
            item.status = 'out of stock';
        } else {
            item.status = 'available';
        }
        const newItem = item;
        // generate new item id
        newItem.itemId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // make sure the review is empty
        newItem.review = [];
        // make sure to put user id into selling items.
        newItem.sellerId = userid;
        console.log(newItem);
        const newItems = [...(items || []), newItem];
        console.log(newItems);
        const newUser = {...user, selllist: newItems};
        console.log(newUser);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${userid}`, {user: newUser}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });
            if (response.status !== 200) {
                alert('Failed to add item to sell list');
            } else {
                alert('Item added to sell list successfully');
                setItems(newItems);
                setItem(initialState);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteItem = async () => {
        const updatedItems = items.filter(itm => itm.itemId !== item.itemId);
        
        console.log(updatedItems);
        user.selllist = updatedItems;

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${userid}`, {user: user}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });
            if (response.status !== 200) {
                alert('Failed to delete item');
            } else {
                alert('Item deleted successfully');
                setItems(updatedItems);
                setItem(initialState);
                
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '110px' }}>
            <div>
                <ItemDetails item={item} setItem={setItem} />
                <button
                    style={{ backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={() => onSave(item)}
                >
                    Update
                </button>
                <button
                    style={{ backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={handleAddNewItem}
                >
                    Add
                </button>
                <button
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={handleDeleteItem}
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
            {Array.isArray(items) && items.length > 0 ? (
                    <>
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
                </>
                ) : <p>No items found</p>}
            </ul>
        </div>
    )
}

const ItemDetails = ({ item, onSave, onDelete, onAddNew, setItem }) => {

    const onInputChange = (e) => {
        const { name, value } = e.target
        setItem({ ...item, [name]: value })
    }

    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            {item ? (
                <>
                    <h2>Item Details</h2>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" placeholder="Name" value={item.name || ''} onChange={(e)=>onInputChange(e)}/>
                    </div>
                    <div>
                        <label>Price:</label>
                        <input type="text" name="price" placeholder="Price" value={item.price || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input type="text" name="description" placeholder="Description" value={item.description || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input type="text" name="quantity" placeholder="Quantity" value={item.quantity || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    <div>
                        <label>Category:</label>
                        <input type="text" name="category" placeholder="Category" value={item.category || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    <div>
                        <label>Location From:</label>
                        <input type="text" name="locationFrom" placeholder="Location From" value={item.locationFrom || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    <div>
                        <label>Seller:</label>
                        <input type="text" name="seller" placeholder="Seller" value={item.seller || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    {/* <div>
                        <label>Status:</label>
                        <input type="text" name="status" placeholder="Status" value={item.status || ''} onChange={(e)=>onInputChange(e)} />
                    </div> */}
                    <div>
                        <label>Condition:</label>
                        <input type="text" name="condition" placeholder="Condition" value={item.condition || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                </>
            ) : (
                <p>Select an item from the list or click "New" to add a new item</p>
            )}
        </div>
    );
};

export default StoreManagement