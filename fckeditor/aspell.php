
<?php 
require_once('is_aspellWindows.php');
$dw_conf_lang = "";
if(isset($_REQUEST['dw_conf_lang'])) {
  $dw_conf_lang = $_REQUEST['dw_conf_lang'];
}

$spell_chk_lang = isset($_COOKIE['FCK_aspell']) ?  $_COOKIE['FCK_aspell'] : '';

?>

<head>
<script language="javascript">
<?php  echo "var FCK_aspell_lang = '$spell_chk_lang';"; ?>
<?php  echo "var dw_conf_lang = '$dw_conf_lang';"; ?>

function check_lang() {
 var FCK_aspell = ""; 
 var cookie_array = document.cookie.split(/;/);
 for(i=0; i< cookie_array.length; i++) {
     if(cookie_array[i].match(/FCK_aspell/)) {
        var elems = cookie_array[i].split(/=/);
        FCK_aspell = elems[1];
        break;
     }
 }


}

function set_cookie(f) { 
      var selection = 'us_en';
      for(i=0; i < f.lang.length; i++) {
          if(f.lang[i].checked) {
                selection = f.lang[i].value;
          }
      }

       var nextFCKyear=new Date();
       nextFCKyear.setFullYear(nextFCKyear.getFullYear() +1 );
       document.cookie = 'FCK_aspell=' + selection +';path=\/;expires=' + nextFCKyear.toGMTString() + ';'; 
       window.close();      

       return true;
}
 if(FCK_aspell_lang) ;
</script> 
</head>
<body onload="check_lang();">
<FORM name="lang_sel" onsubmit="set_cookie(this)">
<b>
<?php
if($dw_conf_lang) {
echo "Default Dokuwiki Language: $dw_conf_lang<br >";
}

if($spell_chk_lang) {
echo "Currently Selected Spell-check Language: $spell_chk_lang<br />";
}

?>
</b>
<h3>Choose Language</h3>
<input type="submit" value='Confirm Selection'>

