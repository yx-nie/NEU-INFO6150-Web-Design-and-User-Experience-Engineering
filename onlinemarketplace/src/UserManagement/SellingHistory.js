import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SellingHistory() {  
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const { isAuthenticated, userid } = useSelector((state) => state.auth);

    const initialState = useState({
        transactionId: '',
        buyerId: '',
        buyerName: '',
        sellerId: '',
        sellerName: '',
        itemId: '',
        itemName: '',
        quantity: '',
        price: '',
        category: '',
        locationFrom: '',
        locationTo: '',
        transactionTime:''
    });
    const [transaction, setTransaction] = useState(initialState);


    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findOne/users/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })

        setTransactions(response.data.data.user.transactions);
    }

    const onSelect = (transaction) => {
        setTransaction(transaction);
        //navigate(`/transaction/${transaction.transactionId}`);
    }

    const onDelete = async (transactionId) => {
        // update the transactions
        let updateTransactions = [];
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].transactionId !== transactionId) {
                updateTransactions.push(transactions[i]);
            }
        }

        const response1 = await axios.get(`${process.env.REACT_APP_API_URL}/findOne/users/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })

        const user = response1.data.data.user;
        user.transactions = updateTransactions;

        const response2 = await axios.put(`${process.env.REACT_APP_API_URL}/updateOne/users/${userid}`, {user: user}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        })

        if (response2.status === 200) {
            setTransactions(updateTransactions);
            alert('Transaction deleted successfully');
        } else {
            alert('Failed to delete transaction');
        }
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '110px' }}>
            <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Item Name</th>
                    <th>Buyer Name</th>
                    <th>Seller Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Location From</th>
                    <th>Location To</th>
                    <th>Transaction Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {transactions && transactions.map((transaction) => (
                    <tr key={transaction.transactionId}>
                        <td>{transaction.transactionId}</td>
                        <td>{transaction.itemName}</td>
                        <td>{transaction.buyerName}</td>
                        <td>{transaction.sellerName}</td>
                        <td>{transaction.quantity}</td>
                        <td>{transaction.price}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.locationFrom}</td>
                        <td>{transaction.locationTo}</td>
                        <td>{transaction.transactionTime}</td>
                        <td>
                        <button onClick={() => onDelete(transaction.transactionId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>    
        </table>
        </div>
        </div>
    );
}

const TransactionList = ({transactions, onDelete}) => {
    return (
        <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Item Name</th>
                    <th>Buyer Name</th>
                    <th>Seller Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Location From</th>
                    <th>Location To</th>
                    <th>Transaction Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {transactions && transactions.map((transaction) => (
                    <tr key={transaction.transactionId}>
                        <td>{transaction.transactionId}</td>
                        <td>{transaction.itemName}</td>
                        <td>{transaction.buyerName}</td>
                        <td>{transaction.sellerName}</td>
                        <td>{transaction.quantity}</td>
                        <td>{transaction.price}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.locationFrom}</td>
                        <td>{transaction.locationTo}</td>
                        <td>{transaction.transactionTime}</td>
                        <td>
                        <button onClick={() => onDelete(transaction.transactionId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>    
        </table>
        </div>
    );
}

export default SellingHistory;