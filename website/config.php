<?php
  const TOP_X = 30;

  const DBHOST = '';
  const DBUSER = '';
  const DBPASS = '';

  $dsn = 'mysql:host=' . DBHOST . '';

  $conn = null;

  try {
    $conn = new PDO($dsn, DBUSER, DBPASS);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    die('Error : ' . $e->getMessage());
  }
?>
