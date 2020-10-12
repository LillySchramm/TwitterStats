# TwitterStats
 
A fully automated twitter-trend tool.

## How does it work?

The twitter-api has an feature called "Sampled Stream". That means that you get a small live portion of, if you can trust the documentation, ca. 1% of all tweets pushed to twitter. 
This allows us to get a good overview of the current situation on twitter. All Hashtags, Tags and Emoji are relevant bc. everything that we can find, in a sampled stream, multiple in one hour is probably relevant.
These trends and other stats then replace placeholders on a HTML file that then gets copied to the /www/ of an apache2 server. It also saves the top 200 in a list every minute.

## Setup

You want to setup this script yourself? Do so! Here you can find anything you need.

#### Requirements

You need a few thing before you start. <br>

1. Python3 and PIP3 is required to run this script <br>
2. The "Emoji" Library is required. ```pip3 install emoji```
3. An installation of Apache2. ```apt-get install apache2``` 
4. Screen so we can run the script in the background. ```apt-get install screen``` 
5. A texteditor. I'm using nano. ```apt-get install nano``` 

Note: You can use any webserver you want.

#### Installation

1. Clone this repo ```git clone https://github.com/EliasSchramm/TwitterStats.git```
2. Edit "main.py" ```nano main.py``` 
    - Change the "KEY" variable to your BAERER TOKEN
    - Save the file
3. Edit "start.sh"
    - Change the directory to the one you cloned to
    - Save the file
4. Make "start.sh" executable. ```chmod +x start.sh```
5. Run it! ```./start.sh```
6. You are done and if anything is configured correctly you should see the a website when calling your server.

#### Website

You can customize the website shown however you like! Even while the script is running! Just put the dummy you can see in the table instead of a value. 

| Dummy  | Function |
| ------------- | ------------- |
| $lastTweet$  | Shows the last processed tweet |
| $upTime$  | Show how many hours the script ran  |
| $num_tweets$  | Show how many tweets the script processed while it ran  |
| $num_re_tweets$  | Show how many of tweets where retweets  |
| $num_hashtags$  | Show how many hashtags the script processed while it ran  |
| $num_emoji$  | Show how many emoji the script processed while it ran  |
| $num_tag$  | Show how many tags the script processed while it ran  |
| $topHashtags$  | Show the current top 50 Hashtags  |
| $topTag$  | Show the current top 50 Tags  |
| $topEmoji$  | Show the current top 50 Emoji  |

## Get my lists

If you want the lists I generated over the time Im running this script just use ```wget <address>```.

Tags: ```http://twitterstats.eps-dev.de/tags.txt```<br>
Hashtags: ```http://twitterstats.eps-dev.de/hashtags.txt``` <br>
Emoji: ```http://twitterstats.eps-dev.de/emoji.txt```


    
