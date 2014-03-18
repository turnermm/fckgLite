<?php
/**
 * 
 * Admin Panle for epub plugin
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     Myron Turner <turnermm02@shaw.ca>
 */

class admin_plugin_fckg extends DokuWiki_Admin_Plugin {

    private $results;
    
    function handle() {
     $msg="";
     $fckg_array = array('fckg_font','fckg_specials','fckg_dwplugin');
     $plugins = plugin_list('syntax'); 
     $list = array_diff($plugins ,$fckg_array);
     
    $list = implode  ("<li>\n"  , $list);   
     if($list ) {       
       $this->results = "<h2>Plugins</h3><ol><li>$list</ol>";
     }
     else $this->results="<h3>No applicable plugins found</h3>";     
    }
    
       
    function html() {        
       if($this->results) {
        ptln('<p><br />' .$this->results . '</p>');
       }
    }
 
}
