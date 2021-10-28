// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Airline {

    uint etherPerPoint = 0.5 ether;
    
    struct Flight {

        string name;
        uint price;
    }

    struct Customer {

        uint loyaltyPoints;
        uint totalFlights;
    }

    address public owner;
    Flight[] public flights;
    mapping (address => Customer) public customers;
    mapping (address => Flight[]) public customerFlights;
    mapping (address => uint) public customerTotalFlights;

    event FlightPurchased(address indexed customer, string name, uint price);

    constructor() public {
        owner = msg.sender;
        flights.push(Flight('Saint Petersburg', 10 ether));
        flights.push(Flight('Moscow', 11 ether));
        flights.push(Flight('Berlin', 8 ether));
        flights.push(Flight('Milan', 9 ether));
        flights.push(Flight('Madrid', 6 ether));
        flights.push(Flight('Amsterdam', 7 ether));
    }

    function buyFlight(uint index) public payable {
        Flight memory flight = flights[index];
        require(msg.value == flight.price);
        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender]++;
        emit FlightPurchased(msg.sender, flight.name, flight.price);
    }

    function totalFlights() public view returns (uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints() public { 
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        return address(this).balance;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
}
