/*
 * FCKeditor - The text editor for Internet - http://www.fckeditor.net
 * Copyright (C) 2003-2009 Frederico Caldeira Knabben
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
 * Scripts related to the Link dialog window (see fck_link.html).
 */

var dialog	= window.parent ;
var oEditor = dialog.InnerDialogLoaded() ;

var FCK			= oEditor.FCK ;
var FCKLang		= oEditor.FCKLang ;
var FCKConfig	= oEditor.FCKConfig ;
var FCKRegexLib	= oEditor.FCKRegexLib ;
var FCKTools	= oEditor.FCKTools ;
var fckg_ajax; 

FCK.dwiki_browser = 'url';
var DWIKI_User = FCK.dwiki_user;
var DWIKI_Client = FCK.dwiki_client;
var Doku_Base = FCK.dwiki_doku_base;
var DWIKI_fnencode = FCK.dwiki_fnencode;
var dwiki_version =FCK.dwiki_version;
var anteater = FCK.dwiki_anteater;
var currentNameSpace = null;
FCK.islocal_dwikibrowser = false;

GetCurentNameSapce();
//#### Dialog Tabs

// Set the dialog tabs.
dialog.AddTab( 'Info', FCKLang.DlgLnkInfoTab ) ;

FCKConfig.LinkDlgHideTarget = true;
FCKConfig.LinkUpload = false;
FCKConfig.LinkDlgHideAdvanced = true;

if ( !FCKConfig.LinkDlgHideTarget )
	dialog.AddTab( 'Target', FCKLang.DlgLnkTargetTab, true ) ;

if ( FCKConfig.LinkUpload )
	dialog.AddTab( 'Upload', FCKLang.DlgLnkUpload, true ) ;

dialog.AddTab( 'Advanced', FCKLang.DlgAdvancedTag ) ;
dialog.SetTabVisibility('Advanced',false); 
 //display_obj(FCK.EditingArea.Document,'win');
// alert(FCK.EditingArea.Document.body.innerHTML);

window.onunload =  remove_hold_a;

// Function called when a dialog tag is selected.
function OnDialogTabChange( tabCode )
{
    var user;
    if(FCK.dwiki_user == 'user') {
        
         user = true;
    }
    else {
   
        user = false;
    }
	ShowE('divInfo'		, ( tabCode == 'Info' ) ) ;
//	ShowE('divTarget'	, ( tabCode == 'Target' ) ) ;
	if(user) {
    //    ShowE('divUpload'	, ( tabCode == 'Upload' ) ) ;
	}
	ShowE('divInternalExtras'	, ( tabCode == 'Advanced' ) ) ;  // internal link extras

	dialog.SetAutoSize( true ) ;
}

//#### Regular Expressions library.
var oRegex = new Object() ;

oRegex.UriProtocol = /^(((http|https|ftp|news):\/\/)|mailto:)/gi ;

oRegex.UrlOnChangeProtocol = /^(http|https|ftp|news):\/\/(?=.)/gi ;

