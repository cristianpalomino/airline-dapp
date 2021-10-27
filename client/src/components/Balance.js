import React from "react";

function Balance(wallet, amount) {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h3 className="card-title">Balance</h3>
                <p className="card-text mt-3">
                    <div className="d-flex">
                        <span class="badge bg-info ">Wallet: 0x11222333</span>
                    </div>
                    <div className="d-flex mt-1">
                        <span class="badge bg-success ">Balance: 100.00</span>
                    </div>
                </p>
            </div>
        </div>
    );
}

export default Balance;