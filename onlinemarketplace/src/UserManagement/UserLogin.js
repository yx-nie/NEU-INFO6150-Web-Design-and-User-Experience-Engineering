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
        <div className="wrap">
            <main id="content" role='main' className='container'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className='form-wrapper'>
                    <form onSubmit={(e)=>handleSubmit(e)}>
                        <h2 className='form-heading'>Login</h2>
                        <div className='form-group'>
                            <label htmlFor="username" className='form-label'>Username</label>
                            <input type={"text"} className='form-control' autoFocus = {true}
                            placeholder='Enter your name' name='username' value={username} required
                            onChange={(e)=>onInputChange(e)}></input>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password" className='form-label'>Password</label>
                            <input type={"password"} className='form-control' autoFocus = {true}
                            placeholder='Enter your password' name='password' value={password} required
                            onChange={(e)=>onInputChange(e)}></input>
                        </div>
                        <button type="submit" className='btn btn-primary'>Login</button>
                        <Link  className='btn btn-danger' to="/">Cancel</Link>
                        <Link  className='btn btn-danger' to="/forgetpassword">Forget password ?</Link>
                    </form>
                </div>
            </main>
        </div>
        
    );
};

export default UserLogin