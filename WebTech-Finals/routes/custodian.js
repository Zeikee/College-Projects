var express = require('express');

var router = express.Router();

var database = require('../database');

router.get("/", function (request, response, next) {

	response.render('custodian/index')

});

// Load equipmentlist.ejs
router.get("/equipmentlist", function (request, response, next) {

	response.render('custodian/equipmentlist', { title: 'Equipments' });

});

// Load facilitylist.ejs
router.get("/facilitylist", function (request, response, next) {

	response.render('custodian/facilitylist', { title: 'Facilities' });

});

//Load accountlist.ejs
router.get("/accountlist", function (request, response, next) {

	response.render('custodian/accountlist', { title: 'Accounts' });

});

router.post("/action", function (request, response, next) {

	var action = request.body.action;

	// READ Equipment
	if (action == 'fetch') {
		var query = "SELECT * FROM equipment ORDER BY equipmentID ASC";

		database.query(query, function (error, data) {

			response.json({
				data: data
			});

		});
	}

	// ADD Equipment
	if (action == 'Add') {
		var equipmentName = request.body.equipmentName;

		var equipmentQuantity = request.body.equipmentQuantity;

		var Available = request.body.Available;

		var ImagePath = request.body.ImagePath;

		var query = `
			INSERT INTO equipment 
			(equipmentName, equipmentQuantity, Available, ImagePath) 
			VALUES ("${equipmentName}", "${equipmentQuantity}", "${Available}", "${ImagePath}")
			`;

		database.query(query, function (error, data) {

			response.json({
				message: 'Data Added'
			});

		});
	}

	// EDIT Equipment
	if (action == 'fetch_single') {
		var id = request.body.id;

		var query = `SELECT * FROM equipment WHERE equipmentID = "${id}"`;

		database.query(query, function (error, data) {

			response.json(data[0]);

		});
	}

	if (action == 'Edit') {
		var id = request.body.id;

		var equipmentName = request.body.equipmentName;

		var equipmentQuantity = request.body.equipmentQuantity;

		var Available = request.body.Available;

		var ImagePath = request.body.ImagePath;

		var query = `
				UPDATE equipment 
				SET equipmentName = "${equipmentName}", 
				equipmentQuantity = "${equipmentQuantity}", 
				Available = "${Available}", 
				ImagePath = "${ImagePath}" 
				WHERE equipmentID = "${id}"
				`;

		database.query(query, function (error, data) {
			response.json({
				message: 'Data Edited'
			});
		});
	}

	// DELETE Equipment
	if (action == 'delete') {
		var id = request.body.id;

		var query = `DELETE FROM equipment WHERE equipmentID = "${id}"`;

		database.query(query, function (error, data) {

			response.json({
				message: 'Data Deleted'
			});

		});
	}

});

router.post("/facility", function (request, response, next) {

	var action = request.body.action;

	if (action == 'fetch') {
		var query = "SELECT * FROM facility ORDER BY facilityID ASC";

		database.query(query, function (error, data) {

			response.json({
				data: data
			});

		});
	}

	// ADD Facility
	if (action == 'Add') {
		var facilityName = request.body.facilityName;

		var roomNumber = request.body.roomNumber;

		var availableDate = request.body.availableDate;

		var availableTime = request.body.availableTime;

		var otherInfo = request.body.otherInfo;

		var query = `
			INSERT INTO facility 
			(facilityName, roomNumber, availableDate, availableTime, otherInfo) 
			VALUES ("${facilityName}", "${roomNumber}", "${availableDate}", "${availableTime}", "${otherInfo}")
			`;

		database.query(query, function (error, data) {

			response.json({
				message: 'Data Added'
			});

		});
	}


	// EDIT Facility
	if (action == 'fetch_single') {
		var id = request.body.id;

		var query = `SELECT * FROM facility WHERE facilityID = "${id}"`;

		database.query(query, function (error, data) {

			response.json(data[0]);

		});
	}

	if (action == 'Edit') {
		var id = request.body.id;

		var facilityName = request.body.facilityName;

		var roomNumber = request.body.roomNumber;

		var availableDate = request.body.availableDate;

		var availableTime = request.body.availableTime;

		var otherInfo = request.body.otherInfo;

		var query = `
				UPDATE facility 
				SET facilityName = "${facilityName}", 
				roomNumber = "${roomNumber}", 
				availableDate = "${availableDate}", 
				availableTime = "${availableTime}", 
				otherInfo = "${otherInfo}" 
				WHERE facilityID = "${id}"
				`;

		database.query(query, function (error, data) {
			response.json({
				message: 'Data Edited'
			});
		});
	}

	// DELETE Facility
	if (action == 'delete') {
		var id = request.body.id;

		var query = `DELETE FROM facility WHERE facilityID = "${id}"`;

		database.query(query, function (error, data) {

			response.json({
				message: 'Data Deleted'
			});

		});
	}
});

router.post("/account", function (request, response, next) {

	var action = request.body.action;

	if (action == 'fetch') {
		var query = "SELECT * FROM user ORDER BY userId ASC";

		database.query(query, function (error, data) {

			response.json({
				data: data
			});

		});
	}

	// ADD Account
	if (action == 'Add') {
		var emailAddress = request.body.emailAddress;

		var password = request.body.password;

		var firstName = request.body.firstName;

		var lastName = request.body.lastName;

		var userType = request.body.userType;

		var suspended = request.body.suspended;

		var query = `
			INSERT INTO user 
			(emailAddress, password, firstName, lastName, userType, suspended) 
			VALUES ("${emailAddress}", "${password}", "${firstName}", "${lastName}", "${userType}", "${suspended}")
			`;

		database.query(query, function (error, data) {

			response.json({
				message: 'Data Added'
			});

		});
	}


	// EDIT Account
	if (action == 'fetch_single') {
		var id = request.body.id;

		var query = `SELECT * FROM user WHERE userId = "${id}"`;

		database.query(query, function (error, data) {

			response.json(data[0]);

		});
	}

	if (action == 'Edit') {
		var id = request.body.id;

		var emailAddress = request.body.emailAddress;

		var password = request.body.password;

		var firstName = request.body.firstName;

		var lastName = request.body.lastName;

		var userType = request.body.userType;

		var suspended = request.body.suspended;

		var query = `
				UPDATE user
				SET emailAddress = "${emailAddress}", 
				password = "${password}", 
				firstName = "${firstName}", 
				lastName = "${lastName}", 
				userType = "${userType}", 
				suspended = "${suspended}" 
				WHERE userId = "${id}"
				`;

		database.query(query, function (error, data) {
			response.json({
				message: 'Data Edited'
			});
		});
	}

	// DELETE Account
	if (action == 'delete') {
		var id = request.body.id;

		var query = `DELETE FROM user WHERE userId = "${id}"`;

		database.query(query, function (error, data) {

			response.json({
				message: 'Data Deleted'
			});

		});
	}
});

module.exports = router;