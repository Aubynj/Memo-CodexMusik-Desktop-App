var Datastore = require('nedb');

var db = {};
db.project = new Datastore({ filename: 'Db/project.json', corruptAlertThreshold: 1 ,autoload: true });
db.users = new Datastore({ filename: 'Db/db.json', corruptAlertThreshold: 1 ,autoload: true });

module.exports = db;