import React from "react";

const MyFlights = (props) => {
    return (
        <div className="mt-4">
            <h3 className="card-title">My Flights</h3>
            <ul className="list-group">
                {props.myFlights.map((flight, index) => {
                    return <div class="d-flex justify-content-between align-items-center" key={index}>
                        <h6>{flight.name}</h6>
                        <span className="badge bg-secondary">{'Price: ' + flight.price() + ' eth.'}</span>
                    </div>
                })}
            </ul>
        </div>
    );
}

export default MyFlights;