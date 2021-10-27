const Airline = artifacts.require('Airline')

let instance

beforeEach(async () => {
    instance = await Airline.new()
})

contract('Airline', (accounts) => {
    it('should have available flights', async () => {
        const total = await instance.totalFlights()
        assert(total > 0)
    })

    it('should allow customer buy flights providing its value', async () => {
        const account = accounts[0]
        const flight = await instance.flights(0);
        const name = flight[0];
        const price = flight[1];
        await instance.buyFlight(0, { from: account, value: price });
        const customerFlights = await instance.customerFlights(account, 0);
        const customerTotalFlights = await instance.customerTotalFlights(0);
        assert(customerFlights[0], name);
        assert(customerFlights[1], price);
        assert(customerTotalFlights, 1);
    })

    it('should not allow customer buy flights under the price', async () => {
        const account = accounts[0]
        const flight = await instance.flights(0);
        const price = flight[1] - 5000;
        try {
            await instance.buyFlight(0, { from: account, value: price });
        } catch (e) {
            return;
        }
        assert.fail();
    })

    it('should get the real contract balance', async () => {
        const account = accounts[0]
        const totalFlights = await instance.totalFlights();
        let localBalance = 0
        for (let i = 0; i < totalFlights; i++) {
            const flight = await instance.flights(i);
            const price = flight[1];
            await instance.buyFlight(i, { from: account, value: price });
            localBalance += price;
        }
        const balance = await instance.getAirlineBalance();
        assert(localBalance, balance);
    })

    it('should allow customers to redeem loyalty points', async () => {
        const account = accounts[0]
        const flight = await instance.flights(1);
        const name = flight[0];
        const price = flight[1];
        await instance.buyFlight(1, { from: account, value: price });
        const balance1 = await web3.eth.getBalance(account);
        await instance.redeemLoyaltyPoints({ from: account });
        const balance2 = await web3.eth.getBalance(account);
        const customer = await instance.customers(account);
        const loyaltyPoints = customer[0];
        assert(loyaltyPoints, 0);
        assert(balance2 >= balance1);
    })
})