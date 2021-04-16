var mysql = require('mysql');

module.exports = class Handler {

	// DB handler actions

	static connect() {
		var connection = mysql.createConnection({
			host: "localhost", 
			user: "root",
			password: "",
			database: "homemath"
		});

		connection.connect();

		return connection;
	}

	static terminate(connection) {
		connection.end();
	}

}

//Abandoned attempt to "promisify" the handler because I'm not sure if I should change it now as I don't understand this completely

/*

var mysql = require('mysql');

module.exports = class Handler {

	// DB handler actions

	static connect() {
		var connection = mysql.createConnection({
			host: "localhost", 
			user: "root",
			password: "",
			database: "homemath"
		});

		connection.connect();

		return connection;
	}

	query(sql, args) {
		return new Promise((resolve, reject) => {

		    this.connection.query(sql, args, (err, rows) => {
		        if (err)
		            return reject(err);
		        resolve(rows);
		    });
		    
		});
    }

	terminate(connection) {
		return new Promise((resolve, reject) => {

			connection.end(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});

		});
	}

}

*/