import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

function ForgettingPassword() {
    const navigator = useNavigate();
    const [email, setEmail] = useState('');
    const [user, setUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [emails, setEmails] = useState([]);

    useEffect (() => {
        loadEmails();
    }, [])

    const loadEmails = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findAll/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        });

        for(const user of response.data.data) {
            if (user.user.role !== 'admin') {
                setUsers([...users, user]);
                setEmails([...emails, user.user.email]);
            }
        }
    }

    const onInputChange = (e) => {
        setEmail(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(emails.includes(email)) {
            const selectedUser = users.find(u => u.user.email === email);
            // send the password to the email
            if (selectedUser) {
            try {
                const templateParams = {
                    email: email,
                    message: "Here is your password: " + selectedUser.user.password
                };

                const response2 =await emailjs.send(`${process.env.REACT_APP_API_EMAIL_SERVICE_ID}`, `${process.env.REACT_APP_API_EMAIL_TEMPLATE_ID}`, templateParams, `${process.env.REACT_APP_API_EMAIL_USER_ID}`);

                if (response2.status === 200) {
                    alert("Email sent successfully");
                    navigator('/login');
                } else {
                    alert("Failed to send email");
                }

            } catch (error) {
                console.log(error);
            }

        } else {
            alert("Email is not in the database");
        }
    }
    }


    return (
        <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Fill out emial to get your password</h2>
                <form onSubmit={(e)=>onSubmit(e)}>
                    <div className='mb-3'>
                        <label htmlFor="Email" className='form-label'>Email</label>
                        <input type={"text"} className='form-control' 
                        placeholder='Enter your email' name='email' value={email}
                        onChange={(e)=>onInputChange(e)}></input>
                    </div>
                    <button type="submit" className='btn btn-primary' >Submit</button>
                    <Link  className='btn btn-danger mx-2' to="/">Cancel</Link>
                </form>
            </div>
        </div>
    </div>
    );
}
export default ForgettingPassword   