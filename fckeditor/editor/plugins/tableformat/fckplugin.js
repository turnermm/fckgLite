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
 * This is the sample plugin definition file.
 */

// Register the related commands.

FCKCommands.RegisterCommand( 'Format_Table',
   new FCKDialogCommand( "Format Table", "Format Table",  
   FCKConfig.PluginsPath + 'tableformat/table.html', 600, 600 ) ) ;

// Create the "Replace" toolbar button.
var oReplaceItem		= new FCKToolbarButton( 'Format_Table', 'Format Table' ) ;
oReplaceItem.IconPath	= FCKConfig.PluginsPath + 'tableformat/table.gif' ;

FCKToolbarItems.RegisterItem( 'Format_Table', oReplaceItem ) ;	// 'Format_Table' is the name used in the Toolbar config.
