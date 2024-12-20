import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HomeItemListing() {
    const navigate = useNavigate();
    const { isAuthenticated, userid } = useSelector((state) => state.auth);
    const [items, setItems] = useState([]);
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
        review:[]
    });

    const [composedItems, setComposedItems] = useState([]);
    const [composedItem, setComposedItem] = useState({
        userId: '',
        item: {}
    })

    const [searchQuery, setSearchQuery] = useState('');
    const [displayedItems, setDisplayedItems] = useState([]);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findAll/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        });

        if (response.status !== 200) {
            alert('Failed to fetch items');
        } else {
            // I do not want to display the admin user
            response.data.data = response.data.data.filter(u => u.user.role !== 'admin');
            console.log(response.data.data);
            setUsers(response.data.data);
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
            setDisplayedItems(allComposedItems);
            console.log(allComposedItems);
        }
    };

    const onSelect = (item, userId) => {
        setItem(item);
        navigate('/order', { state: { item, userId } });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.value);   
    }

    useEffect(() => {
        if (searchQuery === '') {
            setDisplayedItems(composedItems);
        } else {
            const filteredItems = composedItems.filter(item => item.item.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setDisplayedItems(filteredItems);
        }
        
    }, [searchQuery, composedItems]);

    
    return (
        <div style={{ padding: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Item Listings</h1>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '300px',
                        marginRight: '20px',
                    }}
                />
            </div>
            <ItemList composedItems={displayedItems} onSelect={onSelect} isAuthenticated={isAuthenticated} />
        </div>
    );
}


const ItemList = ({composedItems, onSelect, isAuthenticated}) => {
    
    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            {/* <h2>Item List</h2> */}
            <ul style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px' 
                }}>
            {composedItems? (
                    <>
                    {composedItems.map(composedItem => (
                    <div 
                    key={composedItem.item.itemId} 
                    //onClick={() => onSelect(composedItem.item, composedItem.userId)} 
                    style={{
                        flex: '1 1 calc(33.33% - 20px)', 
                        padding: '15px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <h3 style={{ margin: 0 }}>{composedItem.item.name}</h3>
                        <p style={{ margin: '5px 0' }}>Price: {composedItem.item.price}</p>
                        <p style={{ margin: '5px 0' }}>Description: {composedItem.item.description}</p>
                        <p style={{ margin: '5px 0' }}>Quantity: {composedItem.item.quantity}</p>
                        <p style={{ margin: '5px 0' }}>Category: {composedItem.item.category}</p>
                        <p style={{ margin: '5px 0' }}>Location From: {composedItem.item.locationFrom}</p>
                        <p style={{ margin: '5px 0' }}>Location To: {composedItem.item.locationTo}</p>
                        <p style={{ margin: '5px 0' }}>Seller: {composedItem.item.seller}</p>
                        <p style={{ margin: '5px 0' }}>Status: {composedItem.item.status}</p>
                        <p style={{ margin: '5px 0' }}>Condition: {composedItem.item.condition}</p>
                        <div>
                            {isAuthenticated && <button style={{ backgroundColor: 'orange', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}
                            onClick={() => onSelect(composedItem.item, composedItem.userId)}>Order</button>}
                        </div>
                    </div>
                    ))}
                    </>
                ) : (
                    <p>No Items are available.</p>
                )}
            </ul>
        </div>
    );
};  

export default HomeItemListing;