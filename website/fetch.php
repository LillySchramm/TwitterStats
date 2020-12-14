<?php
  require_once 'config.php';  

  if (isset($_POST['query'])) {

    $inpText = $_POST['query'];

    $sql = 'SELECT NAME FROM `eps_dump`.`dump` WHERE NAME LIKE :name ORDER BY COUNT DESC LIMIT 8';
    $result = executeSQL($sql, ['name' => '%' . $inpText . '%'], $conn);

    if ($result) {

      foreach ($result as $row) {
        $n = $row['NAME'];
        echo '<a href="#" class="list-group-item list-group-item-action border-1 eps">' . $n . '</a>';
      }

    }else{
      //echo '<p class="list-group-item list-group-item-action border-1 eps">No Results. More info: <a href=""><u>Why cant I find my hashtag/tag?</u></a></p>';
    }
  }






?>
