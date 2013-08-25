function FCKParagraphToLineBreak(p) {

}

FCKCommands.RegisterCommand( 'Delete_P' , new FCKParagraphToLineBreak('paragraphToLineBreak') ) ; 


 // FCKCommands.RegisterCommand( 'Delete_P',  new FCKDialogCommand( "Delete P", "Delete P",  FCKConfig.PluginsPath + 'paradelete/paradelete.html',  450, 300 ) ) ;


// Create a toolbar button 
var oDelPara		= new FCKToolbarButton( 'Delete_P',FCKLang.ParagraphToBreak ) ;
oDelPara.IconPath	= FCKConfig.PluginsPath + 'paradelete/delete_p.gif' ;

FCKToolbarItems.RegisterItem( 'Delete_P', oDelPara ) ;	

// put it into the contextmenu 
FCK.ContextMenu.RegisterListener( {
	AddItems : function( menu, tag, tagName ) {
		// when the option is displayed, show a separator then the command
		menu.AddSeparator() ;
		// the command needs the registered command name, the title for the context menu, and the icon path
		menu.AddItem( 'Delete_P', FCKLang.ParagraphToBreak, oDelPara.IconPath) ;
	}
}
);


FCKParagraphToLineBreak.prototype.Execute = function() {
  var oEditor = FCKParagraphToLineBreak.oEditor;
  if(!oEditor) {
    oEditor = top.oDokuWiki_FCKEditorInstance.EditorWindow.parent;
  }
 
    var oParaDel = new FCK.paraDelObject(oEditor);
    str =  oParaDel.debug();
    if(!str) {
       alert('Please select the lines to edit');
       return;
    }
    oParaDel.replace();

};

FCKParagraphToLineBreak.prototype.GetState = function()  
{  
	return FCK_TRISTATE_OFF;  
};  
 

var oEditorStatusInstance;
FCKParagraphToLineBreak._StatusListener = function(editorInstance){
    if(FCK_STATUS_COMPLETE){
      FCKParagraphToLineBreak.oEditor = editorInstance.EditorWindow.parent;
    }
}
FCK.Events.AttachEvent('OnStatusChange',FCKParagraphToLineBreak._StatusListener);

