# EPS-Twitterstats

## Introduction

This my little corona project. It consists of tow parts: <br>
1. A python script that uses an feature of the Twitter-API to receive a live-sample of all tweets published, searches 
   for tags and hashtags in them and then loads them into a database.<br>

2. A website where you can search in the database for tags and hashtags. It also uses Google Charts to generate
    histograms where you can see the (hash-)tags history.

## How does it work?

The twitter-api has an feature called "Sampled Stream". 
That means that you get a small live portion of, if you can trust the documentation, ca. 1% of all tweets pushed to Twitter.
This is the reason why you can multiply all numbers on this page by 100 to get somewhat near to the real usages. 
A script, that runs on a Raspberry Pi 4, processes all information it gets and looks for hashtags and tags. 
This information then gets passed to a database. On average 90k datasets are getting generated this way per hour. 
