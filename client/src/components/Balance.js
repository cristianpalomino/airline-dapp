import React, { useEffect, useState } from "react";
import MyFlights from './MyFlights';

const Balance = (props) => {

    const [balance, setBalance] = useState(null);

    useEffect(() => {
        props.accounts[0].balance().then((value) => {
            setBalance(value);
        });
    });

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h3 className="card-title">Wallet</h3>
                <p className="card-text mt-3">
                    <div className="d-flex">
                        <span className="badge bg-info">Address: {props.accounts[0].address}</span>
                    </div>
                    <div className="d-flex mt-1">
                        <span className="badge bg-primary ">Balance: {balance} eth.</span>
                    </div>
                    <MyFlights myFlights={props.myFlights} />
                </p>
            </div>
        </div>
    );
}

export default Balance;