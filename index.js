require('dotenv').load();
const mysqlConnection = require('./mysql');
const arrayToCSV = require('array-to-csv');
const fs = require('fs');

const getDrivers = () => new Promise((resolve, reject) => {
	mysqlConnection.query('SELECT driver.*, transType, plate FROM driver, transport WHERE driver.driverId = transport.driverId', (err, rows) => {
		if (err) return reject(err);
		if (!rows[0]) {
			return resolve([]);
		}
		let result = [];
		result.push(['ID', 'Name', 'Last name', 'Phone', 'Email', 'Transport type', 'Plate']);
		rows.forEach(row => {
			result.push([
				row.driverId,
				row.name.trim(),
				row.lastName.trim(),
				row.phone.trim(),
				row.email.trim(),
				row.transType,
				row.plate.trim()
			]);
		});
		resolve(result);
	});
});

const getCustomers = () => new Promise((resolve, reject) => {
	mysqlConnection.query('SELECT customer.* FROM customer', (err, rows) => {
		if (err) return reject(err);
		if (!rows[0]) {
			return resolve([]);
		}
		let result = [];
		result.push(['ID', 'Name', 'Last name', 'Phone', 'Email']);
		rows.forEach(row => {
			result.push([
				row.customerId,
				row.name.trim(),
				row.lastName.trim(),
				row.phone.trim(),
				row.email.trim()
			]);
		});
		resolve(result);
	});
});

const toCSV = (list) => {
	return arrayToCSV(list);
};

const main = async () => {
	try {
		// Drivers
		let drivers = await getDrivers();
		let csv = toCSV(drivers);
		fs.writeFileSync('drivers.csv', csv, 'utf8');
		// Customers
		let customers = await getCustomers();
		csv = toCSV(customers);
		fs.writeFileSync('customers.csv', csv, 'utf8');
		console.log("Done");
	} catch (err) {
		console.error(err);
	}
};

main();