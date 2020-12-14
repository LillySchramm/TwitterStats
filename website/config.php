<?php
  const TOP_X = 30;
  const MAX_HOURS_BACK = 30 * 24;

  const DBHOST = '';
  const DBUSER = '';
  const DBPASS = '';

  $dsn = 'mysql:host=' . DBHOST . '';

  $conn = null;

  function genDate($offset)
  {
    $currentTime = time();
    $timeToSubtract = ($offset * 60 * 60);
    $timeInPast = $currentTime - $timeToSubtract;
    $s_date = strval(date("Y", $timeInPast));
    $s_date .= ":".intval(date('m', $timeInPast)).":".intval(date('d', $timeInPast))."::".intval(date('H', $timeInPast));

    return $s_date;
  }

  function genDateForGraph($offset)
  {
    $currentTime = time();
    $timeToSubtract = ($offset * 60 * 60);
    $timeInPast = $currentTime - $timeToSubtract;
    $s_date = "";
    $s_date .= intval(date('d', $timeInPast)).".".intval(date('m', $timeInPast)). " " . intval(date('H', $timeInPast)). "h";

    return $s_date;
  }

  function startsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    return substr( $haystack, 0, $length ) === $needle;
  }

  function doesTableExist($table_name, $conn)
  {
    $sql = "SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = '".$table_name."';";
    $result = executeSQL($sql, [], $conn);

    if($result){
      return true;
    }else{
      return false;
    }
  }

  function executeSQL($sql, $insert,$conn)
  {    
    $stmt = $conn->prepare($sql);
    $stmt->execute($insert);
    return $stmt->fetchAll();
  }

  try {
    $conn = new PDO($dsn, DBUSER, DBPASS);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    die('Error : ' . $e->getMessage());
  }
?>
