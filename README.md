# EPS-Twitterstats

## Introduction

This my little corona project. It consists of three parts: <br>
1. A python script that uses an feature of the Twitter-API to receive a live-sample of all tweets published, searches 
   for tags and hashtags in them and then loads them into a database.<br>
   
2. An API that gives the user and other services the ability to get toplists and histories of (hash-)tags and general stats. The API reference can be found at the end of this document.

3. A website where you can search in the database for tags and hashtags. It also uses Google Charts to generate
    histograms where you can see the (hash-)tags history.

## How does it work?

The twitter-api has an feature called "Sampled Stream". 
That means that you get a small live portion of, if you can trust the documentation, ca. 1% of all tweets pushed to Twitter.
This is the reason why you can multiply all numbers on this page by 100 to get somewhat near to the real usages. 
A script, that runs on a Raspberry Pi 4, processes all information it gets and looks for hashtags and tags. 
This information then gets passed to a database. On average 90k datasets are getting generated this way per hour. 

# API

The api has three endpoints: `stats`, `timeline` and `top`. <br>
Base URL is `https://api.eps-dev.de:42069/`.

## `stats/`

### Functionality

Returns these three statistics:

- `count_tweets` returns the total amount of tweets processed
- `count_retweets` returns the amount of tweets that where retweets
- `count_tags` returns the total amount of tags processed
- `count_hashtags` returns the total amount of hashtags processed

### Usage

Just `stats/`. Other requests will result in an error.


### Example request

`https://api.eps-dev.de:42069/stats`

```json
{
   "count_tweets":358688441,
   "count_retweets":164650004,
   "count_tags":155193162,
   "count_hashtags":27489941
}
```

## `top/`

### Functionality

Returns one value:

- `top` returns the toplist in form of an array of dicts<br>
> `NAME` the name of the item <br>
> `COUNT` the amount of times the item was seen in that hour


### Usage

> Note: type can be 'tag' or 'hashtag'

`top/:count/:type/:year/:month/:day/:hour`

or

`top/:count/:type/now`

`:count` is the amount of result you want. 50 is the max size.<br>
`/now` returns the values of the last hour.<br>
The current hour can't be requested.<br>
An empty result hints at a data loss at the requested timestamp.


### Example request

`https://api.eps-dev.de:42069/top/5/tag/2021/2/10/20`

```json
{
   "top":[
      {
         "NAME":"@bts_twt",
         "COUNT":138
      },
      {
         "NAME":"@youtube",
         "COUNT":129
      },
      {
         "NAME":"@galatasaraysk",
         "COUNT":108
      },
      {
         "NAME":"@elonmusk",
         "COUNT":105
      },
      {
         "NAME":"@mtv",
         "COUNT":103
      }
   ]
}
```

## `timeline/`

### Functionality

Returns two values:

- `search` returns the requested item
- `timestamps` returns the history of the requested item in form of an dict.<br>
>  key =  the timestamp <br>
>  value = the amount of times the item was seen in that hour


### Usage

> Note: type can be 'tag' or 'hashtag'

`timeline/:type/:search`

### Example request

`https://api.eps-dev.de:42069/timeline/tag/youtube`

```json
{
   "search":"youtube",
   "timestamps":{
      "2021:3:6::14":143,
      "2021:3:6::13":119,
      "2021:3:6::12":121,
      "2021:3:6::11":111,
      "2021:3:6::10":101,
      "2021:3:6::9":101,
      "2021:3:6::8":94,
      "2021:3:6::7":77,
      "2021:3:6::6":94,
      "2021:3:6::5":95,
      "2021:3:6::4":110,
      "2021:3:6::3":123,
      "2021:3:6::2":96,
      "2021:3:6::1":111,
      "2021:3:6::0":129,
      "2021:3:5::23":129,
      "2021:3:5::22":129,
      "2021:3:5::21":125,
      "2021:3:5::20":125,
      "2021:3:5::19":134,
      "2021:3:5::18":149,
      "2021:3:5::17":139,
      "2021:3:5::16":137,
      "2021:3:5::15":131,
      "2021:3:5::14":153,
      "2021:3:5::13":123,
      "2021:3:5::12":138,
      "2021:3:5::11":110,
      ...
      "2021:2:4::20":146,
      "2021:2:4::19":137,
      "2021:2:4::18":172,
      "2021:2:4::17":134,
      "2021:2:4::16":158
   }
}
```
