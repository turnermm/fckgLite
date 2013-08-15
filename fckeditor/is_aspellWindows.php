<?php
$aspell_win = '"C:\Program Files\Aspell\bin\aspell.exe" ';
$aspell_prog = 'aspell';

function aspell_isWindowsOS() {  
  if(isset($_SERVER['WINDIR']) && $_SERVER['WINDIR']) {
      return true;
  }
  elseif(stristr(PHP_OS, 'WIN') && !aDWFCK_is_OS('DARWIN')) {
     return true;
  }  
  return false;
}


function aDWFCK_is_OS($os) {
  $os = strtolower($os);
  $_OS = strtolower(PHP_OS);

  if($os == $_OS || stristr(PHP_OS, $os) || stristr($os,PHP_OS) ) {
        return true;
  }
  return false;
}

global $iswindowsScript;
$iswindowsScript = __FILE__;

if(aspell_isWindowsOS()) {
  $aspell_prog = $aspell_win;
}

