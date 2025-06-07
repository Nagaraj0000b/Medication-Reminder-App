// index.js
const express = require('express');
const app = express();
const PORT = 8000;
const db=require("./db")


app.get('/', (req, res) => {
    db.query('select * from users',(err,result)=>{
        if(err){
          return res.sendStatus(500)
        }
            res.json(result)
        
    })
  
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
