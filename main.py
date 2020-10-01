import requests
import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
from datetime import datetime
import threading
from collections import OrderedDict
from emoji import UNICODE_EMOJI

webServer = 0
hostName = "localhost"
serverPort = 80
website = ""
startTime = 0
currentTime = 0

# Stats

lastTweet = ""
countTweets = 0
countReTweets = 0
countHashtags = 0
countTags = 0
countEmoji = 0

back_hashtags = dict()
for_hashtags = dict()

back_tag = dict()
for_tag = dict()

back_emoji = dict()
for_emoji = dict()


class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        global website, lastTweet, currentTime
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

        website_copy = website
        currentTime = int(time.time())

        top20 = ""
        top20t = ""
        top20e = ""
        i = 0

        for k, v in for_hashtags.items():
            i += 1
            top20 += '"' + str(k) + '" : ' + str(v) + '<br>'
            if i >= 20:
                break

        i = 0

        for k, v in for_tag.items():
            i += 1
            top20t += '"' + str(k) + '" : ' + str(v) + '<br>'
            if i >= 20:
                break

        i = 0

        for k, v in for_tag.items():
            i += 1
            top20e += '"' + str(k) + '" : ' + str(v) + '<br>'
            if i >= 20:
                break

        website_copy = website_copy.replace("$lastTweet$", lastTweet)
        website_copy = website_copy.replace("$upTime$", str(getCurrentDelta()))
        website_copy = website_copy.replace("$num_tweets$", str(countTweets))
        website_copy = website_copy.replace("$num_re_tweets$", str(countReTweets))
        website_copy = website_copy.replace("$num_hashtags$", str(countHashtags))
        website_copy = website_copy.replace("$num_tag$", str(countTags))
        website_copy = website_copy.replace("$top20Hashtags$", top20)
        website_copy = website_copy.replace("$top20tag$", top20t)

        for line in website_copy.split("\n"):
            self.wfile.write(
                bytes(line + "\n", "utf-8"))


def getCurrentDelta():
    return int((currentTime - startTime) / 60)


def getWebsite(url):
    global website

    f = open(url, "r")
    website = f.read()
    f.close()


def runServer():
    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass


def handleTweet(tweet):
    global countReTweets, countTweets, lastTweet, back_hashtags, countHashtags, countTags,countEmoji, back_emoji
    # ReTweets will get Ignored

    if not tweet.startswith("RT"):
        lastTweet = tweet
        words = tweet.split(" ")

        for word in words:
            if word.startswith("#"):

                countHashtags += 1

                if word in back_hashtags:
                    back_hashtags[word] = back_hashtags[word] + 1
                else:
                    back_hashtags[word] = 1
            elif word.startswith('@') and not word == "@":

                countTags += 1

                if word in back_tag:
                    back_tag[word] = back_tag[word] + 1
                else:
                    back_tag[word] = 1
            else:
                chars = word.split()
                for char in chars:
                    if char in UNICODE_EMOJI.keys():
                        countEmoji += 1
                        if char in back_emoji:
                            back_emoji[char] = back_emoji[char] + 1
                        else:
                            back_emoji[char] = 1


    else:
        countReTweets += 1

    countTweets += 1


def auth():
    return "AAAAAAAAAAAAAAAAAAAAAD0MGwEAAAAAASMhNK5DdNJxmpORQUJWzV5SK3M%3D34b4eUIuJh0SoCnOhmYn4FAUai55m0c47FnAJp0m4EgemFWKbb"


def create_url():
    return "https://api.twitter.com/2/tweets/sample/stream"


def create_headers(bearer_token):
    headers = {"Authorization": "Bearer {}".format(bearer_token)}
    return headers


def connect_to_endpoint(url, headers):
    try:
        response = requests.request("GET", url, headers=headers, stream=True)
        print(response.status_code)
        for response_line in response.iter_lines():
            if response_line:
                json_response = json.loads(response_line)

                handleTweet(json_response["data"]["text"])

        if response.status_code != 200:
            raise Exception(
                "Request returned an error: {} {}".format(
                    response.status_code, response.text
                )
            )
    except:
        pass



def main():
    global currentTime
    bearer_token = auth()
    url = create_url()
    headers = create_headers(bearer_token)
    timeout = 0
    x = threading.Thread(target=runServer)
    x.start()
    xx = threading.Thread(target=updateDicts)
    xx.start()

    print("Server started http://%s:%s" % (hostName, serverPort))

    while True:
        connect_to_endpoint(url, headers)
        timeout += 1


def updateDicts():
    global back_hashtags, for_hashtags, for_tag, for_emoji
    while True:
        for_hashtags = OrderedDict(sorted(back_hashtags.items(), key=lambda x: x[1], reverse=True))
        for_tag = OrderedDict(sorted(back_tag.items(), key=lambda x: x[1], reverse=True))
        for_emoji = OrderedDict(sorted(back_emoji.items(), key=lambda x: x[1], reverse=True))

        time.sleep(1)


if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    getWebsite("index.html")
    startTime = int(time.time())
    main()
