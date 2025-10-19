const mysql = require('mysql');

var connection = mysql.createConnection({
	host : '127.0.0.1',
	database : 'lenditrocky',
	user : 'root',
	password : ''
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;