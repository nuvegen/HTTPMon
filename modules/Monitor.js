const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

class Monitor {
  monitors = [];

  struct_request = {
    'monitorId': '',
    'datetime': '',
    'remoteAddress': '',
    'remotePort': '',
    'remoteSocket': ''
  }

  constructor() {    
    db.defaults( {
      monitors: [],
      requests: [],
      data: []
    }).write();
  }

  clearDB() {

  }

  setMonitor( monitorInfo ) {
    db.get('monitors').remove( { 'id': monitorInfo.id }).write();
    db.get('monitors').push(monitorInfo).write();

  }

  addRequest( requestInfo ) {
    db.get('requests').push( requestInfo ).write();
  }

  addData( dataInfo ) {
    db.get('data').push( dataInfo ).write();
  }

}


module.exports = Monitor;