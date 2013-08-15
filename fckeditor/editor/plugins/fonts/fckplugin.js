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

FCKCommands.RegisterCommand( 'fonts',
   new FCKDialogCommand( FCKLang['FontsDlgTitle'], FCKLang['FontsDlgTitle'],  
   FCKConfig.PluginsPath + 'fonts/fonts.html',  550, 500 ) ) ;


var oFontsTool		= new FCKToolbarButton( 'fonts',  FCKLang['FontsToolTip'] ) ;
oFontsTool.IconPath	= FCKPlugins.Items['fonts'].Path  + 'images/fonts.png' ;

FCKToolbarItems.RegisterItem( 'fonts', oFontsTool ) ;	

// The object used for all Fonts operations.
var FCKFonts = new Object() ;

FCKFonts.Insert = function(font_weight, font_family, font_size, fg_color, bg_color) {
    
    var isSafari = false;
    var style = " font-weight: " + font_weight + "; ";
    style += " font-size: " + font_size + "; ";
    style += " color: " + fg_color + "; ";
	style += " font-family: " + font_family + "; ";
    style += " background-color: " + bg_color + "; ";    

	var hrefStartHtml	=  '<span face="'+ font_family + '" style="' + style + '">';
	var hrefEndHtml		=  '</span>';

    var reset = false;
    if(!FCKBrowserInfo.IsIE && !FCKBrowserInfo.IsGecko) isSafari = true;
	mySelection = ( FCKBrowserInfo.IsIE) ? FCKSelection.GetSelectedHTML(isSafari) : removeBR(FCKSelection.GetSelectedHTML(isSafari),false);
   
    mySelection = mySelection.replace(/<.*?>/g,"");
    mySelection = mySelection.replace(/^\s+/,"");
    mySelection = mySelection.replace(/\s+$/,"");
    if(!mySelection) return false;
    if(!mySelection) mySelection = "<br /><br />";
    hrefHtml = hrefStartHtml+mySelection+hrefEndHtml;   

	FCK.InsertHtml(hrefHtml);
    return true;
}

FCKFonts.getSelection = function(){
  var isSafari = false;
   var mySelection = removeBR(FCKSelection.GetSelectedHTML(isSafari),true);
  return mySelection;
}

FCKFonts.haveSelection = function() {
    isSafari = false;
    if(FCKBrowserInfo.IsIE) return true;
    if(!FCKBrowserInfo.IsIE && !FCKBrowserInfo.IsGecko) isSafari = true;
     
	mySelection = ( FCKBrowserInfo.IsIE) ? FCKSelection.GetSelectedHTML(isSafari) : removeBR(FCKSelection.GetSelectedHTML(isSafari),false);

    return mySelection;
}
FCKFonts.InsertEdited = function(val) {

	hrefHtml = val;

	FCK.InsertHtml(hrefHtml);
}

FCKFonts.isIE = function() {
return FCKBrowserInfo.IsIE;
}

FCKSelection.GetSelectedHTML = function(isSafari) {	

							// see http://www.quirksmode.org/js/selected.html for other browsers
	if( FCKBrowserInfo.IsIE) {	
        											// IE
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

function removeBR(input, skip_space) {							/* Used with Gecko */
	var output = "";
	for (var i = 0; i < input.length; i++) {
		if ((input.charCodeAt(i) == 13) && (input.charCodeAt(i + 1) == 10)) {
			i++;
            if(!skip_space)
			output += " ";
		}
		else {
			output += input.charAt(i);
   		}
	}
	return output;
}


