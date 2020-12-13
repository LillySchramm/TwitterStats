<?php 
    require_once 'config.php';
    $mode = $_GET['page'];  
?>

<!DOCTYPE html>
<html lang="en">

    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>EPS-Twitterstats</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/searchbar.css">
    <link rel="stylesheet" href="/css/style.css">
    </head>

    <body>
        <h1>Twitterstats</h1>
        <hr>
        <h2> <a href="index.php">START</a> | <a href="info.php?page=howitworks">HOW IT WORKS</a>  | <a href="https://github.com/EliasSchramm/TwitterStats" target="_blank">GITHUB</a> |  <a href="info.php?page=about">ABOUT</a> </h2>
        <hr>

        <?php include 'searchbar.php'; ?>

        <br>

        <?php 
            if($mode=="howitworks"){    
        ?>  

            <div class="about">           

            <h2>How it works</h2>
            <p>
                The twitter-api has an feature called "Sampled Stream". That means that you get a small live portion of, if you can trust the <a href="https://developer.twitter.com/en/docs/twitter-api/tweets/sampled-stream/api-reference/get-tweets-sample-stream"><u>documentation</u></a>,
                ca. 1% of all tweets pushed to twitter. <br>
                This is the reason why you can multiply all numbers on this page by 100 to get somewhat near to the real usages. A script, that runs on a Raspberry Pi 4, processes all information it gets and looks for hashtags and tags.
                These informations get passed to a database. On average 90k datasets are getting generated this way per hour.
            </p>
            </div>

        <?php     
            }elseif ($mode=="about") {
        ?>

                <div class="about">
                    <h2><b>About</b></h2>
                    <p>
                        <b>Disclaimer:</b> Everything on this website is a pure statistical evaluation of an limited amount of data. 
                        I explicitly distance myself from any tags/hashtags found or/and shown. I also strongly advise to not assume that any numbers/statistics shown on this website are resembling the past or current situation/s on Twitter in an accurate manner.         
                    </p>
                    <h2>Contact</h2>
    
                    <p> Elias Paul Schramm <br>
                        privat@eps-dev.de <br>
                        adress and tel. on request 
                    </p>
                </div>

        <?php
            }else {
        ?>
                
                <div class="about">
                <h2><b>Why cant i find my tag/hashtag?</b></h2>
                <br>
    
                <p>
                    There are two possible reasons: <br><br>
                    1. <b>It is only a few minutes old / its older than 30 days</b><br>
                    Because of the way this website works, hashtags/tags can take up to 60 Minutes till they can get found via search. And to ensure stability of this service we are currently only showing the last 30 day of an hashtag/tag.<br>
                    <br>
                    
                    2. <b>It wasn't used much</b><br>
                    We are only geting a very small portion of the tweets published. This way most hashtags/tags wont even go through my script. We are also not saving any hastags/tags that we only see one or two times to enshure that we aren't saving some bycatch.

                </p>

                </div>
                
        <?php
            }
        ?>

        <br>

        <?php include 'stats.php'; ?>

    </body>

</html>
