<?php 
 require_once 'config.php';
 
 function genList($db, $conn)
 {
  $lst = "";
 
  $sql = 'SELECT NAME,COUNT FROM `eps_'.$db.'`.`'.$db.'_'.genDate(1).'` ORDER BY COUNT DESC LIMIT ' . TOP_X;
  $result = executeSQL($sql,[],$conn);
 
  if ($result) {
   $i = 1;
   foreach ($result as $row) {
     $n = $row['NAME'];
     $count = $row['COUNT'];
     $lst .= '<tr>';
     $lst .= '<td>'.$i.'</td>';
     $lst .= '<td>
                <form action="details.php" method="post">
                  <input type="hidden" name="search" value="'.$n.'" />
                  <button>'.$n.'</button>
                </form></td>';
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
 <h1>Twitterstats</h1> 
 <hr> 
 <h2> <a href="index.php">START</a> | <a href="info.php?page=howitworks">HOW IT WORKS</a>  | <a href="https://github.com/EliasSchramm/TwitterStats" target="_blank">GITHUB</a> |  <a href="info.php?page=about">ABOUT</a> </h2>
 <hr>

 <?php include 'searchbar.php'; ?>
 
 <p class="def">Welcome to my little corona project. Here you can search my database for Twitter tags and hashtags. Just use the searchbar above or click on one of the names in the Top <?php echo TOP_X;?> lists below.</p>
 
 <div class="flex-container">
 <div class="flex-items">

  <h2>Current Top <?php echo TOP_X;?> Tags</h2>
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

 <h2>Current Top <?php echo TOP_X;?> Hashtags</h2>
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

<?php include 'stats.php'; ?>
</body> 
</html>
