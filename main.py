import requests
import os.path
import json
import time
from datetime import datetime
import io
import threading
from collections import OrderedDict
from emoji import UNICODE_EMOJI
from http.client import IncompleteRead
import schedule
import pickle

KEY = ""
OUTPUT_DIR = "/var/www/html/"
#OUTPUT_DIR = "www/"

website = ""
startTime = 0
currentTime = 0
lastMin = -1
startMin = 0

# Stats

lastTweet = ""
countTweets = 0
countReTweets = 0
countHashtags = 0
countTags = 0
countEmoji = 0

back_hashtags = dict()
for_hashtags = dict()

mins_hashtags = dict()
mins_emoji = dict()
mins_tag = dict()

back_tag = dict()
for_tag = dict()

back_emoji = dict()
for_emoji = dict()

online = True


def loadState():
    global back_hashtags, back_tag, back_emoji, startTime, mins_tag, mins_hashtags, mins_emoji, countTweets, countReTweets, countTags, countHashtags, countEmoji

    with open('state.pkl', 'rb') as f:
        startTime = pickle.load(f)
        f.close()
    with open('countTweets.pkl', 'rb') as f:
        countTweets = pickle.load(f)
        f.close()
    with open('countRetweets.pkl', 'rb') as f:
        countReTweets = pickle.load(f)
        f.close()
    with open('countTags.pkl', 'rb') as f:
        countTags = pickle.load(f)
        f.close()
    with open('countHashtags.pkl', 'rb') as f:
        countHashtags = pickle.load(f)
        f.close()
    with open('countEmoji.pkl', 'rb') as f:
        countEmoji = pickle.load(f)
        f.close()

    with open('data/back_tag.pkl', 'rb') as f:
        back_tag = pickle.load(f)
        f.close()
    with open('data/back_hashtags.pkl', 'rb') as f:
        back_hashtags = pickle.load(f)
        f.close()
    with open('data/back_emoji.pkl', 'rb') as f:
        back_emoji = pickle.load(f)
        f.close()

    with open('data/mins_tag.pkl', 'rb') as f:
        mins_tag = pickle.load(f)
        f.close()
    with open('data/mins_hashtags.pkl', 'rb') as f:
        mins_hashtags = pickle.load(f)
        f.close()
    with open('data/mins_emoji.pkl', 'rb') as f:
        mins_emoji = pickle.load(f)
        f.close()

