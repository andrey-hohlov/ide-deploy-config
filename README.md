# ide-deploy-config
Ease set / switch deployment config for JetBrains IDE from config file using node CLI.

Tested on:
- PhpStorm 2016.2 @ macOS Sierra 10.12.1 
- PhpStorm 2016.2 @ Windows 10 
- WebStorm 2016.3 @ macOS Sierra 10.12.1 

> Help with testing! Write if it's works or not works in you system.


## Install

Require [Node.js](https://nodejs.org/en/).

```bash
$ npm install ide-deploy-config -g
```


## Usage

### Init project with IDE

`.idea` folder must be created in project root.

### Configure server in IDE
 
0. Go to `Tools - Deployment - Configuration` and create server
0. Set `Name` for server and access data: `FTP host`, `Port`, `Root path`, `Username`,  `Password`

It's all. Mappings and excluded pathes we configure with script.


### Create config .json file

Buy default script search `deploy-config.json` in project root. You can specify path to config file.

```bash
$ cd my-project
$ touch deploy-config.json
```

Also you can run `ide-deploy-config init` for create config file.

Content of `deploy-config.json`:

```json
{
  "dev": {
    "serverName": "serverName",
    "serverPath": "/public_html",
    "localPath": "$PROJECT_DIR$",
    "autoUpload": "Always",
    "autoUploadExternalChanges": true,
    "excludedLocal": [
      "$PROJECT_DIR$/.idea",
      "$PROJECT_DIR$/bower_components",
      "$PROJECT_DIR$/node_modules",
      "$PROJECT_DIR$/deploy-config.json"
    ],
    "excludedServer": [
      "/uploads/"
    ]
  },
  "production": {
    "serverName": "anotherServerName",
    "serverPath": "/public_html",
    "localPath": "$PROJECT_DIR$",
    "autoUpload": "Always",
    "autoUploadExternalChanges": true,
    "excludedLocal": [
       "$PROJECT_DIR$/.idea",
       "$PROJECT_DIR$/bower_components",
       "$PROJECT_DIR$/node_modules",
       "$PROJECT_DIR$/deploy-config.json"
    ],
    "excludedServer": [
      "/uploads/"
    ]
  }
}
```

Set `serverName` that exist in IDE deployment configuration.


### Set / switch deployment configuration

Go to project root and run script:

```bash
  Usage
    $ ide-deploy-config
    $ ide-deploy-config <env>
    $ ide-deploy-config <env> <path to config>

  Example
    $ ide-deploy-config // set first deployment configuration from deploy-config.json
    $ ide-deploy-config production // set 'production' deployment configuration from deploy-config.json
    $ ide-deploy-config stage configs/deploy.json // set 'stage' deployment configuration from configs/deploy.json
```


## License

MIT
