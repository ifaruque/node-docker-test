var Config, Promise, Blessed, Commands, Docker, VersionKeywords;

Promise = require('bluebird');
Blessed = require('blessed');

Commands = require('../Commands');
Config = require('../Config');
Docker = require('../Docker');
VersionKeywords = require('../VersionKeywords');

module.exports = Setup;

function Setup()
{
    return Promise.try(function ()
    {
        return VersionKeywords(Config.versions);
    }).then(function (versions)
    {
        return Docker.makeNew('ndt:' + Config.name, Commands.setup(versions), function (data)
        {
            process.stdout.write(data.toString());
        });
    });
}