def saveState():
    try:
        with open('state.pkl', 'wb') as f:
            pickle.dump(startTime, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        with open('countTweets.pkl', 'wb') as f:
            pickle.dump(countTweets, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('countRetweets.pkl', 'wb') as f:
            pickle.dump(countReTweets, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('countTags.pkl', 'wb') as f:
            pickle.dump(countTags, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('countHashtags.pkl', 'wb') as f:
            pickle.dump(countHashtags, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('countEmoji.pkl', 'wb') as f:
            pickle.dump(countEmoji, f, pickle.HIGHEST_PROTOCOL)
            f.close()


        with open('data/back_tag.pkl', 'wb') as f:
            pickle.dump(back_tag, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('data/back_hashtags.pkl', 'wb') as f:
            pickle.dump(back_hashtags, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('data/back_emoji.pkl', 'wb') as f:
            pickle.dump(back_emoji, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        with open('data/mins_emoji.pkl', 'wb') as f:
            pickle.dump(mins_emoji, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('data/mins_tag.pkl', 'wb') as f:
            pickle.dump(mins_tag, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        with open('data/mins_hashtags.pkl', 'wb') as f:
            pickle.dump(mins_hashtags, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        outPrint("Saved state!")
    except:
        exit()

def regenWebsite(out_file):
    global website, lastTweet, currentTime, lol

    getWebsite("index.html")

    website_copy = website
    currentTime = int(time.time())

    now = dateTimeObj = datetime.now()

    toph = ""
    topt = ""
    tope = ""
    i = 0

    for k, v in for_hashtags.items():
        i += 1
        toph += '"' + str(k) + '" : ' + str(v) + ' per hour<br>'

        if i >= 50:
            break

    i = 0

    for k, v in for_tag.items():
        i += 1
        topt += '"' + str(k) + '" : ' + str(v) + '<br>'

        if i >= 50:
            break

    i = 0

    for k, v in for_emoji.items():
        i += 1
        tope += '"' + str(k) + '" : ' + str(v) + '<br>'

        if i >= 50:
            break

    website_copy = website_copy.replace("$lastTweet$", lastTweet)
    website_copy = website_copy.replace("$upTime$", str(int(getCurrentDelta() / 60)))
    website_copy = website_copy.replace("$num_tweets$", str(countTweets))
    website_copy = website_copy.replace("$num_re_tweets$", str(countReTweets))
    website_copy = website_copy.replace("$num_hashtags$", str(countHashtags))
    website_copy = website_copy.replace("$num_emoji$", str(countEmoji))
    website_copy = website_copy.replace("$num_tag$", str(countTags))
    website_copy = website_copy.replace("$topHashtags$", toph)
    website_copy = website_copy.replace("$topTag$", topt)
    website_copy = website_copy.replace("$topEmoji$", tope)

    with io.open(OUTPUT_DIR + out_file, 'w', encoding='utf8') as f:
        f.write(website_copy)

        f.close()


def getCurrentDelta():
    return int((currentTime - startTime) / 60)


def getWebsite(url):
    global website

    f = open(url, "r")
    website = f.read()
    f.close()


def handleTweet(tweet):
    global countReTweets, countTweets, lastTweet, back_hashtags, countHashtags, countTags, countEmoji, back_emoji
    # ReTweets will get Ignored

    if not tweet.startswith("RT"):
        lastTweet = tweet
        words = tweet.split(" ")

        for word in words:
            if word.startswith("#"):
                addToCurrentMinute("hashtag", word)
                countHashtags += 1

                if word in back_hashtags:
                    back_hashtags[word] = back_hashtags[word] + 1
                else:
                    back_hashtags[word] = 1
            elif word.startswith('@') and not word == "@":
                addToCurrentMinute("tag", word)
                countTags += 1

                if word in back_tag:
                    back_tag[word] = back_tag[word] + 1
                else:
                    back_tag[word] = 1
            else:
                chars = word.split()
                for char in chars:
                    if char in UNICODE_EMOJI.keys():
                        addToCurrentMinute("emoji", char)
                        countEmoji += 1
                        if char in back_emoji:
                            back_emoji[char] = back_emoji[char] + 1
                        else:
                            back_emoji[char] = 1

    else:
        countReTweets += 1


    countTweets += 1


def auth():
    return KEY


def create_url():
    return "https://api.twitter.com/2/tweets/sample/stream"


def create_headers(bearer_token):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    return headers


def connect_to_endpoint(url, headers):
    global online
    try:
        response = requests.request("GET", url, headers=headers, stream=True)
        print(response.status_code)
        for response_line in response.iter_lines():
            if response_line:
                if b"data" in response_line:
                    json_response = json.loads(response_line)
                    threading.Thread(target=handleTweet, args=(json_response["data"]["text"],)).start()
                    schedule.run_pending()




            if response.status_code != 200:
                raise Exception(
                    "Request returned an error: {} {}".format(
                        response.status_code, response.text
                    )
                )
    except:
        exit()

def main():
    global currentTime
    bearer_token = auth()
    url = create_url()
    headers = create_headers(bearer_token)
    timeout = 0

    print("Server started")
    schedule.every().second.do(updateDicts)
    connect_to_endpoint(url, headers)



def addToCurrentMinute(type, content):
    now = datetime.now()
    if type == "hashtag":
        if content in mins_hashtags[lastMin]:
            mins_hashtags[lastMin][content] = mins_hashtags[lastMin][content] + 1
        else:
            mins_hashtags[lastMin][content] = 1

    elif type == "emoji":
        if content in mins_emoji[lastMin]:
            mins_emoji[lastMin][content] = mins_emoji[lastMin][content] + 1
        else:
            mins_emoji[lastMin][content] = 1
    else:
        if content in mins_tag[lastMin]:
            mins_tag[lastMin][content] = mins_tag[lastMin][content] + 1
        else:
            mins_tag[lastMin][content] = 1


def updateDicts():
    global back_hashtags, back_tag, back_emoji, for_hashtags, for_tag, for_emoji, now, lastMin

    for_hashtags = OrderedDict(sorted(back_hashtags.items(), key=lambda x: x[1], reverse=True))
    for_tag = OrderedDict(sorted(back_tag.items(), key=lambda x: x[1], reverse=True))
    for_emoji = OrderedDict(sorted(back_emoji.items(), key=lambda x: x[1], reverse=True))

    regenWebsite("index.html")

    now = datetime.now()

    if now.minute != lastMin:
        saveState()
        lastMin = now.minute

        rem = 0

        temp = back_hashtags
        temp_min = mins_hashtags[now.minute].items()

        for k, v in temp_min:
            temp[k] = temp[k] - v
            rem += 1
            if temp[k] < 0:
                temp[k] = 0

        back_hashtags = temp

        rem = 0

        temp = back_tag
        temp_min = mins_tag[now.minute].items()

        for k, v in temp_min:
            temp[k] = temp[k] - v
            rem += 1
            if temp[k] < 0:
                temp[k] = 0

        back_tag = temp

        temp = back_emoji
        temp_min = mins_emoji[now.minute].items()

        for k, v in temp_min:
            temp[k] = temp[k] - v
            if temp[k] < 0:
                temp[k] = 0

        back_emoji = temp

        mins_emoji[now.minute] = dict()
        mins_tag[now.minute] = dict()
        mins_hashtags[now.minute] = dict()

        for_hashtags = OrderedDict(sorted(back_hashtags.items(), key=lambda x: x[1], reverse=True))
        for_tag = OrderedDict(sorted(back_tag.items(), key=lambda x: x[1], reverse=True))
        for_emoji = OrderedDict(sorted(back_emoji.items(), key=lambda x: x[1], reverse=True))

        i = 0
        with io.open(OUTPUT_DIR + "hashtags.txt", 'a+', encoding='utf8') as f:
            f.write("\n")
            f.write(str(now.year) + ":" + str(now.month) + ":" + str(now.day) + "::" + str(now.hour) + ":" + str(
                now.minute))
            f.write("\n")
            for k, v in for_tag.items():
                i += 1
                f.write(str(k) + '::' + str(v) + "\n")
                if i >= 50:
                    break

            f.close()
        i = 0
        with io.open(OUTPUT_DIR + "tags.txt", 'a+', encoding='utf8') as f:
            f.write("\n")
            f.write(str(now.year) + ":" + str(now.month) + ":" + str(now.day) + "::" + str(now.hour) + ":" + str(
                now.minute))
            f.write("\n")
            for k, v in for_tag.items():
                i += 1
                f.write(str(k) + '::' + str(v) + "\n")
                if i >= 50:
                    break

            f.close()
        i = 0
        with io.open(OUTPUT_DIR + "emoji.txt", 'a+', encoding='utf8') as f:
            f.write("\n")
            f.write(str(now.year) + ":" + str(now.month) + ":" + str(now.day) + "::" + str(now.hour) + ":" + str(
                now.minute))
            f.write("\n")
            for k, v in for_emoji.items():
                i += 1
                f.write(str(k) + '::' + str(v) + "\n")
                if i >= 50:
                    break

            f.close()


def outPrint(str):
    print("{} ".format(now.time()) + str)

if __name__ == "__main__":
    getWebsite("index.html")
    now = datetime.now()
    if os.path.isfile("state.pkl"):
        outPrint("Loading old state")
        loadState()

    else:
        startTime = int(time.time())
        outPrint("Creating new state")
        for i in range(0, 60):
            mins_tag[i] = dict()
            mins_hashtags[i] = dict()
            mins_emoji[i] = dict()

    now = datetime.now()
    lastMin = now.minute
    main()
