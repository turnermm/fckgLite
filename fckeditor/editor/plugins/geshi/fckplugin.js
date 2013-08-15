/*
 * FCKeditor - The text editor for Internet - http://www.fckeditor.net
 * Copyright (C) 2003-2007 Frederico Caldeira Knabben
 * Copyright (C) 2008-2013 Myron Turner
 * Copyright (C) 2013 Kamil Demecki [kodstark@gmail.com]
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
var gdialog_dim = FCKBrowserInfo.IsIE ? 500: 600;
FCKCommands.RegisterCommand( 'geshi',
   new FCKDialogCommand( FCKLang['GeshiDlgTitle'], FCKLang['GeshiDlgTitle'],  
   FCKConfig.PluginsPath + 'geshi/geshi.html',  gdialog_dim, gdialog_dim ) ) ;


var oGeshiTool		= new FCKToolbarButton( 'geshi',  FCKLang['GeshiToolTip'] ) ;
oGeshiTool.IconPath	= FCKPlugins.Items['geshi'].Path  + 'images/geshi.gif' ;

FCKToolbarItems.RegisterItem( 'geshi', oGeshiTool ) ;	

// The object used for all Geshi operations.
var FCKGeshi = new Object() ;
FCKGeshi.isIE = FCKBrowserInfo.IsIE;
FCKGeshi.CheckForText = function() {
     var isSafari = false;
    if(!FCKBrowserInfo.IsIE && !FCKBrowserInfo.IsGecko) isSafari = true;
    var	mySelection = ( FCKBrowserInfo.IsIE) ? FCKSelection.GetSelectedHTML(isSafari) : removeBR(FCKSelection.GetSelectedHTML(isSafari));

    return FCKGeshi.StripHtmlDom(mySelection);
}   

FCKGeshi.InsertText = function(code_type, lang, snip_fname, mySelection) {
    
  
    var pre_class = code_type + ' ' + lang;
	var hrefStartHtml	=  '<pre class="' + pre_class + '">';
	var hrefEndHtml		=  '</pre>';

    var  isSafari = false;
    if(!FCKBrowserInfo.IsIE && !FCKBrowserInfo.IsGecko) isSafari = true;
    mySelection = mySelection.replace(/^\s+/,"");
    mySelection = mySelection.replace(/\s+$/,"");
    if(!mySelection) mySelection = "<br /><br />";

    hrefHtml = hrefStartHtml+mySelection+hrefEndHtml;
    if(snip_fname) {
        hrefHtml=downloadable_snippet(hrefHtml, snip_fname) ;
    }

   

    hrefHtml += '<span class="np_break">&nbsp;</span>';
    if(isSafari) {
          hrefHtml = '<span class="np_break">&nbsp;</span>' + hrefHtml;
    }
	FCK.InsertHtml(hrefHtml);
}

FCKGeshi.Insert = function(code_type, lang, snip_fname) {
    
  
    var pre_class = code_type + ' ' + lang;
	var hrefStartHtml	=  '<pre class="' + pre_class + '">';
	var hrefEndHtml		=  '</pre>';
    var isSafari = false;
    var reset = false;
    if(!FCKBrowserInfo.IsIE && !FCKBrowserInfo.IsGecko) isSafari = true;
	mySelection = ( FCKBrowserInfo.IsIE) ? FCKSelection.GetSelectedHTML(isSafari) : removeBR(FCKSelection.GetSelectedHTML(isSafari));

    mySelection = mySelection.replace(/^\s+/,"");
    mySelection = mySelection.replace(/\s+$/,"");
    if(!mySelection) mySelection = "<br /><br />";

    hrefHtml = hrefStartHtml+mySelection+hrefEndHtml;
    if(snip_fname) {
        hrefHtml=downloadable_snippet(hrefHtml, snip_fname) ;
    }

   

    hrefHtml += '<span class="np_break">&nbsp;</span>';
    if(isSafari) {
          hrefHtml = '<span class="np_break">&nbsp;</span>' + hrefHtml;
    }
	FCK.InsertHtml(hrefHtml);
}

FCKGeshi.InsertEdited = function(val) {

//	mySelection = ( FCKBrowserInfo.IsIE) ? FCKSelection.GetSelectedHTML() : removeBR(FCKSelection.GetSelectedHTML());

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

function downloadable_snippet(mySelection, fname) {


matches = fname.match(/\.(\w+)$/);
var ext = matches ? matches[1] : 'php';

var media_file = 'mediafile mf_' + ext;

var selection = '<dl class="file">' +
    '<dt><a href="doku.php?do=export_code&id=start&codeblock=0"' 
          + 'title="Download Snippet" class="' + media_file + '">' + fname +'</a></dt>'
    + '<dd>'
    + mySelection
   + ' </dd> </dl>';

 return selection;
}

// originally from Club AJAX General Purpose Code 
// author of original: Mike Wilcox http://clubajax.org
// Returns a line-break, properly spaced, normailized plain text
// representation of multiple child nodes which can't be done via
// textContent or innerText because those two methods are vastly
// different, and even innerText works differently across browsers.
FCKGeshi.StripHtmlDom = function(htmlText){
    var node = document.createElement("div");
    node.innerHTML = htmlText;

	// used for testing:
	// return node.innerText || node.textContent;

	var normalize = function(a){
		// clean up double line breaks and spaces
		if(!a) return "";
		return a.replace(/ +/g, " ")
				.replace(/[\t]+/gm, "")
				.replace(/[ ]+$/gm, "")
				.replace(/^[ ]+/gm, "")
				.replace(/\n+/g, "\n")
				.replace(/\n+$/, "")
				.replace(/^\n+/, "")
				.replace(/\nNEWLINE\n/g, "\n\n")
				.replace(/NEWLINE\n/g, "\n\n"); // IE
	}
	var removeWhiteSpace = function(node){
		// getting rid of empty text nodes
		var isWhite = function(node) {
			return !(/[^\t\n\r ]/.test(node.nodeValue));
		}
		var ws = [];
		var findWhite = function(node){
			for(var i=0; i<node.childNodes.length;i++){
				var n = node.childNodes[i];
				if (n.nodeType==3 && isWhite(n)){
					ws.push(n)
				}else if(n.hasChildNodes()){
					findWhite(n);
				}
			}
		}
		findWhite(node);
		for(var i=0;i<ws.length;i++){
			ws[i].parentNode.removeChild(ws[i])
		}

	}
	var sty = function(n, prop){
		// Get the style of the node.
		// Assumptions are made here based on tagName.
		if(n.style[prop]) return n.style[prop];
		var s = n.currentStyle || n.ownerDocument.defaultView.getComputedStyle(n, null);
		if(n.tagName == "SCRIPT") return "none";
		if(!s[prop]) return "LI,P,TR".indexOf(n.tagName) > -1 ? "block" : n.style[prop];
		if(s[prop] =="block" && n.tagName=="TD") return "feaux-inline";
		return s[prop];
	}

	var blockTypeNodes = "table-row,block,list-item";
	var isBlock = function(n){
		// diaply:block or something else
		var s = sty(n, "display") || "feaux-inline";
		if(blockTypeNodes.indexOf(s) > -1) return true;
		return false;
	}
	var recurse = function(n){
		// Loop through all the child nodes
		// and collect the text, noting whether
		// spaces or line breaks are needed.
		if(/pre/.test(sty(n, "whiteSpace"))) {
			t += n.innerHTML
				.replace(/\t/g, " ")
				.replace(/\n/g, " "); // to match IE
			return "";
		}
		var s = sty(n, "display");
		if(s == "none") return "";
		var gap = isBlock(n) ? "\n" : " ";
		t += gap;
		for(var i=0; i<n.childNodes.length;i++){
			var c = n.childNodes[i];
			if(c.nodeType == 3) t += c.nodeValue;
			if(c.childNodes.length) recurse(c);
		}
		t += gap;
		return t;
	}
	// Use a copy because stuff gets changed
	node = node.cloneNode(true);
	// Line breaks aren't picked up by textContent
	node.innerHTML = node.innerHTML.replace(/<br>/g, "\n");

	// Double line breaks after P tags are desired, but would get
	// stripped by the final RegExp. Using placeholder text.
	var paras = node.getElementsByTagName("p");
	for(var i=0; i<paras.length;i++){
		paras[i].innerHTML += "NEWLINE";
	}

	var t = "";
	removeWhiteSpace(node);
	return normalize(recurse(node));
}
