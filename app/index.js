'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var fs = require('fs');

var utils = {

  validatePrompt : function(txt){
    return function(userInput){
      return userInput ? true : '"'+txt+'" is required. ';
    };
  },


  sanitize: function (userInput) {
    var regExp = new RegExp(' ', 'g');
    return userInput.toLowerCase().replace(regExp, '-');
  },

  cellsYoSay: function () {
    console.log();
    console.log(chalk.yellow("                                                            "));
    console.log(chalk.yellow("                                      &  &&%%%%%%%%%%%%%%%  "));
    console.log(chalk.yellow("                                    /*  &                   "));
    console.log(chalk.yellow("        .%&&&&                     &  &                     "));
    console.log(chalk.yellow("     &&    &&/   %&(              &  &                      "));
    console.log(chalk.yellow("   &&  .  &      &  &           &  .,                       "));
    console.log(chalk.yellow("  &/,  #     &  (  & &%        &  &                         "));
    console.log(chalk.yellow(" && #    & &  &    /  &       %  &                          "));
    console.log(chalk.yellow(" & %     &&& &&,      &&&&&&&  &                            "));
    console.log(chalk.yellow(" &/ & &&  &.&&  ..& &    &  &    &,                         "));
    console.log(chalk.yellow("  & &   *  % * &      &&&&&&&&&&&   &                       "));
    console.log(chalk.yellow("  ,&  /      (   &/ .&             ,                        "));
    console.log(chalk.yellow("    && %.%&   & &  &&              &                        "));
    console.log(chalk.yellow("      &&(.     &&&                 &                        "));
    console.log(chalk.yellow("            &                      &                        "));
    console.log(chalk.yellow("            &                      &                        "));
    console.log(chalk.yellow("           (                        %                       "));
    console.log(chalk.yellow("           &                        &                       "));
    console.log(chalk.yellow("          &                          &                      "));
    console.log(chalk.yellow("          &                          &                      "));
    console.log(chalk.yellow("         ./         PISCOSOUR        ./                     "));
    console.log(chalk.yellow("         &                            &                     "));
    console.log(chalk.yellow("         &                            &                     "));
    console.log(chalk.yellow("          (                          %.                     "));
    console.log(chalk.yellow("          &                          &                      "));
    console.log(chalk.yellow("           &                        %                       "));
    console.log(chalk.yellow("            &&                    #&                        "));
    console.log(chalk.yellow("              &&&              %%&                          "));
    console.log(chalk.yellow("                (&&&&&&&&&&&&&%&                            "));
    console.log(chalk.yellow("                   &        %.                              "));
    console.log(chalk.yellow("                     &    %                                 "));
    console.log(chalk.yellow("                     *    &                                 "));
    console.log(chalk.yellow("                      ,                                     "));
    console.log(chalk.yellow("                      &  *                                  "));
    console.log(chalk.yellow("                      %  ,                                  "));
    console.log(chalk.yellow("                                                            "));
    console.log(chalk.yellow("                     &    &                                 "));
    console.log(chalk.yellow("                    &  ..  &                                "));
    console.log(chalk.yellow("               %.               &                           "));
    console.log(chalk.yellow("               &&              &&                           "));
    console.log(chalk.yellow("                  &&&&&&&&&&&&                              "));
  }
};

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.option('recipeName', { type: String, required: true });
    this.option('cmd', { type: String, required: true });
    this.option('description', { type: String, required: false });
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
      console.log(chalk.cyan('\nWelcome to the Piscosour Recipe Generator! v.' + this.pkg.version + '\n'));
    }

    var prompts = [
      {
        type: 'input',
        name: 'recipeName',
        message: 'Write a name for your pisco recipe',
        validate: utils.validatePrompt("recipe name"),
        when: function () {
          return !this.options.recipeName;
        }.bind(this)
      },{
        type: 'input',
        name: 'cmd',
        message: 'Write the command line executable for this pisco recipe',
        validate: utils.validatePrompt("command line"),
        when: function () {
          return !this.options.cmd;
        }.bind(this)
      }, {
        type: 'input',
        name: 'description',
        message: 'Write a brief description for your recipe',
        when: function () {
          return !this.options.cmd;
        }.bind(this)
      }
    ];

    this.prompt(prompts, function (answers) {
        this.recipeName = answers.recipeName?answers.recipeName:this.options.recipeName;
        this.cmd = answers.cmd?answers.cmd:this.options.cmd;
        this.description = answers.description?answers.description:this.options.description;
        done();
    }.bind(this));

  },

  writing: {

    createRecipe: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('Jenkinsfile', 'Jenkinsfile');
      this.copy('package.json', 'package.json');
      this.copy('piscosour.json', 'piscosour.json');
      this.copy('README.md', 'README.md');
      this.directory('bin','bin');
    }

  },

  install: function () {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  },

  end: function () {
    this.log(chalk.green('Piscosour Recipe generator finished'));
  }
});
