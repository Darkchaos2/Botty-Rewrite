const fs = require('fs');

class Logger {
	constructor(file) {
		this.file = file;
	}

	Log(title, desc) {
		let str = Date().toLocaleString() + ` ${title}`;

		if(desc)
			str += `: ${desc}`;

		fs.appendFile(this.file, str + `\n`, err => console.log(str));
	}
}

module.exports = Logger;