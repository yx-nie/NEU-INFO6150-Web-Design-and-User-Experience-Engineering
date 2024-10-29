import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {logout} from '../Store/authSlice';
function UserLogout () {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    }

    React.useEffect(() => {
        handleLogout();
    }, [dispatch, navigate]);

    return null;
}

export default UserLogout