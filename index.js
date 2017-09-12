/**
 * Convert config object to string with xml
 * @param config
 * @returns {string}
 */
function makeConfigString(config) {
  const serverName = config.serverName; // eslint-disable-line prefer-destructuring
  const autoUpload = config.autoUpload || false;
  const autoUploadExternalChanges = config.autoUploadExternalChanges || false;
  const notifyRemoteChanges = config.notifyRemoteChanges || false;

  const excludedLocal = [];
  const excludedServer = [];
  const mappings = [];

  if (config.excludedLocal) {
    config.excludedLocal.forEach((item) => {
      excludedLocal.push(`<excludedPath local="true" path="${item}" />`);
    });
  }

  if (config.excludedServer) {
    config.excludedServer.forEach((item) => {
      excludedServer.push(`<excludedPath path="${item}" />`);
    });
  }

  if (config.mappings) {
    config.mappings.forEach((item) => {
      mappings.push(`<mapping deploy="${item.deploy}" local="${item.local}" web="${item.web || ''}" />`);
    });
  }

  // 0.1.1 deprecation warning
  if (config.serverPath && config.localPath) {
    console.warn('Options "serverPath" and "localPath" is deprecated! Use mappings options.');
    mappings.push(`<mapping deploy="${config.serverPath}" local="${config.localPath}" web="" />`);
  }

  if (!serverName) {
    console.warn('Option "serverName" is not specified.');
  }

  if (mappings.length === 0) {
    console.warn('Mappings are not specified.');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
    <project version="4">
      <component name="PublishConfigData" promptOnRemoteOverwrite="CHECK_CONTENT" serverName="${serverName}" autoUpload="${autoUpload}" autoUploadExternalChanges="${autoUploadExternalChanges}" notifyRemoteChanges="${notifyRemoteChanges}">
        <serverData>
          <paths name="${serverName}">
            <serverdata>
              <mappings>
                 ${mappings.join('\n')}
              </mappings>
              <excludedPaths>
                ${excludedLocal.join('\n')}
                ${excludedServer.join('\n')}
              </excludedPaths>
            </serverdata>
          </paths>
        </serverData>
      </component>
    </project>
  `;
}

/**
 * Run
 * idea-deploy-config env [config]
 */
function cli() {
  const fs = require('fs');
  const args = process.argv.slice(2);
  const configSrc = args[1] || `${process.cwd()}/deploy-config.json`;
  let env = args[0];

  if (env === 'init') {
    console.log('Create empty deployment configuration file');
    fs.createReadStream(`${__dirname}/deploy-config-example.json`).pipe(fs.createWriteStream(`${process.cwd()}/deploy-config.json`));
    return;
  }

  fs.readFile(configSrc, 'utf8', (err, data) => {
    if (err) throw err;

    let config = JSON.parse(data);

    if (!env) {
      env = Object.keys(config)[0]; // eslint-disable-line prefer-destructuring
      console.log(`No environment set, use "${env}"`);
      config = config[env];
    } else {
      config = config[env];
    }

    if (!config) {
      throw new Error(`Configuration for ${env} could not be found`);
    }

    const configString = makeConfigString(config);
    const configFolder = `${process.cwd()}/.idea`;
    const configFile = `${configFolder}/deployment.xml`;

    fs.stat(configFolder, (err) => {
      if (err) throw err;

      fs.writeFile(configFile, configString, { flag: 'w' }, (err) => {
        if (err) throw err;
        console.log(`IDE deployment configuration set for "${env}"`);
      });
    });
  });
}

exports.cli = cli;
