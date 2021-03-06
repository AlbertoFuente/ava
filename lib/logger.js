'use strict';

function Logger() {
	if (!(this instanceof Logger)) {
		return new Logger();
	}

	Object.keys(Logger.prototype).forEach(function (key) {
		this[key] = this[key].bind(this);
	}, this);
}

module.exports = Logger;

Logger.prototype.use = function (reporter) {
	this.reporter = reporter;
	this.reporter.api = this.api;
};

Logger.prototype.start = function () {
	if (!this.reporter.start) {
		return;
	}

	this.write(this.reporter.start());
};

Logger.prototype.test = function (test) {
	this.write(this.reporter.test(test));
};

Logger.prototype.unhandledError = function (err) {
	if (!this.reporter.unhandledError) {
		return;
	}

	this.write(this.reporter.unhandledError(err));
};

Logger.prototype.finish = function () {
	if (!this.reporter.finish) {
		return;
	}

	this.write(this.reporter.finish());
};

Logger.prototype.write = function (str) {
	if (typeof str === 'undefined') {
		return;
	}

	this.reporter.write(str);
};

Logger.prototype.exit = function (code) {
	// TODO: figure out why this needs to be here to
	// correctly flush the output when multiple test files
	process.stdout.write('');
	process.stderr.write('');

	// timeout required to correctly flush IO on Node.js 0.10 on Windows
	setTimeout(function () {
		process.exit(code);
	}, process.env.AVA_APPVEYOR ? 500 : 0);
};
