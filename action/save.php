<?php
if(!defined('DOKU_INC')) define('DOKU_INC',realpath(dirname(__FILE__).'/../../../').'/');
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
if(!defined('DOKU_MEDIA')) define('DOKU_MEDIA',DOKU_INC.'data/media/');
define ('BROKEN_IMAGE', DOKU_URL . 'lib/plugins/fckg/fckeditor/userfiles/blink.jpg?nolink&33x34');
require_once(DOKU_PLUGIN.'action.php');
define('FCK_ACTION_SUBDIR', realpath(dirname(__FILE__)) . '/');
/**
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 */

class action_plugin_fckg_save extends DokuWiki_Action_Plugin {
    /**
     * Constructor
     */
    function action_plugin_fckg_save(){
    }



    function register(Doku_Event_Handler $controller) {
  
        $controller->register_hook('DOKUWIKI_STARTED', 'BEFORE', $this, 'fckg_save_preprocess');
    }

    function fckg_save_preprocess(&$event){
        global $ACT;
        if (!isset($_REQUEST['fckg']) || ! is_array($ACT) || !(isset($ACT['save']) || isset($ACT['preview']))) return;
     
        global $TEXT;
        if (!$TEXT) return;

        $TEXT = $_REQUEST['fck_wikitext'];
        
        if(!preg_match('/^\s+(\-|\*)/',$TEXT)) {    
              $TEXT = trim($TEXT);
        }

    if(strpos($TEXT,'data:image') !== false) {
        $TEXT = preg_replace_callback(
             '|\{\{(\s*)data:image\/(\w+;base64,)(.*?)\?nolink&(\s*)\}\}|ms',
             create_function(
                '$matches',
                'list($ext,$base) = explode(";",$matches[2]);
                if($ext == "jpeg") $ext = "jpg";      
                 if(function_exists("imagecreatefromstring") && !imagecreatefromstring (base64_decode($matches[3]))) {
                     msg("Clipboard paste: invalid $ext image format");
                     return "{{" . BROKEN_IMAGE .  "}}";
                 }                 
                  global $INFO,$conf;                 
                  $ns = getNS($INFO["id"]);                                    
                  $ns = trim($ns);
                  if(!empty($ns)) {                     
                      $ns = ":$ns:";
                       $dir = str_replace(":","/",$ns);                     
                  }
                  else {  // root namespace
                      $dir = "/";
                      $ns = ":";
                  }
                 $fn = md5($matches[3]) . ".$ext";
                 $path = $conf["mediadir"] . $dir .  $fn;   
                 @io_makeFileDir($path);
                 if(!file_exists($path)) {
                    @file_put_contents($path, base64_decode($matches[3]));
                 }
                 else {
                     msg("file for this image previousely saved",2);
                 }
                 $left = "{{";
                 $right = "}}";
                 if($matches[1]) $left .= $matches[1];
                 if($matches[4]) $right = $matches[4] . $right;
                 
                $retv = "$left" . $ns. $fn . "$right";              
                 return $retv;'
             ),
             $TEXT
             );
        }   

      $TEXT = str_replace('%%', "FCKGPERCENTESC",  $TEXT);
     
          $TEXT = preg_replace_callback('/^(.*?)(\[\[.*?\]\])*(.*?)$/ms', 
               create_function(
                     '$matches',         
                     '$matches[1] = preg_replace("/%([A-F]+)/i", "URLENC_PERCENT$1", $matches[1]);
                      $matches[3] = preg_replace("/%([A-F]+)/i", "URLENC_PERCENT$1", $matches[3]);
                      return $matches[1].$matches[2].$matches[3];'            
                ),
                $TEXT
             );
        

        $TEXT = rawurldecode($TEXT);
        $TEXT = preg_replace('/NOWIKI_(.)_/', '$1',$TEXT);
        $TEXT = preg_replace('/URLENC_PERCENT/', '%',$TEXT); 
          /* preserve newlines in code blocks */
          $TEXT = preg_replace_callback(
            '/(<code>|<file>)(.*?)(<\/code>|<\/file>)/ms',
            create_function(
                '$matches',         
                'return  str_replace("\n", "__code_NL__",$matches[0]);'
            ),
            $TEXT
          );

        $TEXT = preg_replace('/^\s*[\r\n]$/ms',"__n__", $TEXT);
        $TEXT = preg_replace('/\r/ms',"", $TEXT);
        $TEXT = preg_replace('/^\s+(?=\^|\|)/ms',"", $TEXT);    
        $TEXT = preg_replace('/__n__/',"\n", $TEXT);
        $TEXT = str_replace("__code_NL__","\n", $TEXT);
        $TEXT = str_replace("FCKGPERCENTESC", '%%',  $TEXT);
        if($this->getConf('complex_tables')) {
            $TEXT = str_replace('~~COMPLEX_TABLES~~','',$TEXT);
        }        
        $TEXT .= "\n";
        // Removes relics of markup characters left over after acronym markup has been removed
        //$TEXT = preg_replace('/([\*\/_]{2})\s+\\1\s*([A-Z]+)\s*\\1+/ms',"$2",$TEXT);
      
         $pos = strpos($TEXT, 'MULTI_PLUGIN_OPEN');
         if($pos !== false) {
            $TEXT = preg_replace_callback(
             '|MULTI_PLUGIN_OPEN.*?MULTI_PLUGIN_CLOSE|ms',
             create_function(
                 '$matches',
                   'return  preg_replace("/\\\\\\\\/ms","\n",$matches[0]);'
             ),
             $TEXT
           );

            $TEXT = preg_replace_callback(
             '|MULTI_PLUGIN_OPEN.*?MULTI_PLUGIN_CLOSE|ms',
             create_function(
                 '$matches',
                   'return  preg_replace("/^\s+/ms","",$matches[0]);'
             ),
             $TEXT
           );

         }
 
        $this->replace_entities();

       $TEXT = preg_replace('/__QUOTE__/ms',">",$TEXT);
       $TEXT = preg_replace('/[\t\x20]+$/ms',"",$TEXT);
       $TEXT = preg_replace('/\n{4,}/ms',"\n\n",$TEXT);
       $TEXT = preg_replace('/\n{3,}/ms',"\n\n",$TEXT);
     
         return;
    
    }

function replace_entities() {
global $TEXT;
global $ents;
    $serialized = FCK_ACTION_SUBDIR . 'ent.ser';
    $ents = unserialize(file_get_contents($serialized));

       $TEXT = preg_replace_callback(
            '|(&(\w+);)|',
            create_function(         
                '$matches',
                'global $ents; return $ents[$matches[2]];'
            ),
            $TEXT
        );
    
}


function write_debug($data) {
return;
  if (!$handle = fopen('save.txt', 'a')) {
    return;
    }

    // Write $somecontent to our opened file.
    fwrite($handle, "save.php: $data\n");
    fclose($handle);

}
} //end of action class
?>
