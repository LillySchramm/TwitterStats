# TwitterStats
 
A fully automated twitter-trend tool.

## How does it work?

The twitter-api has an feature called "Sampled Stream". That means that you get a small live portion of, if you can trust the documentation, ca. 1% of all tweets pushed to twitter. 
This allows us to get a good overview of the current situation on twitter. All relevant Hashtags, Tags and Emoji bc. everything that we can find, in a sampled stream, multiple in one hour of is probably relevant.
These trends and other stats then replace placeholders on a HTML file that then gets copied to the /www/ of an apache2 server. 

## Setup

You want to setup this script yourself? Do so! Here you can find anything you need.

#### Requirements

You need a few thing before you start. <br>

1. Python3 and PIP3 is required to run this script <br>
2. The "Emoji" Library is required. ```pip3 install emoji```
3. An installation of Apache2. ```apt-get install apache2``` 

Note: You can use any webserver you want.




    