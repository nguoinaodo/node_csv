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
				row.name,
				row.lastName,
				row.phone,
				row.email,
				row.transType,
				row.plate
			]);
		});
		resolve(result);
	});
});

const toCSV = (drivers) => {
	return arrayToCSV(drivers);
};

const main = async () => {
	try {
		let drivers = await getDrivers();
		let csv = toCSV(drivers);
		fs.writeFileSync('drivers.csv', csv);
	} catch (err) {
		console.error(err);
	}
};

main();