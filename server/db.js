const mysql=require("mysql2")
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Nagaraj@1",
    database:"medication_reminder"
})

connection.connect((err)=>{
    if (err) {
        console.error('Error connecting to MySQL:', err);
    return;
    }
    else{
        console.log("sql connected to server")
    }
})

module.exports=connection