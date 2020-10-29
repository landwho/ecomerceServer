const oracledb = require('oracledb');

db ={
    user: 'landwho',
    password: 'jubico25',
    connectString : "localhost/orclXDB"
}

 async function checkConnection() {
    try {
      connection =  oracledb.getConnection(db);
      console.log('connected to database');
    } catch (err) {
      console.error(err.message);
    } 
}
  
checkConnection();

module.exports = oracledb;