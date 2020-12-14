<hr>

<?php 
$result = executeSQL("SELECT * FROM `eps_vars`.`eps_vars`", [],$conn);

if ($result) {

    foreach ($result as $row) {
        echo '
        <p class="defc">        
        In the time this script is running it processed '.$row["count_tweets"].' Tweets.<br> 
        '.$row["count_retweets"].' of the Tweets where Retweets.<br>
        It found '.$row["count_tags"].' Tags and '.$row["count_hashtags"].' Hashtags.      
        </p>';
    }

}
?>
