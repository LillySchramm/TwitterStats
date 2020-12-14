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

if (isset($_POST['query'])) {

  $inpText = $_POST['query'];

  $sql = 'SELECT NAME FROM `eps_dump`.`dump` WHERE NAME LIKE :name ORDER BY COUNT DESC LIMIT 30';
  $stmt = $conn->prepare($sql);
  $stmt->execute(['name' => '%' . $inpText . '%']);
  $result = $stmt->fetchAll();

  if ($result) {

    foreach ($result as $row) {
      $n = $row['NAME'];
      echo '<a href="#" class="list-group-item list-group-item-action border-1">' . $n . '</a>';
    }

  }else{
    echo '<p class="list-group-item list-group-item-action border-1">No Results. More info: <a href="">Why cant I find my hashtag/tag?</a></p>';
  }
}






?>
