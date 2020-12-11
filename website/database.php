<?php

$list = array();
$s_date = "";

function connectToServer($value='')
{
  $MSQL_CON = new mysqli("","","");

  if ($MSQL_CON -> connect_errno) {
    echo "Failed to connect to MySQL: " . $MSQL_CON -> connect_error;
    exit();
  }

  return $MSQL_CON;
}

function genDate($offset)
{
  $s_date = strval(date("Y"));
  $s_date .= ":".intval(date('m')).":".intval(date('d'))."::".intval(date('H'));

  return $s_date;
}

function checkIfTableExists($tablename, $con)
{
  $sql =  "SELECT * FROM INFORMATION_SCHEMA.TABLES where TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = '".$tablename."'";
  $result = $con->query($sql);

  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {      
      return TRUE;
    }
  } else {
    echo "0 results ";
    return FALSE;
  }
}

function genList($con) {
  $s_date = genDate(0);
  checkIfTableExists("tags_".$s_date, $con);
}

$MSQL_CON = connectToServer();
genList($MSQL_CON);




 ?>
