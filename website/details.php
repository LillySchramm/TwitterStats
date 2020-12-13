<?php 

require_once 'config.php';

$search = $_POST['search'];
$target = "none";
$lst_base = "['Date', 'Count']";
$lst = "";
$num_results = 0;

if(startsWith($search, "#")){
    $target = "hashtags";
}elseif(startsWith($search, "@")){
    $target = "tags";
}

if($target != "none"){
    for($i = 1; $i < MAX_HOURS_BACK; $i++){
        $tbl_name = $target."_".genDate($i);

        if(doesTableExist($tbl_name, $conn)){
            $sql = "SELECT COUNT FROM `eps_".$target."`.`".$tbl_name."` WHERE NAME = '".$search."';";
            $result = executeSQL($sql, [], $conn);
            if($result){
                foreach ($result as $row) {
                    $count = $row['COUNT'];                    
                    $lst = ",['".genDateForGraph($i)."',".$count."]".$lst;
                    $num_results++;
                }
            }else{
                $lst = ",['".genDateForGraph($i)."',0]".$lst;
            }
        }else {
            break;
        }
    }

    $lst = $lst_base . $lst;
}
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

    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable([
            <?php echo $lst; ?>
        ]);

        var options = {
            title: 'Company Performance',
            //curveType: 'function',
            animation:{
                duration: 1000,
                startup: true
            },
            legend: { position: 'bottom' },
            colors: ['#fff'],
            backgroundColor: {
                fill: '#000',
            } ,          
            hAxis: {
                textStyle:{color: '#FFF'},
                baselineColor: '#fff'
            },
            vAxis: {
                textStyle:{color: '#FFF'},
                baselineColor: '#fff',
                gridlines: {
                    color: '#fff',
                    minSpacing: 100
                },
                viewWindow: {
                    min: 0
                }
            },
            legend: {            
                textStyle:{color: '#FFF'},
                position: 'bottom'
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
    </script>
    <body>  

        <h1>Twitterstats</h1>

        <hr>
        <h2> <a href="index.php">START</a> | <a href="info.php?page=howitworks">HOW IT WORKS</a>  | <a href="https://github.com/EliasSchramm/TwitterStats" target="_blank">GITHUB</a> |  <a href="info.php?page=about">ABOUT</a> </h2>
        <hr>

        <?php include 'searchbar.php'; ?>
        <br>
        <br>
        <br>
        <?php
            if($target != "none" && $num_results > 0){
        ?>
        <h2 >The recorded history of '<?php echo $search; ?>'.</h2>
        <div id="curve_chart" style="width: 1000px; height: 500px;display: block;margin: 0 auto;"></div>        
        <?php
            }else if($target == "none"){

                ?>
                <div class="error">
                    <h2><b>Something went wrong ):</b></h2>
                    <p class="def center">Please specify if you want to find an tag or hashtag.<br> (Use "#" in front of an hashtag, an "@" for tags)</p>
                </div>
                <?php
                
            }else {
                ?>
                <div class="error">
                    <h2><b>Something went wrong ):</b></h2>
                    <p class="def center">Sadly we weren't able to find '<?php echo $search; ?>' in our database.</p>
                    <p class="def center">More info: <a href="info.php?page=notfound"><u>Why cant I find my hashtag/tag?</u></a></p>
                </div>
                <?php
            }

        ?>  
        <br>
        <?php include 'stats.php'; ?>

    </body>

</html>