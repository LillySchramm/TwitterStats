const mysql = require("mysql");

let dbConfig = {
  connectionLimit: 100,
  host: '0.0.0.0',
  user: 'admin',
  password: '1111'
}

const pool = mysql.createPool(dbConfig);

const connection = () => {
  return new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) reject(err);
    console.log("MySQL pool connected: threadId " + connection.threadId);
    const query = (sql, binding) => {
      return new Promise((resolve, reject) => {
         connection.query(sql, binding, (err, result) => {
           if (err) reject(err);
           resolve(result);
           });
         });
       };
       const release = () => {
         return new Promise((resolve, reject) => {
           if (err) reject(err);
           console.log("MySQL pool released: threadId " + connection.threadId);
           resolve(connection.release());
         });
       };
       resolve({ query, release });
     });
   });
 };
 
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {    
    pool.query(sql, binding, (err, result, fields) => {            
      if (err) console.log(err);
      var resultArray = JSON.parse(JSON.stringify(result))      
      resolve(resultArray);
    });
  });
};

const doesDatabaseExist = db_name => {
  return new Promise((resolve, reject) => {

    query("SHOW DATABASES WHERE `Database` = '" + db_name + "';").then(function (v){    
      resolve(!isRSempty(v));        
    })
  })
}

const doesTableExist = (table_name) => {
  return new Promise((resolve, reject) => {
    query("SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = '" + table_name +"'").then(function (v){    
      resolve(!isRSempty(v));        
    })
  });
}

const createTable = (db_name, table_name, constructor) => {
  return new Promise((resolve, reject) => {
    query("CREATE TABLE `" + db_name + "`.`" + table_name + "` ("+ constructor +") ENGINE = InnoDB;");
    console.log("Created table '" + db_name + "'.'" + table_name + "'");
  });
}

const createTablefNotExist = (db_name, table_name, constructor) => {
  return new Promise((resolve, reject) => {
    doesTableExist(table_name).then((res) => {
      if(!res){
        createTable(db_name, table_name, constructor)
      }else{
        console.log(db_name + "." + table_name + " already exists!");
      }
    });
  });
}

const createDatabaseIfNotExist = db_name => {
  return new Promise((resolve, reject) => {
    doesDatabaseExist(db_name).then(res =>{
      if(!res){
        query("CREATE DATABASE " + db_name).then(() => {
          console.log("Created database '" + db_name + "'!");
        });      
      }else{
        console.log("A database with the name '" + db_name + "' already exists!");
      }
    });
  })
}

function isRSempty (rs){
  if(Object.keys(rs).length === 0){
    return true;
  }else{
    return false;
  }
}


module.exports = { pool, connection, query, doesDatabaseExist, createDatabaseIfNotExist, doesTableExist, createTablefNotExist, isRSempty };