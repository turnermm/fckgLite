<?php
/**
 * 
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     Myron Turner <turnermm02@shaw.ca>
 */

// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();
 
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN.'syntax.php');
require_once(DOKU_INC . 'inc/io.php');

/**
 * All DokuWiki plugins to extend the parser/rendering mechanism
 * need to inherit from this class
 */
class syntax_plugin_fckg_dwplugin extends DokuWiki_Syntax_Plugin {
  var $plugin_ref;
  var $escaped_pattern;
  var $missing_middle = array();
  var $plugin_name;
  var $our_keys = array();
 
   function syntax_plugin_fckg_dwplugin() {
      global $EVENT_HANDLER;
      $EVENT_HANDLER->register_hook('PARSER_CACHE_USE', 'AFTER', $this, 'cache_bypass_after');
   }


 
    function getType(){ return 'formatting'; }
    function getAllowedTypes() { return array('formatting','substition'); }   
    function getSort(){ return 80; }
    function connectTo($mode) {
         $this->Lexer->addSpecialPattern('<plugin.*?</plugin>',$mode,'plugin_fckg_dwplugin'); 
       }

    function handle($match, $state, $pos, &$handler){     
   
   
    $retv = $this->is_stet($match);
    if($retv) {
        return array($state,"$retv ");
     }
     $match = preg_replace('/\\\\\\\\/',"", $match);
     if(isset($_REQUEST['do']) && $_REQUEST['do'] == 'edit') {

         list($title, $pattern) = explode('>',substr($match,7,-9),2);          
         $pattern=trim($pattern);

           // escape '<' and '>' using ~ for escape character
         $pattern = preg_replace('/(?<!~)(<+)(?!~)/', '~' . '\\1' . '~',$pattern);   
         $pattern = preg_replace('/(?<!~)(>+)(?!~)/','~' . '\\1' . '~',$pattern); 
         $match = "<plugin $title>$pattern</plugin>";

         return array($state,$match); 
     }
       
    
      global $DOKU_PLUGINS; 
      global $INFO; 
  
      $this->syntax = $DOKU_PLUGINS['syntax']['info']->Lexer;
      
      $this->escaped_pattern = false;  
      if(preg_match('/~(<+)~/',$match)) {
         $this->escaped_pattern = true;
      }
      $match = preg_replace('/[~]+(<+)[~]+/','\\1',$match); 
      $match = preg_replace('/[~]+(>+)[~]+/','\\1',$match); 
  
      $mode = 'xhtml';
      $file = DOKU_INC."inc/parser/$mode.php";      
      @require_once($file);

      list($title, $pattern) = explode('>',substr($match,7,-9),2);
      if(!$title) return array($state,"");


      list($t,$plugin) =  explode('=',$title);      
      $plugin=trim($plugin); 
      $pattern=trim($pattern);
           
      $match = preg_replace('/<\/plugin>/',"", $match);
      $match = preg_replace('/^\s*<plugin\s+title=.*?>/',"", $match);
            
      $plugin = $this->getPluginName($match, $plugin);  
      if(!$plugin) return array($state,"");
     
     $this->meta_io(false,array('dwplugin'=>time())); 
       
     $id = $$INFO['id'];
  

      $match = $pattern;

      if(isset($plugin)) {
         $plugin_name = $plugin;
         $this->plugin_ref = $this->setup_plugin($plugin,$pattern);

         if($this->plugin_ref) { 
             list($entry_patterns, $middle_patterns, $_exit) = $this->getPatterns($plugin);
             if(!$entry_patterns) {
                return array($state,"");
             }
             $entry_match = $this->getEntryMatch($match, $entry_patterns);
             if(!$entry_match) {
                 $match = preg_replace('/<\s*/','<', $match);
                 $entry_match = $this->getEntryMatch($match, $entry_patterns);
             }
             $middle = $this->getMiddleMatches($match,$entry_match, $middle_patterns, $_exit);         
            if($_exit) {
                preg_match("/($_exit)/", $match, $exit_matches); 
                $_exit = $exit_matches[1];
            }           
   
      $regex = '/' . preg_quote($entry_match, '/') . '(.*?)' . preg_quote($_exit, '/')  . '/';   
   
      if(preg_match( $regex, $match, $matches)) {
               $plugin_name = $this->get_key($matches[1], $plugin);
 
            //   $str = substr($matches[1],0,25);                
            //   $plugin_name = $plugin . str_replace(' ', '', $str); 

               $this->missing_middle[$plugin_name] = $matches[1];             
                        
      }
                   
             return $this->write_plugin($entry_match, $middle, $_exit, $plugin_name);
         }
      }

       return array($state,"");
    }
 
