/*
 Written by Kevin Gravier <https://github.com/mrkmg>
 Part of the node-docker-test project. <https://github.com/mrkmg/node-docker-test>
 MIT Licence
 */
var Promise, EventEmitter, util, Docker, Commands;

EventEmitter = require('events');
Util         = require('util');
Promise      = require('bluebird');

Docker   = require('./utils/Docker');
Commands = require('./utils/Commands');

Util.inherits(Test, EventEmitter);

function Test(version, name, commands, yarn) {
    this.version  = version;
    this.data     = '';
    this.commands = commands;
    this.name     = name;
    this.yarn     = yarn;
}

Test.prototype.run = function run() {
    var self = this;

    return Promise
        .try(function () {
            var promise  = Docker.runContainerWithCopy(self.name, Commands.test(self.version, self.commands, self.yarn), function (data) {
                self.data += data.toString();
                self.emit('data', data.toString());
            });
            self.process = promise.process;
            return promise;
        })
        .then(function () {
            return {
                version: self.version,
                passed: true
            };
        })
        .catch(function () {
            return {
                version: self.version,
                passed: false
            };
        });
};

Test.prototype.stop = function stop() {
    var self = this;

    if (self.process) {
        self.process.kill('SIGKILL');
    }
};

module.exports = Test;
