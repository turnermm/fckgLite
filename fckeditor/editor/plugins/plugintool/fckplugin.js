/*
 * FCKeditor - The text editor for Internet - http://www.fckeditor.net
 * Copyright (C) 2003-2007 Frederico Caldeira Knabben
 *
 * == BEGIN LICENSE ==
 *
 * Licensed under the terms of any of the following licenses at your
 * choice:
 *
 *  - GNU General Public License Version 2 or later (the "GPL")
 *    http://www.gnu.org/licenses/gpl.html
 *
 *  - GNU Lesser General Public License Version 2.1 or later (the "LGPL")
 *    http://www.gnu.org/licenses/lgpl.html
 *
 *  - Mozilla Public License Version 1.1 or later (the "MPL")
 *    http://www.mozilla.org/MPL/MPL-1.1.html
 *
 * == END LICENSE ==
 *
 */

// Register the related commands.

FCKCommands.RegisterCommand( 'Plugin_Tool',
   new FCKDialogCommand( "Plugin Tool", "Plugin Tool",  
   FCKConfig.PluginsPath + 'plugintool/plugin_tool.html',  475, 400 ) ) ;


var oPluginTool		= new FCKToolbarButton( 'Plugin_Tool', 'Plugin Tool' ) ;
oPluginTool.IconPath	= FCKConfig.PluginsPath + 'plugintool/plugin.gif' ;

FCKToolbarItems.RegisterItem( 'Plugin_Tool', oPluginTool ) ;	// 'Format_Table' is the name used in the Toolbar config.

// The object used for all Abbr operations.
var FCKAbbr = new Object() ;

// Insert a new Abbr
FCKAbbr.Insert = function(val, isSafari, stet) {

    val = val.replace(/^\s+/,'');
    val = val.replace(/\s+$/,'');
   
    if(val) {
          val = '"' + val + '"';
    }

	var hrefStartHtml	= (val == '') ? '' : '<plugin title=' + val + '>';
	var hrefEndHtml		= (val == '') ? '' : '</plugin>&nbsp;';

    var reset = false;

	mySelection = ( FCKBrowserInfo.IsIE) ? FCKSelection.GetSelectedHTML(isSafari) : removeBR(FCKSelection.GetSelectedHTML(isSafari));

    mySelection = mySelection.replace(/^\s+/,"");
    mySelection = mySelection.replace(/\s+$/,"");

    if(mySelection.match(/<\/FCK:plugin>/)) {
            reset = true;
    }
    mySelection = mySelection.replace(/<\/FCK:plugin>/gi,"");
    mySelection = mySelection.replace(/<FCK:plugin.*?>/gi,"");

   if(!stet) { 
        mySelection = mySelection.replace(/<\/P>/gi," <br><br> ");
        mySelection = mySelection.replace(/^<P.*?>/gi," <br><br> ");
        mySelection = mySelection.replace(/&nbsp;/gi, "");  // for IE in <indent>

        mySelection = mySelection.replace(/<indent.*?indent>/gi, "");

        mySelection = mySelection.replace(/<P>/gi," &lt;p&gt; ");   
        mySelection = mySelection.replace(/<P.*?>/gi," ");  

        mySelection = mySelection.replace(/<br>/g," <br> ");
        mySelection = mySelection.replace(/<br\s+\/>/g," <br> ");
  }
 
    if(FCKBrowserInfo.IsIE && reset) {
        hrefHtml = mySelection;
   }
	else {  
      hrefHtml = hrefStartHtml+mySelection+hrefEndHtml;
	}



//////////////////////////////////////////////////////
// 	choose one of these two lines; in fckeditor 2.5 both lines can be skipped!!!
//	
 //	hrefHtml = FCK.ProtectTags(hrefStartHtml) ;								// needed because in fckeditor 2.4 protected tags only works with SetHTML
	hrefHtml = ProtectTags( hrefHtml ) ;									// needed because IE doesn't support <abbr> and it breaks it.
/////////////////////////////////////////////////////

	FCK.InsertHtml(hrefHtml);
}

FCKAbbr.InsertEdited = function(val) {

	//mySelection = ( FCKBrowserInfo.IsIE) ? FCKSelection.GetSelectedHTML() : removeBR(FCKSelection.GetSelectedHTML());
	              
    val = val.replace(/</g,"&lt;");
	hrefHtml = val;


	FCK.InsertHtml(hrefHtml);
}

FCKSelection.GetSelectedHTML = function(isSafari) {	

							// see http://www.quirksmode.org/js/selected.html for other browsers
	if( FCKBrowserInfo.IsIE) {												// IE
		var oRange = FCK.EditorDocument.selection.createRange() ;
		//if an object like a table is deleted, the call to GetType before getting again a range returns Control
		switch ( this.GetType() ) {
			case 'Control' :
			return oRange.item(0).outerHTML;

			case 'None' :
			return '' ;

			default :
			return oRange.htmlText ;
		}
	}
	else if ( FCKBrowserInfo.IsGecko || isSafari ) {									// Mozilla, Safari

									// Mozilla, Safari
		var oSelection = FCK.EditorWindow.getSelection();
		//Gecko doesn't provide a function to get the innerHTML of a selection,
		//so we must clone the selection to a temporary element and check that innerHTML
		var e = FCK.EditorDocument.createElement( 'DIV' );
		for ( var i = 0 ; i < oSelection.rangeCount ; i++ ) {
			e.appendChild( oSelection.getRangeAt(i).cloneContents() );
		}
		return e.innerHTML;
	}
}

function removeBR(input) {							/* Used with Gecko */
	var output = "";
	for (var i = 0; i < input.length; i++) {
		if ((input.charCodeAt(i) == 13) && (input.charCodeAt(i + 1) == 10)) {
			i++;
			output += " ";
		}
		else {
			output += input.charAt(i);
   		}
	}
	return output;
}

// put it into the contextmenu (optional)
FCK.ContextMenu.RegisterListener( {
	AddItems : function( menu, tag, tagName ) {
		// when the option is displayed, show a separator then the command
		menu.AddSeparator() ;
		// the command needs the registered command name, the title for the context menu, and the icon path
		menu.AddItem( 'Plugin_Tool', 'Plugin Tool', oPluginTool.IconPath) ;
	}
}
);

function ProtectTags ( html ) {		
									// copied from _source/internals/fck.js in fckeditor 2.4
	// IE doesn't support <abbr> and it breaks it. Let's protect it.
	if ( FCKBrowserInfo.IsIE ) {
		var sTags = 'plugin' ;

		var oRegex = new RegExp( '<(' + sTags + ')([ \>])', 'gi' ) ;
		html = html.replace( oRegex, '<FCK:$1$2' ) ;

		oRegex = new RegExp( '<\/(' + sTags + ')>', 'gi' ) ;
		html = html.replace( oRegex, '<\/FCK:$1>' ) ;

	}
	return html ;
}


