import requests
import os.path
import sys
import json
import time
from datetime import datetime, timedelta
import threading
from collections import OrderedDict
from emoji import UNICODE_EMOJI
import schedule
import io
import pymysql as MySQLdb

sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

KEY = ""

# Stats
vars_id = 0

# MSQL CONNECTION

MSQL_HOST = "localhost"
MSQL_USER = "root"
MSQL_PWD  = ""

DATABASE_LIST = ['eps_vars', 'eps_tags', 'eps_hashtags']
DATABASE_TABLE_DEFAULTS = {'eps_vars'            :"CREATE TABLE `eps_vars`.`eps_vars` ( `ID` INT NOT NULL AUTO_INCREMENT , `start_time` INT NOT NULL DEFAULT '-1' , `count_retweets` INT NOT NULL , `count_tweets` INT NOT NULL , `count_tags` INT NOT NULL , `count_hashtags` INT NOT NULL ,  PRIMARY KEY (`ID`)) ENGINE = InnoDB; ",
                           'eps_tags'            :"CREATE TABLE `eps_tags`.`$date$` ( `ID` INT NOT NULL AUTO_INCREMENT , `NAME` VARCHAR(200) NOT NULL , `DATE` VARCHAR(100) NOT NULL , `COUNT` INT NOT NULL , PRIMARY KEY (`ID`)) ENGINE = InnoDB;  ",
                           'eps_hashtags'        :'CREATE TABLE `eps_hashtags`.`$date$` ( `ID` INT NOT NULL AUTO_INCREMENT , `NAME` VARCHAR(200) NOT NULL , `DATE` VARCHAR(100) NOT NULL , `COUNT` INT NOT NULL , PRIMARY KEY (`ID`)) ENGINE = InnoDB;  '}

MSQL_CONNECTION = MySQLdb.connect(
        host=MSQL_HOST,
        user=MSQL_USER,
        password=MSQL_PWD
    )

MSQL_CONNECTION.autocommit(True)

MSQL_CURSOR = MSQL_CONNECTION.cursor()

date = ""
lastdate = ""

def createTable(db, name):
    global  MSQL_CURSOR, date;
    MSQL_CURSOR.execute(DATABASE_TABLE_DEFAULTS[db].replace("%date%",date))

def checkTable(db, table_name):
    global MSQL_CURSOR

    MSQL_CURSOR.execute("SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = '"+table_name+"'")
    lst = MSQL_CURSOR.fetchall()

    if not (lst == [] or lst == ()):
        return True

    createTable(db, table_name)
    return False;

def createDatabase(db):
    MSQL_CURSOR.execute("CREATE DATABASE " + db)
    outPrint("Created '" + db + "'")

def checkDatabase(db, iterator):
    global MSQL_CURSOR
    MSQL_CONNECTION.query('SET GLOBAL connect_timeout=28800')
    MSQL_CONNECTION.query('SET GLOBAL interactive_timeout=28800')
    MSQL_CONNECTION.query('SET GLOBAL wait_timeout=28800')
    if db in iterator:
        outPrint("Found '" + db + "'")
    else:
        outPrint("Couldn't find '"  + db + "'")
        createDatabase(db)

def initDatabases():
    global MSQL_CURSOR

    MSQL_CURSOR.execute("SHOW DATABASES")
    iterator = [];

    for i in MSQL_CURSOR:
        iterator+=i;

    for name in DATABASE_LIST:
        checkDatabase(name, iterator)

    checkTable("eps_vars", "eps_vars")

def loadState():
    global back_hashtags, back_tag, back_emoji, startTime, mins_tag, mins_hashtags, mins_emoji, countTweets, countReTweets, countTags, countHashtags, countEmoji, MSQL_CURSOR, vars_id
    #vars

    MSQL_CURSOR.execute("SELECT * FROM `eps_vars`.`eps_vars`")
    lst = MSQL_CURSOR.fetchall()

    if lst == [] or lst == ():
        startTime = int(time.time())
        query = "INSERT INTO `eps_vars`.`eps_vars` (`ID`, `start_time`, `count_retweets`, `count_tweets`, `count_tags`, `count_hashtags`) VALUES (NULL, '"+str(startTime)+"', '0', '0', '0', '0');"
        MSQL_CURSOR.execute(query)
    else:
        pass

    MSQL_CURSOR.execute("SELECT * FROM `eps_vars`.`eps_vars`")
    lst = MSQL_CURSOR.fetchall()
    vars_id = lst[0][0];