    function is_stet($match) {
         list($title, $pattern) = explode('>',substr($match,7,-9),2);          
         $pattern=trim($pattern);

         list($name,$value)=explode('=', $title);
         global $ACT;
       
         $value=trim($value);
         $value=trim($value,'"\'');
         if($value == 'stet') {
             $pattern = preg_replace('/<\s+/', "<", $pattern);
             $pattern = preg_replace('/\s+>/', ">", $pattern);
             $pattern = str_replace('%%',"",$pattern);
             if ($ACT == 'edit'){
                $pattern = str_replace('<',"< ",$pattern);
                $pattern = str_replace('>'," >",$pattern);
            }
             $pattern = htmlspecialchars($pattern);
             $pattern = str_replace("\n","<br />",$pattern);
             $match = "<plugin $title>$pattern</plugin>";

             return $match;
         }

       return false;
    }

    function write_plugin($entry_match, $middle, $_exit, $plugin_name) {
  
     
        $save_state = array();
        $save_match = array();

        $enter_state = $_exit ? DOKU_LEXER_ENTER : DOKU_LEXER_SPECIAL;                
        list($state, $match) = $this->plugin_ref->handle($entry_match, $enter_state, $pos, $handler);  
        $save_state[] = $state;      
        $save_match[] = $match;     

        $data = $middle[0];
        $states = $middle[1];
        for($i=0; $i < count($data); $i++) {
            list($state, $match) = $this->plugin_ref->handle($data[$i], $states[$i], $pos, $handler);           
            $save_state[] = $state;      
            $save_match[] = $match;      
        }
      
    
        if($_exit) {
            list($state, $match) = $this->plugin_ref->handle($_exit, DOKU_LEXER_EXIT, $pos, $handler);  
            $save_state[] = $state;      
            $save_match[] = $match;     
        }

      $Renderer =  new Doku_Renderer_xhtml();
      for($i=0; $i < count($save_state); $i++) {                
           $this->plugin_ref->render('xhtml', $Renderer, array($save_state[$i], $save_match[$i]));
      }

      
      
      return array($state, $Renderer->doc . ":::$plugin_name");
  
    }



    function & setup_plugin($plugin, $pattern) {         
         global  $DOKU_PLUGINS;

         $plugin_name = ltrim($plugin, '_');
         $plugin_name = substr($plugin_name,7); // remove 'plugin_'               
  
         $p_ref = & plugin_load('syntax', $plugin_name);   
      
         if(!$p_ref)
         {     
            $p_ref =  &plugin_load('syntax', $plugin);         
           
            if(!$p_ref) {  // if above fails create class name and try to instantiate it
                $func = 'syntax_plugin_'.$plugin_name;
                if(class_exists($func,false)) {  
                    $p_ref = new $func();
                }
            }
         }

        
         return $p_ref;
    }


