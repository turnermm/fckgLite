function FCKBreakToParagraph(p) {

}

FCKCommands.RegisterCommand( 'Delete_BR' , new FCKBreakToParagraph('paragraphToLineBreak') ) ; 

// Create a toolbar button 
var oDelBreak		= new FCKToolbarButton( 'Delete_BR', '<BR> to <P>' ) ;
oDelBreak.IconPath	= FCKConfig.PluginsPath + 'breakdel/delete_br.gif' ;

FCKToolbarItems.RegisterItem( 'Delete_BR', oDelBreak ) ;	

// put it into the contextmenu 
FCK.ContextMenu.RegisterListener( {
	AddItems : function( menu, tag, tagName ) {
		// when the option is displayed, show a separator then the command
		menu.AddSeparator() ;
		// the command needs the registered command name, the title for the context menu, and the icon path
		menu.AddItem( 'Delete_BR', '<BR> to <P>', oDelBreak.IconPath) ;
	}
}
);


FCKBreakToParagraph.prototype.Execute = function() {
  var oEditor = FCKBreakToParagraph.oEditor;
  if(!oEditor) {
    oEditor = top.oDokuWiki_FCKEditorInstance.EditorWindow.parent;
  }
 
    var oBreakDel = new FCK.breakDelObject(oEditor);
    str =  oBreakDel.debug();

    if(!str) {
       alert('Please select the lines to edit');
       return;
    }
    oBreakDel.replace();

};

FCKBreakToParagraph.prototype.GetState = function()  
{  
	return FCK_TRISTATE_OFF;  
};  
 

var oEditorStatusInstance;
FCKBreakToParagraph._StatusListener = function(editorInstance){
    if(FCK_STATUS_COMPLETE){
      FCKBreakToParagraph.oEditor = editorInstance.EditorWindow.parent;
    }
}
FCK.Events.AttachEvent('OnStatusChange',FCKBreakToParagraph._StatusListener);

