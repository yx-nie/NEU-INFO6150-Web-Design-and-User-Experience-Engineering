import {React, useContext }from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


export default function Navbar() {
    const dispatch = useDispatch();
    const {isAuthenticated, isAdmin} = useSelector(state => state.auth);

    return (
        <div className="wrap">
            <div className="content">
            <div className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to="/"> 🎁 Market Place</Link>
                    </div>

                    <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            {!isAuthenticated && <Link className="nav-link active" to="/registeruser">Register</Link>}
                        </li>
                        <li>
                            {!isAuthenticated && <Link className="nav-link active" to="/login">Login</Link>}
                        </li>
                        <li>
                            {isAuthenticated && <Link className="nav-link active" to="/userprofile">Profile</Link>}
                        </li>
                        <li>
                            {isAuthenticated && <Link  className='nav-link active' to="/purchasehistory">Manage Purchase History</Link>}
                        </li>
                        <li>
                            {isAuthenticated && <Link  className='nav-link active' to="/sellinghistory">Manage Selling History</Link>}
                        </li>
                        <li>
                            {isAuthenticated && <Link  className='nav-link active' to="/storemanagement">Manage Your Store</Link>}
                        </li>
                        <li>
                            {isAuthenticated && isAdmin && <Link className="nav-link active" to="/usermanagement">User Management</Link>}
                        </li>
                        <li>
                            {isAuthenticated && isAdmin && <Link className="nav-link active" to="/itemsmanagement">Items Management</Link>}
                        </li>
                        <li>
                            {isAuthenticated && <Link className="nav-link active" to="/userlogout">Logout</Link>}
                        </li>
                    </ul>   
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}