oRegex.UrlOnChangeTestOther = /^((javascript:)|[#\/\.])/gi ;

oRegex.ReserveTarget = /^_(blank|self|top|parent)$/i ;

oRegex.PopupUri = /^javascript:void\(\s*window.open\(\s*'([^']+)'\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*\)\s*$/ ;

// Accessible popups
oRegex.OnClickPopup = /^\s*on[cC]lick="\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*"$/ ;

oRegex.PopupFeatures = /(?:^|,)([^=]+)=(\d+|yes|no)/gi ;

oRegex.doku_base = new RegExp('^' + Doku_Base.replace(/\//g,'\\/'),'g');

oRegex.media_internal = /lib\/exe\/fetch\.php\/(.*)/;

oRegex.media_rewrite_1 = /^_media\/(.*)/;

oRegex.media_rewrite_2=/exe\/fetch.php\?media=(.*)/;

oRegex.internal_link = /doku.php\?id=(.*)/;

oRegex.internal_link_rewrite_2 = /doku.php\/(.*)/;

oRegex.samba =/file:\/\/\/\/\/(.*)/;

oRegex.samba_unsaved =/^\\\\\w+(\\[\w+\.$])+/;
//#### Parser Functions

var oParser = new Object() ;

// This method simply returns the two inputs in numerical order. You can even
// provide strings, as the method would parseInt() the values.
oParser.SortNumerical = function(a, b)
{
	return parseInt( a, 10 ) - parseInt( b, 10 ) ;
}

oParser.ParseEMailParams = function(sParams)
{
	// Initialize the oEMailParams object.
	var oEMailParams = new Object() ;
	oEMailParams.Subject = '' ;
	oEMailParams.Body = '' ;

	var aMatch = sParams.match( /(^|^\?|&)subject=([^&]+)/i ) ;
	if ( aMatch ) oEMailParams.Subject = decodeURIComponent( aMatch[2] ) ;

	aMatch = sParams.match( /(^|^\?|&)body=([^&]+)/i ) ;
	if ( aMatch ) oEMailParams.Body = decodeURIComponent( aMatch[2] ) ;

	return oEMailParams ;
}

// This method returns either an object containing the email info, or FALSE
// if the parameter is not an email link.
oParser.ParseEMailUri = function( sUrl )
{
	// Initializes the EMailInfo object.
	var oEMailInfo = new Object() ;
	oEMailInfo.Address = '' ;
	oEMailInfo.Subject = '' ;
	oEMailInfo.Body = '' ;

	var aLinkInfo = sUrl.match( /^(\w+):(.*)$/ ) ;
	if ( aLinkInfo && aLinkInfo[1] == 'mailto' )
	{
		// This seems to be an unprotected email link.
		var aParts = aLinkInfo[2].match( /^([^\?]+)\??(.+)?/ ) ;
		if ( aParts )
		{
			// Set the e-mail address.
			oEMailInfo.Address = aParts[1] ;

			// Look for the optional e-mail parameters.
			if ( aParts[2] )
			{
				var oEMailParams = oParser.ParseEMailParams( aParts[2] ) ;
				oEMailInfo.Subject = oEMailParams.Subject ;
				oEMailInfo.Body = oEMailParams.Body ;
			}
		}
		return oEMailInfo ;
	}
	else if ( aLinkInfo && aLinkInfo[1] == 'javascript' )
	{
		// This may be a protected email.

		// Try to match the url against the EMailProtectionFunction.
		var func = FCKConfig.EMailProtectionFunction ;
		if ( func != null )
		{
			try
			{
				// Escape special chars.
				func = func.replace( /([\/^$*+.?()\[\]])/g, '\\$1' ) ;

				// Define the possible keys.
				var keys = new Array('NAME', 'DOMAIN', 'SUBJECT', 'BODY') ;

				// Get the order of the keys (hold them in the array <pos>) and
				// the function replaced by regular expression patterns.
				var sFunc = func ;
				var pos = new Array() ;
				for ( var i = 0 ; i < keys.length ; i ++ )
				{
					var rexp = new RegExp( keys[i] ) ;
					var p = func.search( rexp ) ;
					if ( p >= 0 )
					{
						sFunc = sFunc.replace( rexp, '\'([^\']*)\'' ) ;
						pos[pos.length] = p + ':' + keys[i] ;
					}
				}

				// Sort the available keys.
				pos.sort( oParser.SortNumerical ) ;

				// Replace the excaped single quotes in the url, such they do
				// not affect the regexp afterwards.
				aLinkInfo[2] = aLinkInfo[2].replace( /\\'/g, '###SINGLE_QUOTE###' ) ;

				// Create the regexp and execute it.
				var rFunc = new RegExp( '^' + sFunc + '$' ) ;
				var aMatch = rFunc.exec( aLinkInfo[2] ) ;
				if ( aMatch )
				{
					var aInfo = new Array();
					for ( var i = 1 ; i < aMatch.length ; i ++ )
					{
						var k = pos[i-1].match(/^\d+:(.+)$/) ;
						aInfo[k[1]] = aMatch[i].replace(/###SINGLE_QUOTE###/g, '\'') ;
					}

					// Fill the EMailInfo object that will be returned
					oEMailInfo.Address = aInfo['NAME'] + '@' + aInfo['DOMAIN'] ;
					oEMailInfo.Subject = decodeURIComponent( aInfo['SUBJECT'] ) ;
					oEMailInfo.Body = decodeURIComponent( aInfo['BODY'] ) ;

					return oEMailInfo ;
				}
			}
			catch (e)
			{
			}
		}

		// Try to match the email against the encode protection.
		var aMatch = aLinkInfo[2].match( /^(?:void\()?location\.href='mailto:'\+(String\.fromCharCode\([\d,]+\))\+'(.*)'\)?$/ ) ;
		if ( aMatch )
		{
			// The link is encoded
			oEMailInfo.Address = eval( aMatch[1] ) ;
			if ( aMatch[2] )
			{
				var oEMailParams = oParser.ParseEMailParams( aMatch[2] ) ;
				oEMailInfo.Subject = oEMailParams.Subject ;
				oEMailInfo.Body = oEMailParams.Body ;
			}
			return oEMailInfo ;
		}
	}
	return false;
}

oParser.CreateEMailUri = function( address, subject, body )
{
	// Switch for the EMailProtection setting.
	switch ( FCKConfig.EMailProtection )
	{
		case 'function' :
			var func = FCKConfig.EMailProtectionFunction ;
			if ( func == null )
			{
				if ( FCKConfig.Debug )
				{
					alert('EMailProtection alert!\nNo function defined. Please set "FCKConfig.EMailProtectionFunction"') ;
				}
				return '';
			}

			// Split the email address into name and domain parts.
			var aAddressParts = address.split( '@', 2 ) ;
			if ( aAddressParts[1] == undefined )
			{
				aAddressParts[1] = '' ;
			}

			// Replace the keys by their values (embedded in single quotes).
			func = func.replace(/NAME/g, "'" + aAddressParts[0].replace(/'/g, '\\\'') + "'") ;
			func = func.replace(/DOMAIN/g, "'" + aAddressParts[1].replace(/'/g, '\\\'') + "'") ;
			func = func.replace(/SUBJECT/g, "'" + encodeURIComponent( subject ).replace(/'/g, '\\\'') + "'") ;
			func = func.replace(/BODY/g, "'" + encodeURIComponent( body ).replace(/'/g, '\\\'') + "'") ;

			return 'javascript:' + func ;

		case 'encode' :
			var aParams = [] ;
			var aAddressCode = [] ;

			if ( subject.length > 0 )
				aParams.push( 'subject='+ encodeURIComponent( subject ) ) ;
			if ( body.length > 0 )
				aParams.push( 'body=' + encodeURIComponent( body ) ) ;
			for ( var i = 0 ; i < address.length ; i++ )
				aAddressCode.push( address.charCodeAt( i ) ) ;

			return 'javascript:void(location.href=\'mailto:\'+String.fromCharCode(' + aAddressCode.join( ',' ) + ')+\'?' + aParams.join( '&' ) + '\')' ;
	}

	// EMailProtection 'none'

	var sBaseUri = 'mailto:' + address ;

	var sParams = '' ;

	if ( subject.length > 0 )
		sParams = '?subject=' + encodeURIComponent( subject ) ;

	if ( body.length > 0 )
	{
		sParams += ( sParams.length == 0 ? '?' : '&' ) ;
		sParams += 'body=' + encodeURIComponent( body ) ;
	}

	return sBaseUri + sParams ;
}

//#### Initialization Code

// oLink: The actual selected link in the editor.
var oLink = dialog.Selection.GetSelection().MoveToAncestorNode( 'A' ) ;
if ( oLink )
	FCK.Selection.SelectNode( oLink ) ;
else {
}

window.onload = function()
{
	// Translate the dialog box texts.
	oEditor.FCKLanguageManager.TranslatePage(document) ;

	// Fill the Anchor Names and Ids combos.
	LoadAnchorNamesAndIds() ;

	// Load the selected link information (if any).
	LoadSelection() ;
   
	// Update the dialog box.
	SetLinkType( GetE('cmbLinkType').value ) ;

	// Show/Hide the "Browse Server" button.
	GetE('divBrowseServer').style.display = FCKConfig.LinkBrowser ? '' : 'none' ;

	// Show the initial dialog content.
	GetE('divInfo').style.display = '' ;

	// Set the actual uploader URL.
	if ( FCKConfig.LinkUpload )
		GetE('frmUpload').action = FCKConfig.LinkUploadURL ;

	// Set the default target (from configuration).
	SetDefaultTarget() ;

	// Activate the "OK" button.
	dialog.SetOkButton( true ) ;

	// Select the first field.
	switch( GetE('cmbLinkType').value )
	{
		case 'url' :
			SelectField( 'txtUrl' ) ;
			break ;
		case 'email' :
			SelectField( 'txtEMailAddress' ) ;
			break ;
		case 'anchor' :
			if ( GetE('divSelAnchor').style.display != 'none' )
				SelectField( 'cmbAnchorName' ) ;
			else
				SelectField( 'cmbLinkType' ) ;
	}

   // disable query string for internal links if this Dokuwiki version is earlier than anteater
   if(dwiki_version <  anteater ) {
       GetE('txtDokuWikiQS').disabled=true;
   }
  
}

var bHasAnchors ;

function LoadAnchorNamesAndIds()
{
	// Since version 2.0, the anchors are replaced in the DOM by IMGs so the user see the icon
	// to edit them. So, we must look for that images now.
	var aAnchors = new Array() ;
	var i ;
	var oImages = oEditor.FCK.EditorDocument.getElementsByTagName( 'IMG' ) ;
	for( i = 0 ; i < oImages.length ; i++ )
	{
		if ( oImages[i].getAttribute('_fckanchor') )
			aAnchors[ aAnchors.length ] = oEditor.FCK.GetRealElement( oImages[i] ) ;
	}

	// Add also real anchors
	var oLinks = oEditor.FCK.EditorDocument.getElementsByTagName( 'A' ) ;
	for( i = 0 ; i < oLinks.length ; i++ )
	{
		if ( oLinks[i].name && ( oLinks[i].name.length > 0 ) )
			aAnchors[ aAnchors.length ] = oLinks[i] ;
	}

	var aIds = FCKTools.GetAllChildrenIds( oEditor.FCK.EditorDocument.body ) ;

	bHasAnchors = ( aAnchors.length > 0 || aIds.length > 0 ) ;

	for ( i = 0 ; i < aAnchors.length ; i++ )
	{
		var sName = aAnchors[i].name ;
		if ( sName && sName.length > 0 )
			FCKTools.AddSelectOption( GetE('cmbAnchorName'), sName, sName ) ;
	}

	for ( i = 0 ; i < aIds.length ; i++ )
	{
		FCKTools.AddSelectOption( GetE('cmbAnchorId'), aIds[i], aIds[i] ) ;
	}

	ShowE( 'divSelAnchor'	, bHasAnchors ) ;
	ShowE( 'divNoAnchor'	, !bHasAnchors ) ;
}


function checkDokuQS(qs) {
   
    qs = qs.replace(/^\s*[\?\&]/,"");
    qs = qs.replace(/[\?\&]\s*$/,"");
    if(!qs) return "";
    qs = qs.replace(/\"/g,"\'");  // double quoted data gets lost because fcked uses double for href url
    
    var test = qs.replace(/[\']([^&])&([^&])[\']/g, "$1_AND_$2");

    var matches = test.split(/\&/);
    var err_str = "";

    for(var i=0; i<matches.length; i++) {
      if(!matches[i].match(/(.*?)=(.*)/)){        
            err_str  += "\n\t" + matches[i].replace(/_AND_/g,"&");
      }
    }

    if(err_str) {
      if(!confirm((FCKLang.DlgnLnkMsgQSErr + err_str))) return false;
    }
    return qs
}

function setDokuNamespace(url) {

     url = url.replace(/\//g,":");
     if(!url.match(/^:/)) url = ":" + url;
     return url;
}

function checkForQueryString(ns) {
    var elems = ns.split(/#/);
    if(elems.length > 1) {
         ns = elems[0];        
         anchorOption.selection = elems[1];          
    }
    if((matches=ns.match(/(.*?)\?(.*)$/))) {   
          GetE('txtDokuWikiQS').value = matches[2];           
          return (matches[1]);
    }
    else {
       var parts = ns.split(/&/);
        
       if(parts) {
          ns = parts[0];
          parts.shift();
          if(parts.length) {
           GetE('txtDokuWikiQS').value = parts.join('&');  
              
          }
       }
    }

    return ns;
}

function _getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function LoadSelection()
{
    remove_hold_a();
    if ( !oLink ) {     
        if(window.document.documentMode && window.document.documentMode == 9) {
            FCK.InsertHtml('&nbsp;<span id="hold_a" style="font-weight:bold">&nbsp;&nbsp;broken link insertion&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;'); 
            var dom = oEditor.FCK.EditorDocument.getElementById("hold_a");      
            var offset = _getOffset(dom);
            if(offset.top < 1) {
                remove_hold_a();
            }
     
            if(FCK.screen_x && FCK.screen_y) {
                oEditor.FCK.EditorDocument.parentWindow.scrollTo(FCK.screen_x,FCK.screen_y);
            }
       }
       
        return ;
    }

	var sType = 'url' ;
    

	// Get the actual Link href.
	var sHRef = oLink.getAttribute( '_fcksavedurl' ) ;  
	if ( sHRef == null ) {
		sHRef = oLink.getAttribute( 'href' , 2 ) || '' ;
	}
    

	// Look for a popup javascript link.
	var oPopupMatch = oRegex.PopupUri.exec( sHRef ) ;
	if( oPopupMatch )
	{
		GetE('cmbTarget').value = 'popup' ;
		sHRef = oPopupMatch[1] ;
		FillPopupFields( oPopupMatch[2], oPopupMatch[3] ) ;
		SetTarget( 'popup' ) ;
	}

	// Accessible popups, the popup data is in the onclick attribute
	if ( !oPopupMatch )
	{
		var onclick = oLink.getAttribute( 'onclick_fckprotectedatt' ) ;
		if ( onclick )
		{
			// Decode the protected string
			onclick = decodeURIComponent( onclick ) ;

			oPopupMatch = oRegex.OnClickPopup.exec( onclick ) ;
			if( oPopupMatch )
			{
				GetE( 'cmbTarget' ).value = 'popup' ;
				FillPopupFields( oPopupMatch[1], oPopupMatch[2] ) ;
				SetTarget( 'popup' ) ;
			}
		}
	}

	// Search for the protocol.
	var sProtocol = oRegex.UriProtocol.exec( sHRef ) ;
	var sClass ;
	if ( oEditor.FCKBrowserInfo.IsIE )
	{
		sClass	= oLink.getAttribute('className',2) || '' ;
		// Clean up temporary classes for internal use:
		sClass = sClass.replace( FCKRegexLib.FCK_Class, '' ) ;

		GetE('txtAttStyle').value	= oLink.style.cssText ;
	}
	else
	{
		sClass	= oLink.getAttribute('class',2) || '' ;
		GetE('txtAttStyle').value	= oLink.getAttribute('style',2) || '' ;
	}

	GetE('txtAttClasses').value	= sClass ;

	// Search for a protected email link.
	var oEMailInfo = oParser.ParseEMailUri( sHRef );

	if ( oEMailInfo )
	{
		sType = 'email' ;

		GetE('txtEMailAddress').value = oEMailInfo.Address ;
		GetE('txtEMailSubject').value = oEMailInfo.Subject ;
		GetE('txtEMailBody').value    = oEMailInfo.Body ;
	}
	else if ( sProtocol )
	{
		sProtocol = sProtocol[0].toLowerCase() ;
		GetE('cmbLinkProtocol').value = sProtocol ;

		// Remove the protocol and get the remaining URL.
		var sUrl = sHRef.replace( oRegex.UriProtocol, '' ) ;
		sType = 'url' ;
		GetE('txtUrl').value = sUrl ;
	}
	else if ( sHRef.substr(0,1) == '#' && sHRef.length > 1 )	// It is an anchor link.
	{
		sType = 'anchor' ;
		GetE('cmbAnchorName').value = GetE('cmbAnchorId').value = sHRef.substr(1) ;
	}
	else					// It is another type of link.
	{
		sType = 'url' ;
                
        var m;

        if(m = sHRef.match(oRegex.doku_base)) {
          sHRef = sHRef.replace(oRegex.doku_base,"");        
          sHRef = decodeURI(sHRef) ;      
      
          if( (m = sHRef.match(oRegex.media_internal))  || 
              (m = sHRef.match(oRegex.media_rewrite_1)) || 
              (m = sHRef.match(oRegex.media_rewrite_2)) 
            ){
              sType = 'other_mime';
              var ns = setDokuNamespace(m[1]);
       	      GetE("txtExternalMime").value =  ns; 
          }
          else {
                sType = 'internal';

                if(!(m = sHRef.match(oRegex.internal_link))) {
                  m =  sHRef.match(oRegex.internal_link_rewrite_2);
                }
                if(m) {
                  var ns = setDokuNamespace(m[1]);
                  if(ns.match(/\.\w+$/) && !sClass.match(/wikilink/)) { 
                      // before save internal media look like internal link but have an extension
                      GetE("txtExternalMime").value =  ns;   
                      sType = 'other_mime';  
                  }
              	  else {
                    GetE("txtDokuWikiId").value = checkForQueryString(ns);  
              	  }
                }
                else {
                   GetE("txtDokuWikiId").value = checkForQueryString(setDokuNamespace(sHRef));  
                }
          }                
        }
      else if(m=sHRef.match(oRegex.samba)) {
         var share = m[1].replace(/\//g,'\\');
         share = '\\\\' + share;
         GetE('txtSMBShareId').value = share;
         sType = 'samba';
      }
     else if(m=sHRef.match(oRegex.samba_unsaved)) {         
          sType = 'samba';
          GetE('txtSMBShareId').value = sHRef;
      }

	 GetE('cmbLinkProtocol').value = '' ;
	 GetE('txtUrl').value = sHRef ;
	}

	if ( !oPopupMatch )
	{
		// Get the target.
		var sTarget = oLink.target ;

		if ( sTarget && sTarget.length > 0 )
		{
			if ( oRegex.ReserveTarget.test( sTarget ) )
			{
				sTarget = sTarget.toLowerCase() ;
				GetE('cmbTarget').value = sTarget ;
			}
			else
				GetE('cmbTarget').value = 'frame' ;
			GetE('txtTargetFrame').value = sTarget ;
		}
	}

	// Get Advances Attributes
	GetE('txtAttId').value			= oLink.id ;
	GetE('txtAttName').value		= oLink.name ;
	GetE('cmbAttLangDir').value		= oLink.dir ;
	GetE('txtAttLangCode').value	= oLink.lang ;
	GetE('txtAttAccessKey').value	= oLink.accessKey ;
	GetE('txtAttTabIndex').value	= oLink.tabIndex <= 0 ? '' : oLink.tabIndex ;
	GetE('txtAttTitle').value		= oLink.title ;
	GetE('txtAttContentType').value	= oLink.type ;
	GetE('txtAttCharSet').value		= oLink.charset ;

	// Update the Link type combo.
	GetE('cmbLinkType').value = sType ;
}

var HTMLParserVar_linktype ='url';
//#### Link type selection.
function SetLinkType( linkType )
{

	ShowE('divLinkTypeUrl'		, (linkType == 'url') ) ;
	ShowE('divLinkTypeAnchor'	, (linkType == 'anchor') ) ;
	ShowE('divLinkTypeEMail'	, (linkType == 'email') ) ;
	ShowE('divLinkTypeInternal'	, (linkType == 'internal') ) ;
	ShowE('divLinkTypeOtherMime', (linkType == 'other_mime') ) ;

	ShowE('divLinkTypeSMB'	, (linkType == 'samba') );
	if ( !FCKConfig.LinkDlgHideTarget )
		dialog.SetTabVisibility( 'Target'	, (linkType == 'url') ) ;

	if ( FCKConfig.LinkUpload )
		dialog.SetTabVisibility( 'Upload'	, (linkType == 'url') ) ;

	if ( !FCKConfig.LinkDlgHideAdvanced )
		dialog.SetTabVisibility( 'Advanced'	, (linkType != 'anchor' || bHasAnchors) ) ;

	if ( linkType == 'email' )
		dialog.SetAutoSize( true ) ;

   HTMLParserVar_linktype = linkType;  
   if(linkType == 'internal') { 
      dialog.SetTabVisibility('Advanced',true); 
      FCK.dwiki_browser = 'local';
      FCK.islocal_dwikibrowser = true;  
      if(anchorOption.selection) {
           anchorOption.ini('Headings Menu')
           anchorOption.push('Cancel Selection',""); 
           anchorOption.push(anchorOption.selection,anchorOption.selection); 
      }
      else anchorOption.ini('Headings Menu');
   }
   else { 
     dialog.SetTabVisibility('Advanced',false); 
     FCK.dwiki_browser = 'url';
     FCK.islocal_dwikibrowser = false;
   }

   
}

//#### Target type selection.
function SetTarget( targetType )
{
	GetE('tdTargetFrame').style.display	= ( targetType == 'popup' ? 'none' : '' ) ;
	GetE('tdPopupName').style.display	=
	GetE('tablePopupFeatures').style.display = ( targetType == 'popup' ? '' : 'none' ) ;

	switch ( targetType )
	{
		case "_blank" :
		case "_self" :
		case "_parent" :
		case "_top" :
			GetE('txtTargetFrame').value = targetType ;
			break ;
		case "" :
			GetE('txtTargetFrame').value = '' ;
			break ;
	}

	if ( targetType == 'popup' )
		dialog.SetAutoSize( true ) ;
}

//#### Called while the user types the URL.
function OnUrlChange()
{
	var sUrl = GetE('txtUrl').value ;

	var sProtocol = oRegex.UrlOnChangeProtocol.exec( sUrl ) ;

	if ( sProtocol )
	{
		sUrl = sUrl.substr( sProtocol[0].length ) ;
		GetE('txtUrl').value = sUrl ;
		GetE('cmbLinkProtocol').value = sProtocol[0].toLowerCase() ;
	}
	else if ( oRegex.UrlOnChangeTestOther.test( sUrl ) )
	{
		GetE('cmbLinkProtocol').value = '' ;
	}
}

//#### Called while the user types the target name.
function OnTargetNameChange()
{
	var sFrame = GetE('txtTargetFrame').value ;

	if ( sFrame.length == 0 )
		GetE('cmbTarget').value = '' ;
	else if ( oRegex.ReserveTarget.test( sFrame ) )
		GetE('cmbTarget').value = sFrame.toLowerCase() ;
	else
		GetE('cmbTarget').value = 'frame' ;
}

// Accessible popups
function BuildOnClickPopup()
{
	var sWindowName = "'" + GetE('txtPopupName').value.replace(/\W/gi, "") + "'" ;

	var sFeatures = '' ;
	var aChkFeatures = document.getElementsByName( 'chkFeature' ) ;
	for ( var i = 0 ; i < aChkFeatures.length ; i++ )
	{
		if ( i > 0 ) sFeatures += ',' ;
		sFeatures += aChkFeatures[i].value + '=' + ( aChkFeatures[i].checked ? 'yes' : 'no' ) ;
	}

	if ( GetE('txtPopupWidth').value.length > 0 )	sFeatures += ',width=' + GetE('txtPopupWidth').value ;
	if ( GetE('txtPopupHeight').value.length > 0 )	sFeatures += ',height=' + GetE('txtPopupHeight').value ;
	if ( GetE('txtPopupLeft').value.length > 0 )	sFeatures += ',left=' + GetE('txtPopupLeft').value ;
	if ( GetE('txtPopupTop').value.length > 0 )		sFeatures += ',top=' + GetE('txtPopupTop').value ;

	if ( sFeatures != '' )
		sFeatures = sFeatures + ",status" ;

	return ( "window.open(this.href," + sWindowName + ",'" + sFeatures + "'); return false" ) ;
}

//#### Fills all Popup related fields.
function FillPopupFields( windowName, features )
{
	if ( windowName )
		GetE('txtPopupName').value = windowName ;

	var oFeatures = new Object() ;
	var oFeaturesMatch ;
	while( ( oFeaturesMatch = oRegex.PopupFeatures.exec( features ) ) != null )
	{
		var sValue = oFeaturesMatch[2] ;
		if ( sValue == ( 'yes' || '1' ) )
			oFeatures[ oFeaturesMatch[1] ] = true ;
		else if ( ! isNaN( sValue ) && sValue != 0 )
			oFeatures[ oFeaturesMatch[1] ] = sValue ;
	}

	// Update all features check boxes.
	var aChkFeatures = document.getElementsByName('chkFeature') ;
	for ( var i = 0 ; i < aChkFeatures.length ; i++ )
	{
		if ( oFeatures[ aChkFeatures[i].value ] )
			aChkFeatures[i].checked = true ;
	}

	// Update position and size text boxes.
	if ( oFeatures['width'] )	GetE('txtPopupWidth').value		= oFeatures['width'] ;
	if ( oFeatures['height'] )	GetE('txtPopupHeight').value	= oFeatures['height'] ;
	if ( oFeatures['left'] )	GetE('txtPopupLeft').value		= oFeatures['left'] ;
	if ( oFeatures['top'] )		GetE('txtPopupTop').value		= oFeatures['top'] ;
}

//#### The OK button was hit.
function Ok()
{
	var sUri, sInnerHtml, internalInnerHTML ;  // internalInnerHTML is for urls that are in fact internal media
    var wikiQS;  // internal link query string (DW Anteater or later)
    var current_ns = false;  // if internal link has no leading colon current_ns = true
    
	oEditor.FCKUndo.SaveUndoStep() ;

	switch ( GetE('cmbLinkType').value )
	{
		case 'url' :

			sUri = encodeURI(GetE('txtUrl').value) ;
            sUri = encodeURI(sUri) ;
			if ( sUri.length == 0 )
			{
				alert( FCKLang.DlnLnkMsgNoUrl ) ;
                remove_hold_a();
				return false ;
			}

			sUri = GetE('cmbLinkProtocol').value + sUri ;

			break ;

		case 'email' :
			sUri = GetE('txtEMailAddress').value ;

			if ( sUri.length == 0 )
			{
				alert( FCKLang.DlnLnkMsgNoEMail ) ;
                remove_hold_a();
				return false ;
			}

			sUri = oParser.CreateEMailUri(
				sUri,
				GetE('txtEMailSubject').value,
				GetE('txtEMailBody').value ) ;
			break ;

		case 'anchor' :
			var sAnchor = GetE('cmbAnchorName').value ;
			if ( sAnchor.length == 0 ) sAnchor = GetE('cmbAnchorId').value ;

			if ( sAnchor.length == 0 )
			{
				alert( FCKLang.DlnLnkMsgNoAnchor ) ;
                remove_hold_a();                
				return false ;
			}

			sUri = '#' + sAnchor ;
			break ;

	case 'internal' :
            var wiki_id  = GetE('txtDokuWikiId').value ;
			if ( wiki_id.length == 0 )
			{
				alert( FCKLang.DlgLnkIntText ) ;
                remove_hold_a();                
				return false ;
			}

            wikiQS = GetE('txtDokuWikiQS').value;          
            if((wikiQS=checkDokuQS(wikiQS)) === false) { 
                remove_hold_a();
                return;
            }

            var dwiki_dir = window.location.pathname;
      
            dwiki_dir = dwiki_dir.replace(/lib\/plugins.*$/, "");


        if(wiki_id.match(/^[^:]/)  && currentNameSpace)  {
             wiki_id = ':' + currentNameSpace + ':' + wiki_id; 
        }

            if(!wiki_id.match(/^:/)) {
			    wiki_id = ':' + wiki_id;  
			}
		
          sUri = dwiki_dir + 'doku.php?id=' + wiki_id;   
         
			break ;

	case 'other_mime' :
          //  var wiki_id = "wiki:syntax"; 
            var wiki_id  = GetE('txtExternalMime').value ;
            if(!wiki_id.match(/^:/)) wiki_id = ':' + wiki_id;  
			if ( wiki_id.length == 0 )
			{
				alert( FCKLang.DlgLnkMimeText ) ;
                remove_hold_a();                
				return false ;
			}

            var dwiki_dir = window.location.pathname;
      
            dwiki_dir = dwiki_dir.replace(/lib\/plugins.*$/, "");

            sUri = dwiki_dir + 'doku.php?id=' + wiki_id;  

			break ;

	case 'samba' :
            var share  = GetE('txtSMBShareId').value ;

			if ( share.length == 0 )
			{
				alert( FCKLang.DlgLnkSambaText ) ;
                remove_hold_a();                
				return false ;
			}          

            sUri =   share;       
			break ;


	}

	// If no link is selected, create a new one (it may result in more than one link creation - #220).
    var document_body = null;
	var aLinks = oLink ? [ oLink ] : oEditor.FCK.CreateLink( sUri, true ) ;

	// If no selection, no links are created, so use the uri as the link text (by dom, 2006-05-26)
	var aHasSelection = ( aLinks.length > 0 ) ;
     
	if ( !aHasSelection )
	{
    
     if(window.document.documentMode && window.document.documentMode == 9) {
        document_body = FCK.EditingArea.Document.body
      }
	  
       if(sUri.match(/%[a-fA-F0-9]{2}/)  && (matches = sUri.match(/userfiles\/file\/(.*)/))) {
          matches[1] = matches[1].replace(/\//g,':');
          if(!matches[1].match(/^:/)) {      
             matches[1] = ':' + matches[1];
          }
          internalInnerHTML = decodeURIComponent ? decodeURIComponent(matches[1]) : unescape(matches[1]);                               
          internalInnerHTML = decodeURIComponent ? decodeURIComponent(internalInnerHTML) : unescape(internalInnerHTML); 
      
      }
 	  else	sInnerHtml = sUri;

		// Built a better text for empty links.
		switch ( GetE('cmbLinkType').value )
		{
			// anchor: use old behavior --> return true
			case 'anchor':
				sInnerHtml = sInnerHtml.replace( /^#/, '' ) ;
				break ;

			// url: try to get path
			case 'url':
				var oLinkPathRegEx = new RegExp("//?([^?\"']+)([?].*)?$") ;
				var asLinkPath = oLinkPathRegEx.exec( sUri ) ;
				if (asLinkPath != null)
					sInnerHtml = asLinkPath[1];  // use matched path
				break ;

			// mailto: try to get email address
			case 'email':
				sInnerHtml = GetE('txtEMailAddress').value ;
				break ;
  
             // create link text for internal links and other mime types
            case 'internal':
            case 'other_mime': 
               var matches = sInnerHtml.match(/id=(.*)/);
               if(matches[1].match(/^:/)) {
                  sInnerHtml = matches[1];
               }
               
               break;
		}

		// Create a new (empty) anchor.
		aLinks = [ oEditor.FCK.InsertElement( 'a' ) ] ;
	}
  
    if(wikiQS) {
        wikiQS = wikiQS.replace(/^[\?\s]+/, "");         
        sUri +='?' + wikiQS;          
    }
    if(anchorOption.selection) {     
       sUri += '#' + anchorOption.selection;       
    }
	for ( var i = 0 ; i < aLinks.length ; i++ )
	{
		oLink = aLinks[i] ;

		if ( aHasSelection )
			sInnerHtml = oLink.innerHTML ;		// Save the innerHTML (IE changes it if it is like an URL).

		oLink.href =  sUri;
        if(internalInnerHTML) {
           sInnerHtml = internalInnerHTML;
        }

		SetAttribute( oLink, '_fcksavedurl', sUri ) ;

		var onclick;
		// Accessible popups
		if( GetE('cmbTarget').value == 'popup' )
		{
			onclick = BuildOnClickPopup() ;
			// Encode the attribute
			onclick = encodeURIComponent( " onclick=\"" + onclick + "\"" )  ;
			SetAttribute( oLink, 'onclick_fckprotectedatt', onclick ) ;
		}
		else
		{
			// Check if the previous onclick was for a popup:
			// In that case remove the onclick handler.
			onclick = oLink.getAttribute( 'onclick_fckprotectedatt' ) ;
			if ( onclick )
			{

				// Decode the protected string
				onclick = decodeURIComponent( onclick ) ;

				if( oRegex.OnClickPopup.test( onclick ) )
					SetAttribute( oLink, 'onclick_fckprotectedatt', '' ) ;
			}
		}

		oLink.innerHTML = sInnerHtml ;		// Set (or restore) the innerHTML

		// Target
		if( GetE('cmbTarget').value != 'popup' )
			SetAttribute( oLink, 'target', GetE('txtTargetFrame').value ) ;
		else
			SetAttribute( oLink, 'target', null ) ;

		// Let's set the "id" only for the first link to avoid duplication.
		if ( i == 0 )
			SetAttribute( oLink, 'id', GetE('txtAttId').value ) ;

		// Advances Attributes
		SetAttribute( oLink, 'name'		, GetE('txtAttName').value ) ;
		SetAttribute( oLink, 'dir'		, GetE('cmbAttLangDir').value ) ;
		SetAttribute( oLink, 'lang'		, GetE('txtAttLangCode').value ) ;
		SetAttribute( oLink, 'accesskey', GetE('txtAttAccessKey').value ) ;
		SetAttribute( oLink, 'tabindex'	, ( GetE('txtAttTabIndex').value > 0 ? GetE('txtAttTabIndex').value : null ) ) ;
		SetAttribute( oLink, 'title'	, GetE('txtAttTitle').value ) ;
		SetAttribute( oLink, 'type'		, GetE('txtAttContentType').value ) ;
		SetAttribute( oLink, 'charset'	, GetE('txtAttCharSet').value ) ;

        var sLinkType = GetE('cmbLinkType').value;
         var classes = GetE('txtAttClasses').value;
        if(sLinkType == 'other_mime') {
              SetAttribute( oLink, 'type', 'other_mime');                
              if(!classes.match(/mediafile/)) {
                 var matches = sUri.match(/\.(\w+)$/);
                 if(matches && matches[1]) {
                   GetE('txtAttClasses').value += ' mediafile mf_'+ matches[1] + ' ';   
                 }
                 else GetE('txtAttClasses').value += ' mediafile ';
             }
             if(matches[1].match(/(gif|jpg|png|jpeg)/)) {               
                    GetE('txtAttClasses').value = ' media ' + GetE('txtAttClasses').value;
                    SetAttribute( oLink, 'type', 'linkonly');                
           }
        }
        else if(sLinkType == 'internal') {
             if(!classes.match(/wikilink/)) {
                 GetE('txtAttClasses').value += ' wikilink1 ';
             }
             SetAttribute( oLink, 'type', 'internal');
             SetAttribute( oLink, 'title', GetE('txtDokuWikiId').value);
        }

        else if(sLinkType == 'url'){
            GetE('txtAttClasses').value = GetE('txtAttClasses').value.replace(/wikilink\d\s*/,"");
            GetE('txtAttClasses').value += ' urlextern ';
        }
        else if(sLinkType == 'samba'){
            GetE('txtAttClasses').value += ' windows ';
        }
        else if(sLinkType == 'email'){
            GetE('txtAttClasses').value += ' mail ';
        }


		if ( oEditor.FCKBrowserInfo.IsIE )
		{
			var sClass = GetE('txtAttClasses').value ;
			// If it's also an anchor add an internal class
			if ( GetE('txtAttName').value.length != 0 )
				sClass += ' FCK__AnchorC' ;
			SetAttribute( oLink, 'className', sClass ) ;

			oLink.style.cssText = GetE('txtAttStyle').value ;
		}
		else
		{
			SetAttribute( oLink, 'class', GetE('txtAttClasses').value ) ;
			SetAttribute( oLink, 'style', GetE('txtAttStyle').value ) ;
		}
	}


    if(document_body) {  
       var hold = FCK.EditingArea.Document.getElementById("hold_a");                  
       if(hold) {
          var hold_aParent = hold.parentNode;      
          hold_aParent.replaceChild(aLinks[0],hold);           
       }
       else {
            FCK.target.appendChild(aLinks[0]);
       }

       if(FCK.screen_x && FCK.screen_y) {
           oEditor.FCK.EditorDocument.parentWindow.scrollTo(FCK.screen_x,FCK.screen_y);
           FCK.screen_x=null; FCK.screen_y=null;
           FCK.mouse_x=null; FCK.mouse_y=null;
           
       }
       else {
            FCK.target.scrollIntoView();
       }    
       
       return true;
    }
   else {
       oEditor.FCKSelection.SelectNode(aLinks[0] );
       remove_hold_a();
   }     
    
	return true ;
}

function remove_hold_a() {
    var dom = oEditor.FCK.EditorDocument.getElementById("hold_a");
    
    if(dom) {     
        dom.parentNode.removeChild(dom);
    } 
}

function BrowseServer()
{
//alert(FCKConfig.LinkBrowserURL);
	OpenFileBrowser( FCKConfig.LinkBrowserURL, FCKConfig.LinkBrowserWindowWidth, FCKConfig.LinkBrowserWindowHeight ) ;
}

function SetUrl( url )
{   

   var host = window.location.hostname;  //fckg addition
   if(HTMLParserVar_linktype == 'internal' || HTMLParserVar_linktype == 'other_mime') {         
        var match = url.match(/fckeditor\/userfiles\/file\/(.*)/);
        if(!match) {
           match =  url.match(/data\/media\/(.*)/);
        }
        if(!match) {
           match =  url.match(/data\/pages\/(.*)/);
        }
        if(!match) {
           match =  url.match(/data\/media\/(.*)/);
        }

        if(match) { 
            url = ':' +  match[1].replace(/\//g,':');
        }
        if(HTMLParserVar_linktype == 'internal') {
            url = url.replace(/^:pages/,"");
            url = url.replace(/\.txt$/,"");
        	GetE("txtDokuWikiId").value =  url ;
        }
        else {
        	GetE("txtExternalMime").value =  url ;
        }
   }
   else {
  	GetE('txtUrl').value = host + url ;
   }

	OnUrlChange() ;
	dialog.SetSelectedTab( 'Info' ) ;
}

function OnUploadCompleted( errorNumber, fileUrl, fileName, customMsg )
{
	// Remove animation
	window.parent.Throbber.Hide() ;
	GetE( 'divUpload' ).style.display  = '' ;

	switch ( errorNumber )
	{
		case 0 :	// No errors
			alert( FCKLang.DlgImgAlertSucess ) ;
			break ;
		case 1 :	// Custom error
			alert( customMsg ) ;
			return ;
		case 101 :	// Custom warning
			alert( customMsg ) ;
			break ;
		case 201 :
			alert( FCKLang.DlgImgAlertName+ '"' + fileName + '"' ) ;
			break ;
		case 202 :
			alert( FCKLang.DlgImgAlertInvalid ) ;
			return ;
		case 203 :
			alert( FCKLang.DlgImgAlertSecurity ) ;
			return ;
		case 500 :
			alert( FCKLang.FileBrowserError_Connector ) ;
			break ;
		default :
			alert( FCKLang.FileBrowserError_Upload + errorNumber ) ;
			return ;
	}

	SetUrl( fileUrl ) ;
	GetE('frmUpload').reset() ;
}

var oUploadAllowedExtRegex	= new RegExp( FCKConfig.LinkUploadAllowedExtensions, 'i' ) ;
var oUploadDeniedExtRegex	= new RegExp( FCKConfig.LinkUploadDeniedExtensions, 'i' ) ;

function CheckUpload()
{
	var sFile = GetE('txtUploadFile').value ;

	if ( sFile.length == 0 )
	{
		alert( 'Please select a file to upload' ) ;
		return false ;
	}

	if ( ( FCKConfig.LinkUploadAllowedExtensions.length > 0 && !oUploadAllowedExtRegex.test( sFile ) ) ||
		( FCKConfig.LinkUploadDeniedExtensions.length > 0 && oUploadDeniedExtRegex.test( sFile ) ) )
	{
		OnUploadCompleted( 202 ) ;
        remove_hold_a();
		return false ;
	}

	// Show animation
	window.parent.Throbber.Show( 100 ) ;
	GetE( 'divUpload' ).style.display  = 'none' ;

	return true ;
}

function SetDefaultTarget()
{
	var target = FCKConfig.DefaultLinkTarget || '' ;

	if ( oLink || target.length == 0 )
		return ;

	switch ( target )
	{
		case '_blank' :
		case '_self' :
		case '_parent' :
		case '_top' :
			GetE('cmbTarget').value = target ;
			break ;
		default :
			GetE('cmbTarget').value = 'frame' ;
			break ;
	}

	GetE('txtTargetFrame').value = target ;
}



function getHeaders(){ 
    var wiki_id  = GetE('txtDokuWikiId').value ;
	if ( wiki_id.length == 0 )
		{
			alert( FCKLang.DlgLnkIntText ) ;
			return false ;
	 }
    
    fckg_ajax = new sack();
	fckg_ajax.requestFile = "get_headers.php";
	fckg_ajax.method = 'GET';
	fckg_ajax.onCompletion = whenCompleted;
    fckg_ajax.setVar('dw_id',wiki_id);
	fckg_ajax.runAJAX();
}

function whenCompleted(){
 
	if (fckg_ajax.responseStatus){
		var string = "<p>2 Status Code: " + fckg_ajax.responseStatus[0] + "</p><p>Status Message: " + fckg_ajax.responseStatus[1] + "</p><p>URLString Sent: " + fckg_ajax.URLString + "</p>";
	} else {
		var string = "<p>1 URLString Sent: " + fckg_ajax.URLString + "</p>";
	}



    if(fckg_ajax.responseStatus && fckg_ajax.responseStatus[0] == 200) {
         
         var str = decodeURIComponent(fckg_ajax.response);

         if(str.match(/^\s*__EMPTY__\s*$/)) {
                anchorOption.ini('No Headers Found');
                anchorOption.selection = "";
                return;
         }
           anchorOption.ini('Headings Menu')
           anchorOption.push('Cancel Selection',"");
             var pairs = str.split('@@');
             for (var i in pairs) {
                  var elems = pairs[i].split(/;;/);
                  anchorOption.push(elems[0],elems[1]);
             }
         
    }
   
   
}

var anchorOption = {
    push: function(title, value) { 
       this.stack[this.Index] = (new Option(title,value,false,false));
       this.Index++;
    },
    Index: 0,
    stack: undefined,
    selection: "",
    ini: function(title) {
      this.stack = document.headings.anchors.options;
      this.stack.length = 0;
      this.Index = 0;    
      this.push(title,''); 
    
    },
    selected: function(s) {
       //alert(this.stack[s.selectedIndex].value);
       if(!this.stack[s.selectedIndex].value) {
         this.selection = "";
         return;
       }
       this.selection = this.stack[s.selectedIndex].value;
      // alert(this.stack[s.selectedIndex].value);
      // alert(this.stack[s.selectedIndex].text);
    }
   
};


function GetCurentNameSapce()
{
    var ajax2 = new sack();
	ajax2.requestFile =  '../filemanager/connectors/php/connector.php';
	ajax2.method = 'GET';
	ajax2.setVar('Command','GetDwfckNs');
	ajax2.setVar('Type','File');
	ajax2.setVar('CurrentFolder','nothing');
	ajax2.onCompletion = function() {
	
	   if(ajax2.responseStatus && ajax2.responseStatus[0] == 200) {         
         var str = decodeURIComponent(ajax2.response);
		 currentNameSpace = str; 		
         //alert(currentNameSpace);
		 // gotCurrentNameSpace = true;
	    }
	
	};
    
	ajax2.runAJAX();
}

function display_obj(which, match_val) {
    alert(match_val);
       var regex = new RegExp(match_val,"i");
        for(var i in which) {
        if(match_val) {
            if(!i.match(regex)) continue;
        }
         msg = i + '=' + which[i];
         if(!confirm(msg)) break;
    }
}

	

