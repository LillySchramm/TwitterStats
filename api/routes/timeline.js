const express = require('express');
const router = express.Router();
const tools = require('../tools/tools');
var datetime = require('node-datetime');

const MAX_DAYS_BACK = 30;
const typeNames = {
    "hashtag": "hashtags",
    "tag": "tags"
}

const sql = require('../sql/mysql');

var cache = {}

router.get('/:type/:search', async (req, res, next) => {
    search = req.params.search;
    type = req.params.type;
    search = tools.cleanSearch(search)

    let prefix = "";
    if (type == "tag") prefix = "@"
    if (type == "hashtag") prefix = "#"
    if (prefix == "") {
        res.status(406).json({
            error: "Available endpoints: /tag/ /hashtag/",
            started_with: prefix
        });
        return;
    }
    let db_name = "eps_" + typeNames[type];

    let now = datetime.create().now();
    let timestamps = {};
    datetime.setDefaultFormat("Y:m:d::H")

    for (var i = 1; i < MAX_DAYS_BACK * 24; i++) {

        datetime.setOffsetInHours(-i)
        let timestamp = datetime.create().format()
        timestamp = tools.removeLeadingZero(timestamp)

        if ((prefix + search + timestamp) in cache) {
            timestamps[timestamp] = cache[prefix + search + timestamp]
        } else {
            let table_name = typeNames[type] + "_" + timestamp;
            await sql.query("SELECT * FROM `" + db_name + "`.`" + table_name + "` WHERE NAME='" + prefix + search + "';").then(ret => {
                if (ret[0] != undefined) {
                    timestamps[timestamp] = ret[0].COUNT
                    cache[prefix + search + timestamp] = ret[0].COUNT
                } else {
                    timestamps[timestamp] = 0
                    cache[prefix + search + timestamp] = 0
                }
            })
        }
    }

    res.status(200).json({
        search: search,
        timestamps: timestamps
    });
});


module.exports = router;