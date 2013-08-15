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

FCKCommands.RegisterCommand( 'keyboard',
   new FCKDialogCommand( FCKLang['KeyboardDlgTitle'], FCKLang['KeyboardDlgTitle'],  
   FCKConfig.PluginsPath + 'keyboard/keyboard.html',  450, 450 ) ) ;


var oKeyboardTool		= new FCKToolbarButton( 'keyboard',  FCKLang['KeyboardToolTip'] ) ;
oKeyboardTool.IconPath	= FCKPlugins.Items['keyboard'].Path  + 'images/keyboard.gif' ;

FCKToolbarItems.RegisterItem( 'keyboard', oKeyboardTool ) ;	

// The object used for all Keyboard operations.
var FCKKeyboard = new Object() ;

FCKKeyboard.openkb = function () {
    FCK.VKI_attach();  

}
