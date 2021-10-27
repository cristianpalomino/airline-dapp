import React from "react";

function Flights(props) {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h3 className="card-title">Flights</h3>
                <p className="card-text mt-3">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">City</th>
                                <th scope="col">Price</th>
                            </tr>
                        </thead>
                        {props.flights.map((flight) => {
                            return <tbody>
                                <td>{flight.name}</td>
                                <td>{flight.price}</td>
                                <td>
                                    <button type="button" className="btn btn-primary">Buy</button>
                                </td>
                            </tbody>
                        })}
                    </table>
                </p>
            </div>
        </div>
    );
}

export default Flights;