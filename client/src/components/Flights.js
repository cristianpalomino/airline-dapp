import React from "react";

const Flights = (props) => {

    const handleTapBuy = async (index, value) => {
        await props.buyFlight(index, value)
    }

    return (
        <div>
            <div className="card-body">
                <h3 className="card-title">Flights</h3>
                <p className="card-text mt-3">
                    <ul className="list-group">
                        {props.flights.map((flight, index) => {
                            return <li class="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                <div className="flex-column justify-content-start">
                                    <h6>{flight.name}</h6>
                                    <span className="badge bg-secondary">{'Price: ' + flight.price() + ' eth.'}</span>
                                </div>
                                <button type="button" className="btn btn-primary" onClick={() => handleTapBuy(index, flight.wei)}>Buy</button>
                            </li>
                        })}
                    </ul>
                </p>
            </div>
        </div>
    );
}

export default Flights;