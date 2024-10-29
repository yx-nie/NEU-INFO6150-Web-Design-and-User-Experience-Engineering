import axios from 'axios';
import React, { useState, useEffect } from 'react';

function ItemsManagement() {
    //const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
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
        status: '',
        condition: ''
    });
    const [userId, setUserId] = useState('');
    //const [itemId, setItemId] = useState('');
    const [composedItem, setComposedItem] = useState({
        userId: '',
        item: {}
    });
    const [composedItems, setComposedItems] = useState([]);


    const onSelect = (item, userId) => {
        setItem(item);
        setUserId(userId);    
    }

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findAll/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })

        if (response.status !== 200) {
            alert('Failed to fetch items');
        } else {
            // I do not want to load the admin user
            response.data.data = response.data.data.filter(u => u.user.role !== 'admin');
            setUsers(response.data.data);
            console.log(response.data.data);
            const allComposedItems = [];
            for (const user of response.data.data) {
                if (user.user.selllist) {
                    for (const sellItem of user.user.selllist) {
                        const newComposedItem = {
                            userId: user._id,
                            item: sellItem
                        };
                        allComposedItems.push(newComposedItem);
                    }
                }
            }
            setComposedItems(allComposedItems);
            console.log(allComposedItems);
        }   
    }
    

    const onSave = async (item, userId) => {
        const user = users.find((user) => user._id === userId);
        console.log(user);
        const newSelllist = user.user.selllist.map((selllistItem) => {
            if (selllistItem.itemId === item.itemId) {
                return item;
            }
            return selllistItem;
        })
        user.user.selllist = newSelllist;
        console.log(user);
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${userId}`, {user: user.user}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })

        if (response.status !== 200) {
            alert('Failed to update item');
        } else {
            alert('Item updated successfully');
            loadItems();
        }
    }

    const onDelete = async (item, userId) => {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteone/users/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })

        if (response.status !== 200) {
            alert('Failed to delete item');
        } else {
            alert('Item deleted successfully');
            loadItems();
        }
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
            <div>
                <ItemDetails item={item} setItem={setItem} setUserId={setUserId}/>
                <button
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={() => onDelete(item, userId)}
                >
                    Delete
                </button>
                <button
                    style={{ backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                    onClick={() => onSave(item, userId)}
                >
                    Update
                </button>
            </div>
            <ItemList composedItems={composedItems} onSelect={onSelect} />
        </div>
    );
}

const ItemDetails = ({ item, setItem, setUserId }) => {
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
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
                    <div>
                        <label>Status:</label>
                        <input type="text" name="status" placeholder="Status" value={item.status || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
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
}



const ItemList = ({composedItems, onSelect}) => {
    
    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Item List</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {composedItems.map(composedItem => (
                    <div 
                    key={composedItem.item.itemId} 
                    onClick={() => onSelect(composedItem.item, composedItem.userId)} 
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
                    <h3 style={{ margin: '0 0 5px' }}>{composedItem.item.name}</h3>
                    <p style={{ margin: '0 0 5px' }}><strong>Price:</strong> ${composedItem.item.price}</p>
                    <p style={{ margin: '0 0 5px' }}><strong>Description:</strong>{composedItem.item.description}</p>
                    <p style={{ margin: '0' }}><strong>Quantity:</strong> {composedItem.item.quantity}</p>
                    <p style={{ margin: '0' }}><strong>Category:</strong> {composedItem.item.category}</p>
                    <p style={{ margin: '0' }}><strong>Location From:</strong> {composedItem.item.locationFrom}</p>
                    <p style={{ margin: '0' }}><strong>Seller:</strong> {composedItem.item.seller}</p>
                    <p style={{ margin: '0' }}><strong>Status:</strong> {composedItem.item.status}</p>
                    <p style={{ margin: '0' }}><strong>Condition:</strong> {composedItem.item.condition}</p>
                </div>
                ))}
            </ul>
        </div>
    );
}   

export default ItemsManagement;