'use strict';

var piscosour = require('piscosour'),
    Shot = piscosour.Shot,
    logger = piscosour.logger;

var shot = new Shot({
    description : "Brief description of shot",

    check : function(resolve){
        logger.info("#magenta","check","Check all pre-requisites for the execution");
        resolve();
    },

    config : function(resolve){
        logger.info("#magenta","config","Preparing params for main execution");
        resolve();
    },

    run : function(resolve){
        logger.info("#magenta","run","Run main execution");
        resolve();
    },

    prove : function(resolve){
        logger.info("#magenta","prove","Prove that the run execution was ok");
        resolve();
    },

    notify : function(resolve){
        logger.info("#magenta","notify","Recollect all execution information and notify");
        resolve();
    }

});

module.exports = shot;