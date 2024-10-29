import axios from 'axios';
import React, { useState, useEffect } from 'react';

function UserManagement() {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        location: '',
        selllist: {},
        buylist: {}
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    function onSelect({user, userId}) {
        setUser(user);
        setUserId(userId);
    }

    const loadUsers = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findAll/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        });
        // I do not want to display the admin user
        response.data.data = response.data.data.filter(u => u.user.role !== 'admin');
        setUsers(response.data.data);
    };

    const onSave = async (user, userId) => {
        
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateone/users/${userId}`, {user :user }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });
            console.log(response);
            if (response.status !== 200) {
                alert('Failed to update user');
            } else {
                alert('User updated successfully');
                loadUsers();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onDelete = async (user, userId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteone/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });
            if (response.status !== 200) {
                alert('Failed to delete user');
            } else {
                alert('User deleted successfully');
                loadUsers();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
            <div>
                <UserDetails user={user} userId={userId} setUser={setUser} setUserId={setUserId} />
                <button onClick={() => onSave(user, userId)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>Update</button>
                <button onClick={() => onDelete(user, userId)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px' }}>Delete</button>
            </div>
            <UserList users={users} onSelect={onSelect} />
        </div>
    );
}

const UserDetails = ({ user, userId, setUser, setUserId }) => {
    const onInputChange = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
        setUserId(userId)
    }
    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            {user ? (
                <>
                    <h2>User Details</h2>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" placeholder="Name" value={user.username || ''} onChange={(e)=>onInputChange(e)}/>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="text" name="email" placeholder="Email" value={user.email || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="text" name="password" placeholder="Password" value={user.password || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input type="text" name="location" placeholder="Location" value={user.location || ''} onChange={(e)=>onInputChange(e)} />
                    </div>
                </>
            ) : (
                <p>Select an user from the list or click "New" to add a new user</p>
            )}
        </div>
    );
};

const UserList = ({ users, onSelect }) => {
    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Item List</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {users.map(userObj => (
                    <div 
                    key={userObj._id} 
                    onClick={() => onSelect({user: userObj.user, userId: userObj._id})} 
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
                    <h3 style={{ margin: '0 0 5px' }}>{userObj.user.username}</h3>
                    <p style={{ margin: '0 0 5px' }}><strong>email:</strong> ${userObj.user.email}</p>
                    <p style={{ margin: '0 0 5px' }}><strong>password:</strong>{userObj.user.password}</p>
                    <p style={{ margin: '0 0 5px' }}><strong>location:</strong>{userObj.user.location}</p>
                </div>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;