/*
 *File Name: fckplugin.js
 * 	Plugin to add a unordered list
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

	FCKConfig.insertHtmlunorderedList_snippet = '<ul><li>&nbsp;</li></ul>';


	// insertHtmlObject constructor
	var insertHtmlunorderedListToolbarCommand = function()
	{
		
	}

	// register the command
	FCKCommands.RegisterCommand('insertHtmlunorderedList', new insertHtmlunorderedListToolbarCommand());

	// create the toolbar  button
	var insertHtmlunorderedListButton = new FCKToolbarButton('insertHtmlunorderedList', FCKLang.NestedBulletList);
	insertHtmlunorderedListButton.IconPath = FCKPlugins.Items['insertHtmlunorderedList'].Path + 'images/ul_ins.png'; // or pick any other in folder 'images'
	FCKToolbarItems.RegisterItem('insertHtmlunorderedList', insertHtmlunorderedListButton);

	// manage the plugins' button behavior
	insertHtmlunorderedListToolbarCommand.prototype.GetState = function()
	{
		return FCK_TRISTATE_OFF;
	}

	// insertHtml's button click function
	insertHtmlunorderedListToolbarCommand.prototype.Execute = function()
	{

			FCK.InsertHtml(FCKConfig.insertHtmlunorderedList_snippet);
			FCK.EditorWindow.parent.FCKUndo.SaveUndoStep();
	}
