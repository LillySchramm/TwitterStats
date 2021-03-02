const express = require('express');
const router = express.Router();
const tools = require('../tools/tools');
var datetime = require('node-datetime');

const MAX_TOP = 50
const typeNames = {
    "hashtag": "hashtags",
    "tag": "tags"
}

const sql = require('../sql/mysql');

var cache = {}

router.get('/:count/:type/:year/:month/:day/:hour', async (req, res, next) => {
    let count = req.params.count; 
    //count = parseInt(count)
    let type =  req.params.type;
    let year =  req.params.year;
    let month = req.params.month;
    let day = req.params.day;
    let hour = req.params.hour;

    if (type != "tag" && type != "hashtag") {
        res.status(406).json({
            error: "Available endpoints: /tag/ /hashtag/"            
        });
        return;
    }

    let db_name = "eps_" + typeNames[type];  
    let table_name = typeNames[type] + "_" + year + ":" + month + ":" + day + "::" + hour;
    let list;

    datetime.setDefaultFormat("Y:m:d::H")
    let timestamp = datetime.create().format()
    timestamp = tools.removeLeadingZero(timestamp)

    if(timestamp == (year + ":" + month + ":" + day + "::" + hour)){
        res.status(403).json({
            error: "Current hours toplist not available"            
        });
        return;
    }

    timestamp = year + ":" + month + ":" + day + "::" + hour;
    let error = false;

    if ((type + timestamp) in cache) {
        list = cache[type + timestamp]
    } else { 
        await sql.doesTableExist(table_name).then(async (r) => {
            if(r){
                await sql.query("SELECT NAME,COUNT FROM `" + db_name + "`.`" + table_name + "` ORDER BY COUNT DESC LIMIT " + MAX_TOP + ";").then(ret => {
                    cache[type + timestamp] = ret;
                    list = ret;
                })
            }else{
                res.status(400).json({
                    error: "Timestamp not found"            
                });
                error = true;
            }
            
        })        
    }

    if(!error){
        list = list.slice(0, count)

        res.status(200).json({
            top:list
        });
    }
    
});


module.exports = router;