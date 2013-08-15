/*
 * File Name: fckplugin.js
 * Plugin to launch the Insert Code dialog in FCKeditor
 */

// Register the related command.
FCKCommands.RegisterCommand( 'insertHtmlCode', new FCKDialogCommand( 'InsertHtmlCode', FCKLang.DlgFootnoteTitle, FCKPlugins.Items['insertHtmlCode'].Path + 'fck_insertHtmlCode.html', 500, 450 ) ) ;

// Create the "insertHtmlCode" toolbar button.
//var oinsertHtmlCodeItem = new FCKToolbarButton( 'insertHtmlCode', FCKLang.InsertHtmlCode, FCKLang.InsertHtmlCode, null, null, false, true) ;
var oinsertHtmlCodeItem = new FCKToolbarButton( 'insertHtmlCode', 'Create/Edit Footnotes', FCKLang.InsertFootnote, null, null, false, true) ;
oinsertHtmlCodeItem.IconPath = FCKPlugins.Items['insertHtmlCode'].Path + 'insertHtmlCode.gif' ;

FCKToolbarItems.RegisterItem( 'insertHtmlCode', oinsertHtmlCodeItem ) ;

FCK.oinsertHtmlCodeObj = new Object();
FCK.oinsertHtmlCodeObj.notes = new Array();
FCK.oinsertHtmlCodeObj.count = 0;
