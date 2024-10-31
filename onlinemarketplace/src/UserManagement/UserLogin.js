import React, { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { validateLogin } from '../Store/authSliceThunk';

function UserLogin() { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, error } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(validateLogin({ username, password }));
    }

    const onInputChange = (e) => {
        if (e.target.name === 'username') {
            setUsername(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    }

    return (
    <div className='container'>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Login</h2>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <div className='mb-3'>
                        <label htmlFor="username" className='form-label'>Username</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your name' name='username' value={username}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className='form-label'>Password</label>
                        <input type={"password"} className='form-control' 
                        placeholder='Enter your password' name='password' value={password}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <button type="submit" className='btn btn-primary'>Login</button>
                    <Link  className='btn btn-danger mx-2' to="/">Cancel</Link>
                    <Link  className='btn btn-danger mx-2' to="/">Forget password ?</Link>
                </form>
            </div>
        </div>
    </div>
        
    );
};

export default UserLogin