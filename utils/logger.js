const fs = require('fs');

class Logger {
	constructor(file) {
		this.file = file;
	}

	Log(title, desc) {
		let str = Date().toLocaleString() + ` ${title}`;

		if(desc)
			str += `: ${desc}`;

		str += `\n`;

		fs.appendFile(this.file, str, err => console.log(str));
	}
}

module.exports = Logger;