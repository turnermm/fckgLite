<?php
$mimes = realpath(dirname(__FILE__).'/../../../../').'/conf/mime.conf';
$mimes_local = realpath(dirname(__FILE__).'/../../../../').'/conf/mime.local.conf';

if(!file_exists($mimes)){
    $preload = realpath(dirname(__FILE__).'/../../../../') . '/inc/preload.php';         
    require($preload);
   $mimes = DOKU_CONF . 'mime.conf';
   $mimes_local = DOKU_CONF .'mime.local.conf';
 }   
 
$out=@file($mimes,FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  
if(file_exists($mimes_local))
  {
  	$out_local = @file($mimes_local,FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);  	
  	$out = array_merge($out,$out_local);
  }

   foreach($out as $line) {
      if(strpos($line,'#') ===  false) {
         list($ext,$mtype)  = preg_split('/\s+/', $line); 
         $extensions[] = $ext;
		 if(strpos($mtype,'image')!==false) {
		     $image_extensions[] = $ext;
		 }
     }
  }
 
#print_r($image_extensions);
echo implode("|",$image_extensions);
?>
