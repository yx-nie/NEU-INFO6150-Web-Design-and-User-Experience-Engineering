import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function UserRegistration() {

    let navigate = useNavigate();

    const [user, setUser] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:""
    });

    const {username, email, password, confirmPassword} = user;

    const [buttonType, setButtonType] = useState(null);

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };


    const onInputChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const emailValidation = validateEmail(email);
        const passwordValidation = password !== confirmPassword ? false : true;
        const noEmptyPassword = password === '' ? false : true;
        const noEmptyUsername = username === '' ? false : true; 

        if (emailValidation === false) {
            alert('Email is not valid')
            return;
        }

        if (passwordValidation === false) {         
            alert('Passwords do not match')
            return;
        }

        if (!noEmptyPassword || !noEmptyUsername) {     
            alert('No empty fields allowed')
            return;
        }

        if (emailValidation === true && passwordValidation === true && noEmptyPassword === true && noEmptyUsername === true) {
            const transformedData = {
                user: {
                    username: username,
                    email: email,
                    password: password,
                    role: buttonType,
                    location: "",
                    selllist: [],
                    buylist: []
                }
            }

            const url = process.env.REACT_APP_API_URL;

            console.log(url);
            

            
            fetch(`${process.env.REACT_APP_API_URL}/createorupdate/users`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                },
                body: JSON.stringify(transformedData)
              }).then(response => response.json())
              .then(data => {
                if (data.status === 'success') {
                    alert('User registered successfully');
                    navigate("/login");
                } 
              })
              .catch(error => {
                alert('User registration failed');
                navigate("/");
                console.log(error);
              });

        }

    }

    return (
    <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Register User</h2>
                <form onSubmit={(e)=>onSubmit(e)}>
                    <div className='mb-3'>
                        <label htmlFor="username" className='form-label'>Username</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your name' name='username' value={username}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="Email" className='form-label'>Email</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your email' name='email' value={email}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className='form-label'>Password</label>
                        <input type={"password"} className='form-control' 
                        placeholder='Enter your password' name='password' value={password}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="confirmPassword" className='form-label'>Confirm Password</label>
                        <input type="password" className='form-control'
                        placeholder='Confirm your password' name='confirmPassword' value={confirmPassword}
                        onChange={onInputChange} />
                    </div>
                    <button onClick={() => setButtonType("user")} type="submit" className='btn btn-primary' >Register</button>
                    <Link  className='btn btn-danger mx-2' to="/">Cancel</Link>
                </form>
            </div>
        </div>
    </div>
    )
}

export default UserRegistration