import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { AgCharts } from 'ag-charts-react';


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
        <div style={{ padding: '110px' }}>
            Analysis
            {transactions.length > 0 ?
            <>  
                       <TransactionData transactions={transactions} />
                       </> : <p>No transactions found</p>}
        </div>
    )
}

const TransactionData = ({ transactions }) => {
    const aggregatedData = transactions.reduce((acc, txn) => {
        const itemName = txn.itemName || 'Unknown Item';
        const totalValue = (txn.price || 0) * (txn.quantity || 0);

        // If the item already exists in the accumulator, add the totalValue to the existing value
        if (acc[itemName]) {
            acc[itemName] += totalValue;
        } else {
            // If the item does not exist in the accumulator, set it with the current totalValue
            acc[itemName] = totalValue;
        }

        return acc;
    }, {});

    const chartData = Object.entries(aggregatedData).map(([itemName, totalValue]) => ({
        itemName,
        totalValue
    }));


    const chartOptions = {
        data: chartData,
        series: [
            {
                type: 'bar',
                xKey: 'itemName',
                yKey: 'totalValue',
                yName: 'Total Value',
                label: { enabled: true }
            }
        ],
        axes: [
            { type: 'category', position: 'bottom', title: { text: 'Item Name' } },
            { type: 'number', position: 'left', title: { text: 'Total Deal' } }
        ],
        legend: { enabled: false }
    };

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <AgCharts options={chartOptions} />
        </div>
    );
 
};


export default Analysis