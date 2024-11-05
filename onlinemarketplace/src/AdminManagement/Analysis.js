import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement // Needed for Pie chart
} from 'chart.js';

// Register chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Analysis() {
    const [transactions, setTransactions] = useState([]);
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
        console.log('load transactions');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/findAll/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
            }
        });

        if (response.status !== 200) {
            alert('Failed to load transactions');
        } else {
            console.log('getting transactions');
            // set the transactions data
            // but I do not want to include the admin data
            let allTransactions = []
            
            for (const user of response.data.data) {
                if (user.user.role !== 'admin') {
                    allTransactions = [...allTransactions, ...user.user.transactions];
                }
            }

            setTransactions(allTransactions);
        }
    }


    

    return (
        <div>
            Analysis
            {transactions.length > 0 ?
            <>  
                       <TransactionData transactions={transactions} />
                       </> : <p>No transactions found</p>}
        </div>
    )
}

const TransactionData = ({ transactions }) => {
    const labels = transactions.map(txn => txn.itemName || 'Unknown Item');
    const data = transactions.map(txn => (txn.price || 0) * (txn.quantity || 0));

    return (
        <div>
            <p>not implemented yet</p>
        </div>
    );

    

    
};


export default Analysis