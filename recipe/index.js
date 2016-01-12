'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var cellsConfig = require('./cells-config.js');
var chalk = require('chalk');
var fs = require('fs');

var utils = {
  validateAppName: function (userInput) {
    return userInput ? true : 'Please enter a name';
  },

  sanitize: function (userInput) {
    var regExp = new RegExp(' ', 'g');
    return userInput.toLowerCase().replace(regExp, '-');
  },

  getComponentName: function (userInput) {
    var pieces = userInput.split('/');
    var len = pieces.length;
    return pieces[len - 1].split('.git')[0];
  },

  validateUrl: function(userInput){
    if(userInput === 'localhost'){
      return true;
    } else {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(userInput);
    }
  },

  cellsYoSay: function () {
    console.log();
    console.log(chalk.blue("                               /////////////"));
    console.log(chalk.blue("                            //////////////////"));
    console.log(chalk.blue("                          //////////////////////"));
    console.log(chalk.blue("                         ////////////////////////"));
    console.log(chalk.blue("        //////////////////////////      //////////"));
    console.log(chalk.blue("      //////////////////////////          ////////"));
    console.log(chalk.blue("    ///////////////////////////            ///////"));
    console.log(chalk.blue("  ////////////////////////////            ////////"));
    console.log(chalk.blue(" ///////////                             /////////"));
    console.log(chalk.blue("/////////                      //////////////////"));
    console.log(chalk.blue("////////       ////          ///////////////////"));
    console.log(chalk.blue("///////      ////////       //////////////////"));
    console.log(chalk.blue("///////      ////////      /////////////////"));
    console.log(chalk.blue("////////      //////       ////////"));
    console.log(chalk.blue("////////                  //////// "));
    console.log(chalk.blue("/////////               /////////"));
    console.log(chalk.blue("//////////          ///////////"));
    console.log(chalk.blue("/////////////////////////////"));
    console.log(chalk.blue("    //////////////////////////"));
    console.log(chalk.blue("      //////////////////////"));
    console.log(chalk.blue("          //////////////"));
  },

  readComponentsFromComposer: function (src) {

    function getItem(propertyName) {
      return function (item) {
        return item[propertyName];
      }
    }

    function pluck(propertyName, arr) {
      return arr.map(getItem(propertyName));
    }

    var bowerComponentsFromComposer = JSON.parse(fs.readFileSync(src, 'utf8')).bowerComponents;

    return pluck('value', bowerComponentsFromComposer);

  }
};

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.option('appName', { type: String, required: false });
    this.option('bowerComponents', { type: String, required: false });
    this.option('includeCellsCordova', { type: Boolean, required: false });
    this.option('remoteContent',{type:String, required: false});
    this.sourceRoot(path.join(path.dirname(this.resolved), 'templates/'));
  },
  initializing: function () {
    // get package.json content
    this.pkg = require('../package.json');
    this.destinationFolder = this.destinationRoot();
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    if (!this.options['skip-welcome-message']) {
      utils.cellsYoSay();
      this.log(chalk.blue('\nWelcome to the Cells Starter Kit generator! v.' + this.pkg.version + '\n'));
    }

    var prompts = [
      // appName
      {
        type: 'input',
        name: 'appName',
        message: 'Choose a name for your project (this name will be displayed below the app icon)',
        validate: utils.validateAppName,
        when: function () {
          // Show this prompt only if appName is not already set
          return !this.appName;
        }.bind(this)
      }, {
        type: 'checkbox',
        name: 'bowerComponents',
        message: 'Select all bower components you want to install',
        choices: cellsConfig.bowerComponents
      },
      {
        type: 'confirm',
        name: 'includeCellsCordova',
        message: 'Do you want to add a scaffolding for cordova project?',
        default: false
      },
      {
        type: 'input',
        name: 'remoteContent',
        message: 'Enter the remote server where to find the components and configFile app',
        validate: utils.validateUrl,
        default: 'localhost'
      }
    ];

    if (!this.options.appName) {
      this.prompt(prompts, function (answers) {
        this.appName = answers.appName;
        this.bowerComponents = answers.bowerComponents;
        this.includeCellsCordova = answers.includeCellsCordova;
        this.remoteContent = answers.remoteContent;
        done();
      }.bind(this));
    } else {
      this.appName = this.options.appName;
      this.bowerComponents = utils.readComponentsFromComposer(this.options.bowerComponents);
      this.includeCellsCordova = (this.options.includeCellsCordova === "true") ? true : false;
      this.remoteContent = this.options.remoteContent;
      done();
    }
  },

  writing: {

    createAppProject: function () {

      if (this.includeCellsCordova) {
        this.mkdir('app');
        this.destinationRoot('app/');
      }
      this.copy('.editorconfig', '.editorconfig');
      this.copy('.bowerrc', '.bowerrc');
      this.copy('.gitattributes', '.gitattributes');
      this.copy('gulpfile.js', 'gulpfile.js');

      this.copy('gitignore', '.gitignore');

      this.copy('.jscsrc', '.jscsrc');
      this.copy('.jshintrc', '.jshintrc');

      this.copy('bower.json', 'bower.json', function (file) {
        var manifest = JSON.parse(file);
        var componentName = '';
        if (this.bowerComponents) {
          for (var i = 0, len = this.bowerComponents.length; i < len; i++) {
            componentName = utils.getComponentName(this.bowerComponents[i]);
            manifest.dependencies[componentName] = this.bowerComponents[i];
          }
        }
        manifest.name = this.appName;
        return JSON.stringify(manifest, null, 2);
      }.bind(this));

      this.copy('package.json', 'package.json', function (file) {
        var manifest = JSON.parse(file);
        manifest.name = utils.sanitize(this.appName);
        return JSON.stringify(manifest, null, 2);
      }.bind(this));

      this.copy('README.md', 'README.md');

      this.mkdir('app');
      this.directory('app', 'app');

      this.mkdir('tasks');
      this.directory('tasks', 'tasks');


      var remoteHost = '';
      if(this.remoteContent !== 'localhost') {
        if(this.remoteContent.substr(this.remoteContent.length - 1) !== '/') {
          this.remoteContent = this.remoteContent.concat('/');
        }
        remoteHost = this.remoteContent;
      }
      //Construction of files based on user answers.
      var dataConfig = {
        host:remoteHost
      };
      // app.js configuration
      var appFile = path.join(path.dirname(this.resolved), 'templates/app/scripts/') + 'app.js';
      this.template(appFile, 'app/scripts/app.js',dataConfig , null);
      //configFile.json configuration
      var configFile = path.join(path.dirname(this.resolved), 'templates/app/config/') + 'configFile.json';
      this.template(configFile, 'app/config/configFile.json',dataConfig , null);
    },

    createCordovaProject: function () {
      if (this.includeCellsCordova) {
        this.destinationRoot(this.destinationFolder);
        this.log(chalk.green('Creating cordova project'));
        this.composeWith('cells-cordova', {
          options: {
            'skip-welcome-message': true
          }
        }).on('end', function () {
          this.log(chalk.green('Cordova project created'));
        });
      }
    }

  },

  install: function () {
    if (this.includeCellsCordova) {
      process.chdir('app');
    }
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  },
  end: function () {
    this.log(chalk.green('Cells starter kit generator finished'));
  }
});