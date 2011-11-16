<?php
/**
 *
 * 
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     Myron Turner <turnermm02@shaw.ca>
 */

// Syntax: <color somecolour/somebackgroundcolour>
 
// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();
 
if(!defined('DOKU_PLUGIN')) define('DOKU_PLUGIN',DOKU_INC.'lib/plugins/');
require_once(DOKU_PLUGIN.'syntax.php');
 
/**
 * All DokuWiki plugins to extend the parser/rendering mechanism
 * need to inherit from this class
 */
class syntax_plugin_fckg_font extends DokuWiki_Syntax_Plugin {
 
    /**
     * return some info
     */
    function getInfo(){
        return array(
            'author' => 'Myron Turner',
            'email'  => 'turnermm02@shaw.ca',
            'date'   => '2007-12-26',
            'name'   => 'Font Plugin',
            'desc'   => 'Changes font size and face',
            'url'    => 'http://www.mturner.org/development/',
        );
    }
 
    function getType(){ return 'formatting'; }
    function getAllowedTypes() { return array('formatting', 'substition', 'disabled'); }   
    function getSort(){ return 158; }
    function connectTo($mode) { $this->Lexer->addEntryPattern('<font.*?>(?=.*?</font>)',$mode,'plugin_fckg_font'); }
    function postConnect() { $this->Lexer->addExitPattern('</font>','plugin_fckg_font'); }
 
 
    /**
     * Handle the match
     */
    function handle($match, $state, $pos, &$handler){


        switch ($state) {
          case DOKU_LEXER_ENTER :
                list($size, $face) = preg_split("/\//u", substr($match, 6, -1), 2);
                if(isset($size)) {
                        list($size,$weight) = explode(':',$size); 
                        $size = "font-size:$size;";
                        if(isset($weight) && $weight) {
                           $size .= " font-weight:$weight; ";
                        }

                }
                           
                return array($state, array($size, $face));
 
          case DOKU_LEXER_UNMATCHED :  return array($state, $match);
          case DOKU_LEXER_EXIT :       return array($state, '');
        }
        return array();
    }
 
    /**
     * Create output
     */
    function render($mode, &$renderer, $data) {
        if($mode == 'xhtml'){
            list($state, $match) = $data;

            switch ($state) {
              case DOKU_LEXER_ENTER :      
                list($style, $face) = $match;
                if(isset($face)) {
                    list($face,$fg,$bg) = explode(';;',$face);
                    if(isset($fg)) {
                         $color = " color: $fg; ";  
                         $style .= $color;
                            
                    }
                    if(isset($bg)) {
                         $color = " background-color: $bg ";  
                         $style .= $color;
                            
                    }

                }
                $style = "font-family: $face; $style";
                $renderer->doc .= "<span face='$face' style='$style'>"; 
                break;
 
              case DOKU_LEXER_UNMATCHED :  $renderer->doc .= $renderer->_xmlEntities($match); break;
              case DOKU_LEXER_EXIT :       $renderer->doc .= "</span>"; break;
            }
            return true;
        }
        return false;
    }
 
 
}
?>
