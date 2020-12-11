<?php 
  require_once 'config.php';

  function genDate($offset)
  {
    $currentTime = time();
    $timeToSubtract = ($offset * 60 * 60);
    $timeInPast = $currentTime - $timeToSubtract;
    $s_date = strval(date("Y", $timeInPast));
    $s_date .= ":".intval(date('m', $timeInPast)).":".intval(date('d', $timeInPast))."::".intval(date('H', $timeInPast));

    return $s_date;
  }

  function genList($db, $conn)
  {
    $lst = "";

    $sql = 'SELECT NAME,COUNT FROM `eps_'.$db.'`.`'.$db.'_'.genDate(1).'` ORDER BY COUNT DESC LIMIT ' . TOP_X;
    $stmt = $conn->prepare($sql); 
    $stmt->execute();
    $result = $stmt->fetchAll();  

    if ($result) {
      $i = 1;
      foreach ($result as $row) {
        $n = $row['NAME'];
        $count = $row['COUNT'];
        $lst .= '<tr>';
        $lst .= '<td>'.$i.'</td>';
        $lst .= '<td>'.$n.'</td>';
        $lst .= '<td>'.$count.'</td>';
        $lst .= '</tr>';
        $i++;
      }

    }
    return $lst;
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

<body>

  <!--HEADER-->

  <h1>Twitterstats</h1>

  <hr>

  <h2> <a href="#">HOW IT WORKS</a>  | <a href="#">GITHUB</a> |  <a href="#">ABOUT</a> </h2>

  <hr>

  <div class="form">
    <form action="details.php" method="post" class="p-3">
      <div class="input-group">
        <input type="text" name="search" id="search" class="form-control form-control-lg rounded-0 eps" placeholder="Search for an tag or hashtag..." autocomplete="off" required>
        <div class="input-group-append">
          <input type="submit" name="submit" value="Search" class="btn btn-lg rounded-0 eps">
        </div>
      </div>
    </form>
    <div class="list-group" id="show-list">         
    </div>

  </div>

  <p>Welcome to my little corona project. Here you can search my database for Twitter tags and hashtags. Just use the searchbar above or click on one of the names in the Top <?php echo TOP_X;?> lists below.</p>

  <div class="flex-container">
   <div class="flex-items">

    <h2>Top <?php echo TOP_X;?> Tags</h2>
    <br>
    <table>
      <tr class="head">
        <th>#</th>        
        <th>TAG</th>
        <th>COUNT</th>
      </tr>
      <?php 
      
      echo genList("tags", $conn);
      
      ?>
      
    </table> 
   </div>
   <div class="flex-items">
   <h2>Top <?php echo TOP_X;?> Hashtags</h2>
   <br>
   <table>
    <tr class="head">
        <th>#</th>        
        <th>HASHTAG</th>
        <th>COUNT</th>
      </tr>
      <?php 
      
      echo genList("hashtags", $conn);
      
      ?>
      
    </table> 
   </div>
</div>
<br>
<br>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="js/script.js"></script>
</body>

</html>
