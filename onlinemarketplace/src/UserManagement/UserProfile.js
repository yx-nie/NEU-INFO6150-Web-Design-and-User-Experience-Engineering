import axios from "axios";
import { useEffect, useState } from "react";
import { Link, resolvePath } from "react-router-dom";
import { useSelector } from "react-redux";

function UserProfile() {
    const {isAuthenticated, userid} = useSelector(state => state.auth); 
        const [user, setUser] = useState({
            _id: userid,
            user: {
                username: '',
                email:  '',
                password:  '',
                role: '',
                location: '',
                selllist: [],
                buylist: [],
                transactions: []
            }
        });

        useEffect(() => {
            loadUser();
        }, []);

        const { username, email, password, role, location, selllist, buylist, transactions} = user;

        const loadUser = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/findOne/users/${userid}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });

            const data = response.data;
            if (data.status === 'success') {
                setUser(data.data.user);
            } else {
                alert('Failed to fetch user');
            }
        }

        const onInputChange = e => {
            setUser({ ...user, [e.target.name]: e.target.value });
        }

        
        
        const onSubmit = async (e) => {
            e.preventDefault();
            let updateUser = {...user};
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateOne/users/${userid}`, {user: updateUser}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });

            if (response.status === 200) {
                setUser(updateUser);
                alert('User updated successfully');
            } else {
                alert('Failed to update user');
            }
        }



    return (
        <div style={{ padding: '100px' }}>
        <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Edit User</h2>
                <form onSubmit={(e)=>onSubmit(e)}>
                    <div className='mb-3'>
                        <label htmlFor="username" className='form-label'>Username</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your username' name='username' value={username}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email" className='form-label'>Email</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your email' name='email' value={email}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className='form-label'>Password</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your password' name='password' value={password}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="location" className='form-label'>Location</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your location' name='location' value={location}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <button type="submit" className='btn btn-primary' >Save</button>
                    <Link  className='btn btn-danger mx-2' to="/">Cancel</Link>
                </form>
            </div>
        </div>
    </div>
    </div>
    )
}
export default UserProfile;