    /**
     * Create output
     */
    function render($mode, &$renderer, $data) {

  
        if($mode == 'xhtml'){
         global $INFO;
            list($state, $match_open) = $data;
            list($match,$plugin_name) = explode(':::',$match_open);
           
            $match = str_replace ('&amp;lt;p&amp;gt;',  '<p>', $match);
            $match = str_replace ('&lt;p&gt;',  '<p>', $match);
            $match = str_replace ('&amp;lt;br&amp;gt;',  '<br>', $match);
            $match = str_replace ('&lt;br&gt;',  '<br>', $match);
            $m_middle = $this->missing_middle[$plugin_name] ? $this->missing_middle[$plugin_name] : false;
            if($m_middle && preg_match('/(.*?)>[\n\s]+<(.*)/', $match, $matches)) {   
                   $match = $matches[1] . '>' . $m_middle . '<' . $matches[2];
            }
            elseif($m_middle && preg_match('/(.*?)><(.*)/', $match, $matches)) {   
                   $match = $matches[1] . '>' . $m_middle . '<' . $matches[2];
            } 
            $renderer->doc .= $match;  
           
              
            return true;         
         }
        
              
        return false;
    } 



    function regex_esc($str) {
       return preg_replace('/([\/])/', '\\\\' . "$1", $str);
    }

    function getEntryMatch($text, $regexes) {
  
        foreach ($regexes as $regex) {
            $regex = "/($regex)/";  
            if(preg_match( $regex, $text, $matches) ) {
            return $matches[0];
            }   
        }

        return null;
    }

    function getPatterns($plugin) {

         global $syntax;

         $syntax = $this->syntax;
         $regexes = $this->syntax->_regexes;
         $base_patterns = $syntax->_regexes['base']->_patterns;
         $base_labels= $syntax->_regexes['base']->_labels;
     
 
         $base_keys = array_keys($base_labels,$plugin, true);   
         if(!$base_keys) {
             return array(null,null,null);
         }
         // save base patterns
         for($i=0; $i<count($base_keys); $i++) {       
              $patterns[] = $base_patterns[$base_keys[$i]];  
         }
    
          // check to see if there is a separate entry for this plugin in the regexes array
         if(!isset($syntax->_regexes[$plugin])) {
             return array($patterns,array(), "");
         }

          // load the plugin's patterns and labels
         $plugin_patterns = $syntax->_regexes[$plugin]->_patterns;
         $plugin_labels= $syntax->_regexes[$plugin]->_labels;     

         $plugin_keys = array_keys($plugin_labels,$plugin, true);    

         for($i=0; $i<count($plugin_keys); $i++) {   
             $patterns[] = '(' . $this->regex_esc($plugin_patterns[$plugin_keys[$i]]) . ')';
         }
      
        $patterns = array_unique($patterns);

        $plugin_internal_keys = array_keys($plugin_labels,TRUE, true);  
        $plugin_exitkey = array_search('__exit', $plugin_labels, true);  
  
        $internals =  array();
        for($i=0; $i<count($plugin_internal_keys); $i++) {   
             $internals[] = '(' . $this->regex_esc($plugin_patterns[$plugin_internal_keys[$i]]) . ')';
        }   
 
        if($plugin_exitkey) {
            $_exit_pattern = $plugin_patterns[$plugin_exitkey];
            $_exit_pattern = $this->regex_esc($_exit_pattern);
        }
        else {
            $_exit_pattern = "";
        }
       return array($patterns, $internals, $_exit_pattern);
    }

    function getPluginName($text, $input_name="") {
       
        $syntax = $this->syntax;
        $patterns = array(); 
        $base_patterns = $syntax->_regexes['base']->_patterns;
        $base_labels= $syntax->_regexes['base']->_labels;

        for($i=0; $i < count($base_labels); $i++) {
            if(preg_match('/plugin/', $base_labels[$i])) {            
                $patterns[] = array($i => $base_patterns[$i]);
            }
        }

      foreach($patterns as $pattern) {
         list($index, $regex) = each($pattern);
         if(preg_match('/' . $regex . '/', $text)) {       
              return $base_labels[$index];
         }
    
      }

       if(!$input_name) return null;
       $input_name=str_replace ('"', "", $input_name);
       $needle = 'plugin_' . $input_name; 
       $key = array_search ($needle, $syntax->_regexes['base']->_labels, true);  
       if($key === false) {
           $needle = '_' . $needle;
           $key = array_search ($needle, $syntax->_regexes['base']->_labels, true);  
           if($key === false) {
                return null;
           }
       }      
             

      if($key === false) return null;

      return $base_labels[$key];  
    }


