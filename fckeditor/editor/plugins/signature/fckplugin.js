function FCKInsertSignature(p) {

}

FCKCommands.RegisterCommand( 'InsertSignature' , new FCKInsertSignature('insertDokuwikiSignature') ) ; 

// Create a toolbar button 
var oInsertSignature		= new FCKToolbarButton( 'InsertSignature', FCKLang.DokuwikiSignature) ;
oInsertSignature.IconPath	= FCKConfig.PluginsPath + 'signature/sig.png' ;
//oInsertSignature.IconPath = "";
FCKToolbarItems.RegisterItem( 'InsertSignature', oInsertSignature ) ;	

// put it into the contextmenu 
FCK.ContextMenu.RegisterListener( {
	AddItems : function( menu, tag, tagName ) {
		// when the option is displayed, show a separator then the command
		menu.AddSeparator() ;
		// the command needs the registered command name, the title for the context menu, and the icon path
		menu.AddItem( 'InsertSignature', FCKLang.DokuwikiSignature, oInsertSignature.IconPath) ;
	}
}
);

FCKInsertSignature.numbersToTwoDigits = function(n) {
    	   if(n < 10) n = '0' + n;
		   return(n);
}
FCKInsertSignature.prototype.Execute = function() {
           var d = new Date();
		  // var month = FCKInsertSignature.numbersToTwoDigits(d.getMonth() +1);
		   //if(month < 10) month = '0' + month;
		   var date_str = d.getFullYear() + '/'
     		   +  FCKInsertSignature.numbersToTwoDigits(d.getMonth() +1)  + '/'
			   +  FCKInsertSignature.numbersToTwoDigits(d.getDate())
		  	   + ' ' + FCKInsertSignature.numbersToTwoDigits(d.getHours())
			   + ':' + FCKInsertSignature.numbersToTwoDigits(d.getMinutes());
            var mail = '&mdash; <i><a href="mailto:' + FCKConfig.fckgUserMail+'">' + FCKConfig.fckgUserName +'</a> ' + date_str +' &mdash;</i>';
			FCK.InsertHtml(mail);
			FCK.EditorWindow.parent.FCKUndo.SaveUndoStep();

};

FCKInsertSignature.prototype.GetState = function()  
{  
	return FCK_TRISTATE_OFF;  
};  
 

