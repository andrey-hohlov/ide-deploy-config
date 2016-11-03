/**
 * Expose `cli`
 */

exports.cli = cli;

function makeConfigString(config) {
  var configString;

  configString =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<project version="4">' +
    '<component name="PublishConfigData" promptOnRemoteOverwrite="CHECK_CONTENT" serverName="'+config.serverName+'" autoupload="'+config.autoUpload+'" autoUploadExternalChanges="'+config.autoUploadExternalChanges+'" notifyRemoteChanges="true">' +
    '<serverData>' +
    '<paths name="'+config.serverName+'">' +
    '<serverdata>' +
    '<mappings>' +
    '<mapping deploy="'+config.serverPath+'" local="'+config.localPath+'" web="/" />' +
    '</mappings>' +
    '<excludedPaths>';

  for (var i = 0; i<config.excludedLocal.length; i++) {
    configString += '<excludedPath local="true" path="'+config.excludedLocal[i]+'" />'
  }

  for (var k = 0; k<config.excludedServer.length; k++) {
    configString += '<excludedPath path="'+config.excludedServer[k]+'" />'
  }

  configString +=
    '</excludedPaths>' +
    '</serverdata>' +
    '</paths>' +
    '</serverData>' +
    '</component>' +
    '</project>';

  return configString;
}

/**
 * Run
 * idea-deploy-config env [config]
 */

function cli() {
  var fs = require('fs');
  var args = process.argv.slice(2);
  var env = args[0];
  var configSrc = args[1] || process.cwd() + '/deploy-config.json';

  fs.readFile(configSrc, 'utf8', function(err, data) {
    if (err) throw err;

    var config = JSON.parse(data);

    if (!env) {
      env = Object.keys(config)[0];
      console.log('No environment set, use "' + env + '"');
      config = config[env];
    } else {
      config = config[env];
    }

    if (!config) {
      throw new Error('Сonfig for ' + env +' could not be found');
    }

    var configString = makeConfigString(config);

    var configFolder = process.cwd() + '/.idea';
    var configFile = configFolder + '/deployment.xml';

    fs.stat(configFolder, function(err, stats) {
      if (err) throw err;

      fs.writeFile(configFile, configString, { flag: 'w' }, function (err) {
        if (err) throw err;
        console.log('IDE deployment config set for "' + env + '"');
      });
    });

  });
}
