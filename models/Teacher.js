var User = require("./User");

module.exports = class Teacher extends User {

	constructor(username, firstName, lastName, email, password) {
		super(username, firstName, lastName, email, password);
	}

}