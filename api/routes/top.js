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

const loadTopList = (type, timestamp, db_name, table_name) => {
    return new Promise((resolve, reject) => {    
        if ((type + timestamp) in cache) {
            resolve(cache[type + timestamp])
        } else { 
            sql.doesTableExist(table_name).then(async (r) => {
                if(r){
                    sql.query("SELECT NAME,COUNT FROM `" + db_name + "`.`" + table_name + "` ORDER BY COUNT DESC LIMIT " + MAX_TOP + ";").then(ret => {
                        cache[type + timestamp] = ret;
                        list = ret;
                        resolve(list)
                    })
                }else{
                    reject(true)                    
                }                
            })        
        }
    });
}

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

    let str_err = false;
    if(!tools.isNormalInteger(count)) str_err = true;
    if(!tools.isNormalInteger(year)) str_err = true;
    if(!tools.isNormalInteger(month)) str_err = true;
    if(!tools.isNormalInteger(day)) str_err = true;
    if(!tools.isNormalInteger(hour)) str_err = true;

    if(str_err){
        res.status(405).json({
            error: "year, month, day and hour MUST be an integer"            
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

    await loadTopList(type, timestamp, db_name, table_name).then(ret => {
        list = ret.slice(0, count)

        res.status(200).json({
            top:list
        });
    }).catch(()=>{
        res.status(400).json({
            error: "Timestamp not found"            
        });
    })    
});

router.get('/:count/:type/now', async (req, res, next) => {
    let count = req.params.count; 
    let type =  req.params.type;

    if (type != "tag" && type != "hashtag") {
        res.status(406).json({
            error: "Available endpoints: /tag/ /hashtag/"            
        });
        return;
    }    

    datetime.setDefaultFormat("Y:m:d::H")
    datetime.setOffsetInHours(-1)
    let timestamp = datetime.create().format()
    timestamp = tools.removeLeadingZero(timestamp)

    let db_name = "eps_" + typeNames[type];  
    let table_name = typeNames[type] + "_" + timestamp;
    let list;

    await loadTopList(type, timestamp, db_name, table_name).then(ret => {
        list = ret.slice(0, count)
        res.status(200).json({
            top:list
        });
    }).catch(()=>{
        res.status(400).json({
            error: "Timestamp not found"            
        });
    })    
});

module.exports = router;