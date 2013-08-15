<?php

define("DOKU_INC", realpath(dirname(__FILE__).'/../../../../../../'). '/');
define("PAGES", DOKU_INC . 'data/pages/');
define("FCKEDITOR", realpath(dirname(__FILE__).'/../'). '/');
define('CONNECTOR', FCKEDITOR . 'filemanager/connectors/php/');
require_once(CONNECTOR . 'check_acl.php');
global $dwfck_conf;

$page = ltrim($_REQUEST['dw_id'], ':');
$page = str_replace(':', '/',$page);
$path = PAGES . $page . '.txt';
//file_put_contents('ajax-resp.txt', "dw_id=" . $_REQUEST['dw_id'] . "\npage=$page\npath=$path\n" );

$dwfck_conf = doku_config_values();  // needed for cleanID
$resp = "";
$headers = array();
$lines = file($path);

foreach ($lines as $line) {
   if (preg_match('/^=+([^=]+)=+\s*$/',$line,$matches)) {                            
          $suffix_anchor = "";
          $suffix_header = "";
          if(isset($headers[$matches[1]])) {
              $headers[$matches[1]]++;
              $suffix_anchor = $headers[$matches[1]]; 
              $suffix_header = " [$suffix_anchor]";
          }
          else {
            $headers[$matches[1]]=0;
          }
           
          $resp .=  trim($matches[1]) . $suffix_header . ";;" ;  
          $resp .= cleanID($matches[1]). $suffix_anchor . "@@" ;  
   }

}

$resp = rtrim($resp,'@');
echo  rawurlencode($resp);

echo "\n";
function doku_config_values() {
  $dwphp = DOKU_INC . 'conf/dokuwiki.php';
  $localphp = DOKU_INC . 'conf/local.php';
  if(file_exists($dwphp))
  {
  	include($dwphp);
    if(file_exists($localphp))
    {
      include($localphp);
    }
    return $conf;
  }

  return false;
}
?>

