class LSUVGS {
	constructor(id, username, state, data) {
		this.id = id;
		this.username = username;
		this.state = state;
		this.data = data;
		this.timeoutStatus = 0;
		this.requestTimeout = 0;
	}

	Reset() {
		this.state = 'default';
		this.data = null;
		this.timeoutStatus = 0;
	}

	Timeout() {
		this.requestTimeout = setTimeout(function() {this.timeoutStatus = 1; console.log("expired");}, 60000);
	}

	OnNewMessage() {
		// If there is a pending timeout for the user, cancel it.
		if (this.requestTimeout && this.timeoutStatus == 0) {
			clearTimeout(this.requestTimeout);
			this.requestTimeout = 0;
		}
	}

	ChangeState(poststate, data) {
		this.state = poststate;
		data != null ? this.data = data : "";
		this.Timeout();
	}
}

module.exports = LSUVGS