def handleTweet(tweet):
    global countReTweets, countTweets, lastTweet, back_hashtags, countHashtags, countTags, countEmoji, back_emoji, QUERY_LIST, date
    # ReTweets will get Ignored
    if not tweet.startswith("RT"):
        words = tweet.split(" ")

        for word in words:
            if word.startswith("#"):
                addEntry("hashtag", word)
                MSQL_CURSOR.execute("UPDATE `eps_vars`.`eps_vars` SET `count_hashtags`= `count_hashtags` + 1 WHERE `ID` = '" + str(vars_id) + "';")

            elif word.startswith('@') and not word == "@":
                addEntry("tag", word)
                MSQL_CURSOR.execute("UPDATE `eps_vars`.`eps_vars` SET `count_tags`= `count_tags` + 1 WHERE `ID` = '" + str(vars_id) + "';")
    else:
        MSQL_CURSOR.execute("UPDATE `eps_vars`.`eps_vars` SET `count_retweets`= `count_retweets` + 1 WHERE `ID` = '" + str(vars_id) + "';")

    MSQL_CURSOR.execute("UPDATE `eps_vars`.`eps_vars` SET `count_tweets`= `count_tweets` + 1 WHERE `ID` = '" + str(vars_id) + "';")

def addEntry(type, content):
    global MSQL_CURSOR, MSQL_CURSOR, date
    try:
        now = datetime.now()
        if type == "hashtag":
            MSQL_CURSOR.execute("SELECT ID,NAME FROM `eps_hashtags`.`eps_hashtags` WHERE `DATE` = '"+str(date)+"' AND `NAME` = '"+content+"';")
            lst = MSQL_CURSOR.fetchall()

            if lst == [] or lst == ():
                MSQL_CURSOR.execute("INSERT INTO `eps_hashtags`.`eps_hashtags` (`ID`, `NAME`, `DATE`, `COUNT`) VALUES (NULL, '"+content+"', '"+str(date)+"', '1');")
            else:
                MSQL_CURSOR.execute("UPDATE `eps_hashtags`.`eps_hashtags` SET `COUNT`= `COUNT` + 1 WHERE `ID` = '" + str(lst[0][0]) + "';")

        else:
            MSQL_CURSOR.execute("SELECT ID,NAME FROM `eps_tags`.`eps_tags` WHERE `DATE` = '" + str(
                date) + "' AND `NAME` = '" + content + "';")
            lst = MSQL_CURSOR.fetchall()

            if lst == [] or lst == ():
                MSQL_CURSOR.execute(
                    "INSERT INTO `eps_tags`.`eps_tags` (`ID`, `NAME`, `DATE`, `COUNT`) VALUES (NULL, '" + content + "', '" + str(
                        date) + "', '1');")
            else:
                MSQL_CURSOR.execute(
                    "UPDATE `eps_tags`.`eps_tags` SET `COUNT`= `COUNT` + 1 WHERE `ID` = '" + str(lst[0][0]) + "';")

    except:
        pass

def auth():
    return KEY

def create_url():
    return "https://api.twitter.com/2/tweets/sample/stream"

def create_headers(bearer_token):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    return headers

def connect_to_endpoint(url, headers):
    global online

    response = requests.request("GET", url, headers=headers, stream=True)
    print(response.status_code)
    for response_line in response.iter_lines():
        if response_line:
            if b"data" in response_line:
                json_response = json.loads(response_line)
                #threading.Thread(target=handleTweet, args=(json_response["data"]["text"],)).start()
                handleTweet(json_response["data"]["text"])
                schedule.every().minute.do(checkDate)
                schedule.run_pending()

        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )

def outPrint(str):
    now = datetime.now()
    print("{} ".format(now.time()) + str)

def checkDate():
    global date
    date = str(now.year) + ":" + str(now.month) + ":" + str(now.day) + "::" + str(now.hour)
    if lastdate != date:
        checkTable("eps_tags", date)
        checkTable("eps_hashtags", date)
        lastdate = date


def main():
    global currentTime
    bearer_token = auth()
    url = create_url()
    headers = create_headers(bearer_token)
    timeout = 0
    checkDate()
    outPrint("Bot started")
    connect_to_endpoint(url, headers)

if __name__ == "__main__":
    initDatabases()
    loadState()

    main()




