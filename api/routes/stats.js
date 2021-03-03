const express = require('express');
const router = express.Router();
const tools = require('../tools/tools');

const sql = require('../sql/mysql');

router.get('/', async (req, res, next) => {        
    await sql.query("SELECT * FROM `eps_vars`.`eps_vars`").then(ret => {
        res.status(200).json({
            count_tweets:   ret[0].count_tweets,
            count_retweets: ret[0].count_retweets,
            count_tags:     ret[0].count_tags,
            count_hashtags: ret[0].count_hashtags
        });
    })  
});


module.exports = router;