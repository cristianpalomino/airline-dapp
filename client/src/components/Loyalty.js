import React, { useEffect, useState } from "react";

const Loyalty = (props) => {

    const [points, setPoints] = useState(null);
    const [ether, setEther] = useState(null);

    useEffect(() => {
        props.loyalty.points().then((points) => {
            setPoints(points);
        })
        props.loyalty.ether().then((ether) => {
            setEther(ether);
        })
    });

    const handleTapRedeem = async () => {
        await props.loyalty.redeem();
    }


    return (
        <div className="mt-3">
            <h3 className="card-title">Loyalty Points</h3>
            <p className="card-text mt-3">
                <ul className="list-group">
                    <div class="d-flex justify-content-between align-items-center">
                        <div className="flex-column justify-content-start">
                            <div className="d-flex">
                                <span className="badge bg-info">You have {points} Points 🥳.</span>
                            </div>
                            <div className="d-flex mt-1">
                                <span className="badge bg-primary ">Loyalty Balance: {ether} eth.</span>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => handleTapRedeem()}>Redeem</button>
                    </div>
                </ul>
            </p>
        </div>
    );
}

export default Loyalty;