<?php
$_langs=<<<LANGS
a:167:{s:2:"aa";s:4:"Afar";s:2:"af";s:9:"Afrikaans";s:2:"ak";s:4:"Akan";s:2:"am";s:7:"Amharic";s:2:"ar";s:6:"Arabic";s:2:"as";s:8:"Assamese";s:2:"av";s:4:"Avar";s:2:"ay";s:6:"Aymara";s:2:"az";s:11:"Azerbaijani";s:2:"ba";s:7:"Bashkir";s:2:"be";s:10:"Belarusian";s:2:"bg";s:9:"Bulgarian";s:2:"bh";s:6:"Bihari";s:2:"bm";s:7:"Bambara";s:2:"bn";s:7:"Bengali";s:2:"bo";s:7:"Tibetan";s:2:"br";s:6:"Breton";s:2:"bs";s:7:"Bosnian";s:2:"ca";s:7:"Catalan";s:2:"ce";s:7:"Chechen";s:2:"co";s:8:"Corsican";s:3:"cop";s:6:"Coptic";s:2:"cs";s:5:"Czech";s:3:"csb";s:9:"Kashubian";s:2:"cv";s:7:"Chuvash";s:2:"cy";s:5:"Welsh";s:2:"da";s:6:"Danish";s:2:"de";s:6:"German";s:3:"dyu";s:5:"Dyula";s:2:"ee";s:3:"Ewe";s:2:"el";s:5:"Greek";s:2:"en";s:7:"English";s:2:"eo";s:9:"Esperanto";s:2:"es";s:7:"Spanish";s:2:"et";s:8:"Estonian";s:2:"eu";s:6:"Basque";s:2:"fa";s:7:"Persian";s:2:"ff";s:5:"Fulah";s:2:"fi";s:7:"Finnish";s:2:"fj";s:6:"Fijian";s:2:"fo";s:7:"Faroese";s:2:"fr";s:6:"French";s:3:"fur";s:8:"Friulian";s:2:"fy";s:7:"Frisian";s:2:"ga";s:5:"Irish";s:2:"gd";s:8:"Scottish";s:2:"gl";s:8:"Gallegan";s:2:"gn";s:7:"Guarani";s:2:"gu";s:8:"Gujarati";s:2:"gv";s:4:"Manx";s:2:"ha";s:5:"Hausa";s:2:"he";s:6:"Hebrew";s:2:"hi";s:5:"Hindi";s:3:"hil";s:10:"Hiligaynon";s:2:"ho";s:4:"Hiri";s:2:"hr";s:8:"Croatian";s:3:"hsb";s:5:"Upper";s:2:"ht";s:7:"Haitian";s:2:"hu";s:9:"Hungarian";s:2:"hy";s:8:"Armenian";s:2:"hz";s:6:"Herero";s:2:"ia";s:11:"Interlingua";s:2:"id";s:10:"Indonesian";s:2:"ig";s:4:"Igbo";s:2:"ii";s:7:"Sichuan";s:2:"io";s:3:"Ido";s:2:"is";s:9:"Icelandic";s:2:"it";s:7:"Italian";s:2:"jv";s:8:"Javanese";s:2:"ka";s:8:"Georgian";s:2:"kg";s:5:"Kongo";s:2:"ki";s:6:"Kikuyu";s:2:"kj";s:8:"Kwanyama";s:2:"kk";s:6:"Kazakh";s:2:"km";s:5:"Khmer";s:2:"kn";s:7:"Kannada";s:2:"kr";s:6:"Kanuri";s:2:"ks";s:8:"Kashmiri";s:2:"ku";s:7:"Kurdish";s:2:"kv";s:4:"Komi";s:2:"ky";s:7:"Kirghiz";s:2:"la";s:5:"Latin";s:2:"lb";s:13:"Luxembourgish";s:2:"lg";s:5:"Ganda";s:2:"li";s:10:"Limburgian";s:2:"ln";s:7:"Lingala";s:2:"lt";s:10:"Lithuanian";s:2:"lu";s:12:"Luba-Katanga";s:2:"lv";s:7:"Latvian";s:2:"mg";s:8:"Malagasy";s:2:"mi";s:5:"Maori";s:2:"mk";s:10:"Macedonian";s:2:"ml";s:9:"Malayalam";s:2:"mn";s:9:"Mongolian";s:2:"mo";s:9:"Moldavian";s:3:"mos";s:5:"Mossi";s:2:"mr";s:7:"Marathi";s:2:"ms";s:5:"Malay";s:2:"mt";s:7:"Maltese";s:2:"my";s:7:"Burmese";s:2:"nb";s:9:"Norwegian";s:2:"nd";s:5:"North";s:3:"nds";s:3:"Low";s:2:"ne";s:6:"Nepali";s:2:"ng";s:6:"Ndonga";s:2:"nl";s:5:"Dutch";s:2:"nn";s:9:"Norwegian";s:2:"nr";s:5:"South";s:3:"nso";s:8:"Northern";s:2:"nv";s:6:"Navajo";s:2:"ny";s:6:"Nyanja";s:2:"oc";s:7:"Occitan";s:2:"om";s:5:"Oromo";s:2:"or";s:5:"Oriya";s:2:"os";s:7:"Ossetic";s:2:"pa";s:7:"Punjabi";s:2:"pl";s:6:"Polish";s:2:"ps";s:6:"Pushto";s:2:"pt";s:10:"Portuguese";s:2:"qu";s:7:"Quechua";s:2:"rn";s:5:"Rundi";s:2:"ro";s:8:"Romanian";s:2:"ru";s:7:"Russian";s:2:"rw";s:11:"Kinyarwanda";s:2:"sc";s:9:"Sardinian";s:2:"sd";s:6:"Sindhi";s:2:"sg";s:5:"Sango";s:2:"si";s:9:"Sinhalese";s:2:"sk";s:6:"Slovak";s:2:"sl";s:9:"Slovenian";s:2:"sm";s:6:"Samoan";s:2:"sn";s:5:"Shona";s:2:"so";s:6:"Somali";s:2:"sq";s:8:"Albanian";s:2:"sr";s:7:"Serbian";s:2:"ss";s:5:"Swati";s:2:"st";s:8:"Southern";s:2:"su";s:9:"Sundanese";s:2:"sv";s:7:"Swedish";s:2:"sw";s:7:"Swahili";s:2:"ta";s:5:"Tamil";s:2:"te";s:6:"Telugu";s:3:"tet";s:5:"Tetum";s:2:"tg";s:5:"Tajik";s:2:"ti";s:8:"Tigrinya";s:2:"tk";s:7:"Turkmen";s:2:"tl";s:7:"Tagalog";s:2:"tn";s:6:"Tswana";s:2:"to";s:5:"Tonga";s:2:"tr";s:7:"Turkish";s:2:"ts";s:6:"Tsonga";s:2:"tt";s:5:"Tatar";s:2:"tw";s:3:"Twi";s:2:"ty";s:8:"Tahitian";s:2:"ug";s:6:"Uighur";s:2:"uk";s:9:"Ukrainian";s:2:"ur";s:4:"Urdu";s:2:"uz";s:5:"Uzbek";s:2:"ve";s:5:"Venda";s:2:"vi";s:10:"Vietnamese";s:2:"wa";s:7:"Walloon";s:2:"wo";s:5:"Wolof";s:2:"xh";s:5:"Xhosa";s:2:"yi";s:7:"Yiddish";s:2:"yo";s:6:"Yoruba";s:2:"za";s:6:"Zhuang";s:2:"zu";s:4:"Zulu";}
LANGS;
global $iswindowsScript;
$langs = unserialize($_langs);
exec("$aspell_prog dump dicts", $dicts,$retv);

$cdicts =  count($dicts);

if($cdicts ==  0 || !$dicts) {
 echo  '<br /><b>Either no language dictionaries are installed or the aspell binary was not found</b><br />';
 if($retv) {
     echo '<b>On some systems aspell may not be in a path accessible to the server</b></br>';
 }  
    echo "</br>You currently have aspell set to <b>$aspell_prog</b> in $iswindowsScript";

 }


$count =1;
$next = "";

echo '<TABLE cellspacing=4 border=0>';
    foreach ($dicts as $dict) {
      if(preg_match('/^([a-z]+)\-?.*$/', $dict, $matches)) {              
          if($matches[1] != $next) {
             $count =1;
             $next=$matches[1];
             if(isset($langs[$next])) {
               echo '<tr><th align="left" colspan="3"><br />' . $langs[$next] . '</th><tr>';       
             }       
       
          }
      }
     $selected = '';
     if($dict == $spell_chk_lang)  $selected = 'checked';
      echo "<td><input type='radio' name='lang' value='$dict' $selected> $dict &nbsp;";
      $count++;
      if($count %4 == 0) {
           $count =1;
           echo "<tr>"; 
      }
    }
   echo '</table>';
?>

</form>

</body>

