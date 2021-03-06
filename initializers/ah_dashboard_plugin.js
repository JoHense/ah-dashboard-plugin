var ah_dashboard_plugin = function(api, next){
  var path = require('path');
  var fs = require('fs');
  var TS = require('redis-timeseries');
  var Tail = require('always-tail');
  var timeSeries = new TS(api.redis.client);
  api.ahDashboard = {};
  api.ahDashboard.timesSeries = timeSeries;
  api.ahDashboard.prevStats = {};

  var logFile = api.config.general.paths.log[0] + path.sep + api.pids.title + '.log';
  if(fs.existsSync(logFile)) {
    api.chatRoom.add("logMessages");
    tail = new Tail(logFile);

    tail.on("line", function (data) {
      api.chatRoom.broadcast({room: "logMessages"}, "logMessages", data.toString());
    });

    tail.on("error", function (error) {
      console.log('ERROR reading log file: ' + error);
    });
  } else {
    console.log('Cant locate log files, log file view in dashboard is disabled.')
  }
  next();
}

/////////////////////////////////////////////////////////////////////
// exports
exports.ah_dashboard_plugin = ah_dashboard_plugin;