    function getMiddleMatches($text,$entry_match, $patterns, $exit_pattern) {

      if(!$patterns) return array(null, null);

      $len = strlen($entry_match);
      $remainder = substr($text,$len);
      $remainder = preg_replace('/'. $exit_pattern .'$/',"", $remainder);
      $remainder = str_replace ( '<p>', '&lt;p&gt;', $remainder);

        $regexes = '/'. implode('|',$patterns) ."/"; 
        $split = preg_split($regexes,$remainder,-1,PREG_SPLIT_DELIM_CAPTURE);

        $matches = array();
        for($i=0; $i<count($split); $i++) {
        
            if($split[$i]) {
                if(preg_match($regexes,$split[$i])) {
                    $matches[$i] = DOKU_LEXER_MATCHED;
                }
                else {
                    $matches[$i] = DOKU_LEXER_UNMATCHED;
                }
            }
            else {
                $matches[$i] = DOKU_LEXER_UNMATCHED;
            }        
        }
   
       return array($split,$matches);
    }

function meta_io ($read_only,$data=array()) {
     global  $INFO, $conf;
       
      $meta_path = str_replace(':', '/', $INFO['id']);
      $meta_path = $conf['metadir']  . '/' . $meta_path . '.meta';


      if(file_exists($meta_path)) {
         $meta = file_get_contents($meta_path);
      }
      
      $meta = unserialize($meta);
      if($read_only) return $meta;
     
      require_once(DOKU_INC . 'inc/io.php');
      $data_added = false;
      foreach ($data as $key=>$datum) {
      if(isset($meta[$key]) && $meta[$key] == $datum) {
            continue;
       }
       else {
           $meta ['persistent'][$key]=$datum;          
           $meta [$key]=$datum;
           $data_added = true;
           }
      }
     

    if(!$data_added) return;
   
     $data = serialize($meta);
     io_saveFile($meta_path, $data);

}
 

    function cache_bypass_after(&$event, $param) 
    {  
    
  

     global $INFO; 
  
    $meta_data = $this->meta_io (true); 
 
    $timestamp = time() + (5000*24*60*60);

    if(isset($meta_data['persistent']['dwplugin']) &&  $meta_data ['persistent']['dwplugin'] > 0) {
           $timestamp = $meta_data ['persistent']['dwplugin'];     
         }
    else if(isset($meta_data['dwplugin']) &&  $meta_data['dwplugin'] > 0) {
           $timestamp = $meta_data ['dwplugin'];     
      }
     
    $tmp = time() + (24*60*60);  // one day
  
    if($timestamp < $tmp) {
           $event->result=false; 
        
    }

  
   }

   function cache_bypass(&$event, $param)
    {
       
  
    }


   /* create unique key for each plugin on page */
   function get_key($text, $plugin="") {
     
    $replace = array();

    $str = substr($text,0,25);  
    $str = preg_replace('/[\/\'\"]/',"",$str);
    $key = $plugin . str_replace(' ', '', $str);     
    $key = strtolower($key); 
      

    $a = rand(97, 104);
    $b = rand(105, 112);
    $c = rand(113, 120);
    $replace[chr($a)] = chr($a+1);
    $replace[chr($b)] = chr($b+1);
    $replace[chr($c)] = chr($c+1);  
  
    $key = strtr($key, $replace);
    if(isset($this->our_keys[$key])) {
            $key = str_replace(chr($a+1),chr($a),$key);
            $key = strtoupper($key);
    }
    $this->our_keys[$key] = $key;
  
    return $key;
  }


  function write_debug($what) {
 // return; 
     $handle = fopen("dwplugin_debug.txt", "a");
     fwrite($handle, "$what\n");
     fclose($handle);
  }
}
 

