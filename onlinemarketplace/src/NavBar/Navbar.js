import {React, useContext }from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


export default function Navbar() {
    const dispatch = useDispatch();
    const {isAuthenticated, isAdmin} = useSelector(state => state.auth);

    return (
        <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Market Place</a>
                {!isAuthenticated && <Link className="btn btn-outline-light" to="/registeruser">Register</Link>}
                {!isAuthenticated && <Link className="btn btn-outline-light" to="/login">Login</Link>}
                {isAuthenticated && <Link className="btn btn-outline-light" to="/userprofile">Profile</Link>}
                {isAuthenticated && <Link  className='btn btn-outline-light' to="/purchasehistory">Manage Purchase History</Link>}
                {isAuthenticated && <Link  className='btn btn-outline-light' to="/storemanagement">Manage Your Store</Link>}
                {isAuthenticated && isAdmin && <Link className="btn btn-outline-light" to="/usermanagement">User Management</Link>}
                {isAuthenticated && isAdmin && <Link className="btn btn-outline-light" to="/itemsmanagement">Items Management</Link>}
                {isAuthenticated && <Link className="btn btn-outline-light" to="/userlogout">Logout</Link>}
            </div>
        </nav>
    </div>
    )
}