var Handler = require("./Handler");

module.exports = class User {

	#username;
	#firstName;
	#lastName;
	#email;
	#password;

	constructor(username, firstName, lastName, email, password) {
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
	}


	//Create new user

	create(connection) {

		let errorCode = -1;

		if (true) {

			//Failed techniques to access data using async queries
			//Note - accessing the data actually works, I just cannot figure out how to reintroduce the data back into the sync flow/into local variables...
			//The info is only available inside those statements and I'm not sure if that is how it's supposed to be or if there is another way
			//The goal was to only run the insertion query only if the other query arrays came back with a length of 0
			//The purpose of the error code was to redirect to different pages on server.js or maybe produce different messages depending on the query results

			
			let usernameResults = [];
			let emailResults = [];
			
			const usernames = new Promise(resolve => {

				connection.query('SELECT username FROM user WHERE username = ?', [this.username], function (error, results, fields) {
					console.log("Got user matches");
					resolve(results);
				});

			});

			const emails = new Promise(resolve => {

				connection.query('SELECT email FROM user WHERE email = ?', [this.email], function (error, results, fields) {
					console.log("Got email matches");
					resolve(results);
				});

			});


			Promise.all([usernames, emails]).then(result => {

				console.log(result[0], result[0].length);
				console.log(result[1], result[1].length);

			});

			//The goal was to only run this query if the query arrays came back with a length of 0
			connection.query('INSERT INTO user (username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)', [this.username, this.firstName, this.lastName, this.email, this.password], function (error, results, fields) {
				errorCode = 0; //Does nothing because the method is async
			});

			/*if (usernameResults === undefined && emailResults === undefined) {

				connection.query('INSERT INTO user (username, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)', [this.username, this.firstName, this.lastName, this.email, this.password], function (error, results, fields) {
					errorCode = 0;
				});

			}*/

		}

		connection = null;

		return errorCode;
	}


	//Get methods

	getUsername() {
		return this.username;
	}
	getFirstName() {
		return this.firstName;
	}
	getLastName() {
		return this.lastName;
	}
	getEmail() {
		return this.username;
	}
	getPassword() {
		return this.password;
	}


	//Set methods

	setUsername(username) {
		this.username = username;
	}
	setFirstName(firstName) {
		this.firstName = firstName;
	}
	setLastName(lastName) {
		this.lastName = lastName;
	}
	setEmail(email) {
		this.email = email;
	}
	setPassword(password) {
		this.password = password;
	}


	//Boolean methods - For some reason, the argument variables show up as undefined and cause errors
	/*
	static isUsername(username) {

		//Checks for 4 characters
		//Can contain A-Z, number, underscore
		var regex = /^[a-zA-Z0-9_]{4,}$/;

		if username.search(regex) > -1 {
			return true;
		} else {
			return false;
		}

	}

	static isEmail(email) {

		var regex = /^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9-]+)[.]([a-zA-Z0-9.]+)$/;

		if email.search(regex) > -1 {
			return true;
		} else {
			return false;
		}

	}

	static isPassword(pass) {

		//Cannot contain any of those characters (backslash, slash, any kind of bracket, quotes, ~, `)
		//Checks for 8 characters
		//DOES NOT check for one upper and one lowercase
		var regex = /^([^=`~\/{}\[\]<>\"\']{8,})$/;

		if pass.search(regex) > -1 {
			return true;
		} else {
			return false;
		}

	}
	*/
}