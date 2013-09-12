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
 * Editor configuration settings.
 *
 * Follow this link for more information:
 * http://wiki.fckeditor.net/Developer%27s_Guide/Configuration/Configurations_Settings
 */

function test_cookie(name, value) {    
    var allcookies = document.cookie;
    var pos = allcookies.indexOf(name);
    if(pos != -1) {
        var start = pos + (name.length+1);
        var end = allcookies.indexOf(";",start);
        if(end == -1) end = allcookies.length;
        var cookie_value = allcookies.substring(start,end);
        cookie_value=decodeURIComponent(cookie_value);       
        if(value) return (cookie_value == value);
        return cookie_value;
    }    
    return false;
}    

var AdminSelectedSpellChecker = 'SpellerPages';
if(test_cookie('SCAYT', 'on')) {
     AdminSelectedSpellChecker = 'SCAYT';
    if(test_cookie('FCK_SCAYT_AUTO', 'on')) {
       FCKConfig.ScaytAutoStartup = true;
    }   
    AdminSelectedLang = test_cookie('FCK_SCAYT_LANG');
    if(AdminSelectedLang) {
       FCK.Config.ScaytDefLang = AdminSelectedLang;
    }
}

FCKConfig.CustomConfigurationsPath = '' ;

FCKConfig.EditorAreaCSS = FCKConfig.BasePath + 'css/fck_editorarea.css' ;
FCKConfig.EditorAreaIEHackCSS = FCKConfig.BasePath + 'css/ie_hack.css' ;
FCKConfig.EditorAreaStyles = '' ;
FCKConfig.ToolbarComboPreviewCSS = '' ;

FCKConfig.DocType = '' ;

FCKConfig.BaseHref = '' ;

FCKConfig.FullPage = false ;

// The following option determines whether the "Show Blocks" feature is enabled or not at startup.
FCKConfig.StartupShowBlocks = false ;

FCKConfig.Debug = false ;
FCKConfig.AllowQueryStringDebug = true ;

FCKConfig.SkinPath = FCKConfig.BasePath + 'skins/silver/' ;

FCKConfig.SkinEditorCSS = '' ;	// FCKConfig.SkinPath + "|<minified css>" ;
FCKConfig.SkinDialogCSS = '' ;	// FCKConfig.SkinPath + "|<minified css>" ;
FCKConfig.fckgRTLCSS=FCKConfig.BasePath + 'css/fck_editorarea_RTL.css';
//alert(FCKConfig.fckgRTLCSS);
FCKConfig.PreloadImages = [ FCKConfig.SkinPath + 'images/toolbar.start.gif', FCKConfig.SkinPath + 'images/toolbar.buttonarrow.gif' ] ;

FCKConfig.PluginsPath = FCKConfig.BasePath + 'plugins/' ;

FCKConfig.AutoGrowMax = 400 ;

// FCKConfig.ProtectedSource.Add( /<%[\s\S]*?%>/g ) ;	// ASP style server side code <%...%>
// FCKConfig.ProtectedSource.Add( /<\?[\s\S]*?\?>/g ) ;	// PHP style server side code
// FCKConfig.ProtectedSource.Add( /(<asp:[^\>]+>[\s|\S]*?<\/asp:[^\>]+>)|(<asp:[^\>]+\/>)/gi ) ;	// ASP.Net style tags <asp:control>

FCKConfig.AutoDetectLanguage	= true ;
FCKConfig.DefaultLanguage		= 'en' ;
if(top.fckg_isRTL() ) {
  FCKConfig.ContentLangDirection	= 'rtl'
  FCKConfig.EditorAreaCSS = FCKConfig.fckgRTLCSS;
}
else {
    FCKConfig.ContentLangDirection	= 'ltr'
}
FCKConfig.ProcessHTMLEntities	= true ;
FCKConfig.IncludeLatinEntities	= true ;
FCKConfig.IncludeGreekEntities	= true ;

FCKConfig.ProcessNumericEntities = false ;

FCKConfig.AdditionalNumericEntities = ''  ;		// Single Quote: "'"

FCKConfig.FillEmptyBlocks	= true ;

FCKConfig.FormatSource		= true ;
FCKConfig.FormatOutput		= true ;
FCKConfig.FormatIndentator	= '    ' ;

FCKConfig.EMailProtection = 'none' ; // none | encode | function
FCKConfig.EMailProtectionFunction = 'mt(NAME,DOMAIN,SUBJECT,BODY)' ;

//FCKConfig.GeckoUseSPAN	= false ;
FCKConfig.StartupFocus	= false ;
FCKConfig.ForcePasteAsPlainText	= false ;
FCKConfig.AutoDetectPasteFromWord = true ;	// IE only.
FCKConfig.ShowDropDialog = true ;
FCKConfig.ForceSimpleAmpersand	= false ;
FCKConfig.TabSpaces		= 0 ;
FCKConfig.ShowBorders	= true ;
FCKConfig.SourcePopup	= true ;
FCKConfig.ToolbarStartExpanded	= true ;
FCKConfig.ToolbarCanCollapse	= true ;
FCKConfig.IgnoreEmptyParagraphValue = true ;
//FCKConfig.PreserveSessionOnFileBrowser = false ;
FCKConfig.FloatingPanelsZIndex = 10000 ;
FCKConfig.HtmlEncodeOutput = false ;

FCKConfig.TemplateReplaceAll = true ;
FCKConfig.TemplateReplaceCheckbox = true ;

FCKConfig.ToolbarLocation = 'In' ;


FCKConfig.Plugins.Add('tableformat') ;
FCKConfig.Plugins.Add('plugintool', 'en,fr,nl') ;
FCKConfig.Plugins.Add( 'paradelete' ) ;
FCKConfig.Plugins.Add( 'range' ) ;
FCKConfig.Plugins.Add( 'insertHtmlCode') ;  // this is the footnote plugin
FCKConfig.Plugins.Add( 'geshi') ;
FCKConfig.Plugins.Add( 'fonts', 'en,nl') ;
FCKConfig.Plugins.Add('keyboard') ;
FCKConfig.Plugins.Add('signature') ;

FCKConfig.ToolbarSets["Default"] = [
	['Source','DocProps','-','Save','NewPage','Preview','-','Templates'],
	['Cut','Copy','Paste','PasteText','PasteWord','-','Print','SpellCheck'],
	['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
	['Form','Checkbox','Radio','TextField','Textarea','Select','Button','ImageButton','HiddenField'],
	'/',
	['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],
	['OrderedList','UnorderedList','-','Outdent','Indent','Blockquote','CreateDiv'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['Link','Unlink','Anchor'],
	['Image','Flash','Table','Rule','Smiley','SpecialChar','PageBreak'],
	'/',
	['Style','FontFormat','FontName','FontSize'],
	['TextColor','BGColor'],
	['FitWindow','ShowBlocks','-','About']		// No comma for the last row.
] ;

FCKConfig.ToolbarSets["Basic"] = [
	['Bold','Italic','-','OrderedList','UnorderedList','-','Link','Unlink','-','About']
] ;

FCKConfig.EnterMode = 'p' ;			// p | div | br
FCKConfig.ShiftEnterMode = 'br' ;	// p | div | br

FCKConfig.Keystrokes = [
	[ CTRL + 65 /*A*/, true ],
	[ CTRL + 67 /*C*/, true ],
	[ CTRL + 70 /*F*/, true ],
	[ CTRL + 83 /*S*/, true ],
	[ CTRL + 84 /*T*/, true ],
	[ CTRL + 88 /*X*/, true ],
	[ CTRL + 86 /*V*/, 'Paste' ],
	[ CTRL + 45 /*INS*/, true ],
	[ SHIFT + 45 /*INS*/, 'Paste' ],
	[ CTRL + 88 /*X*/, 'Cut' ],
	[ SHIFT + 46 /*DEL*/, 'Cut' ],
	[ CTRL + 90 /*Z*/, 'Undo' ],
	[ CTRL + 89 /*Y*/, 'Redo' ],
	[ CTRL + SHIFT + 90 /*Z*/, 'Redo' ],
	[ CTRL + 76 /*L*/, 'Link' ],
	[ CTRL + 66 /*B*/, 'Bold' ],
	[ CTRL + 73 /*I*/, 'Italic' ],
	[ CTRL + 85 /*U*/, 'Underline' ],
	[ CTRL + SHIFT + 83 /*S*/, 'Save' ],
	[ CTRL + ALT + 13 /*ENTER*/, 'FitWindow' ],
	[ SHIFT + 32 /*SPACE*/, 'Nbsp' ]
] ;

FCKConfig.ContextMenu = ['Generic','Link','Anchor','Image','Flash','Select','Textarea','Checkbox','Radio','TextField','HiddenField','ImageButton','Button','Table','Form'] ;
FCKConfig.BrowserContextMenuOnCtrl = false ;
FCKConfig.BrowserContextMenu = false ;

FCKConfig.EnableMoreFontColors = true ;
FCKConfig.FontColors = '000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,808080,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF' ;

FCKConfig.FontFormats	= 'p;h1;h2;h3;h4;h5';  // code
FCKConfig.FontNames		= 'Arial;Comic Sans MS;Courier New;Tahoma;Times New Roman;Verdana;Gill Sans,Gill Sans MT,Arial;Copperplate Gothic Light,CopperplateLight;Baskerville,Baskerville Old Face;Lucida Bright;Palatino, Palatino Linotype;Garamond';

//FCKConfig.FontSizes		= 'smaller;larger;xx-small;x-small;small;medium;large;x-large;xx-large' ;
FCKConfig.FontSizes		= '6pt;8pt;9pt;10pt;11pt;12pt;14pt;16pt;18pt;24pt;36pt' ;

FCKConfig.StylesXmlPath		= FCKConfig.EditorPath + 'fckstyles.xml' ;
FCKConfig.TemplatesXmlPath	= FCKConfig.EditorPath + 'fcktemplates.xml' ;

//FCKConfig.SpellChecker		= 'SCAYT' ;//'SpellerPages'; //	= 'ieSpell' ;	// 'ieSpell' | 'SpellerPages'
FCKConfig.SpellChecker = AdminSelectedSpellChecker;
//FCKConfig.ScaytAutoStartup = true;
FCKConfig.IeSpellDownloadUrl	= 'http://www.iespell.com/download.php' ;
FCKConfig.SpellerPagesServerScript = 'server-scripts/spellchecker.php' ;	// Available extension: .php .cfm .pl
FCKConfig.FirefoxSpellChecker	= false ;

FCKConfig.MaxUndoLevels = 15 ;

FCKConfig.DisableObjectResizing = false ;
FCKConfig.DisableFFTableHandles = true ;

FCKConfig.LinkDlgHideTarget		= false ;
FCKConfig.LinkDlgHideAdvanced	= false ;

FCKConfig.ImageDlgHideLink		= false ;
FCKConfig.ImageDlgHideAdvanced	= false ;

FCKConfig.FlashDlgHideAdvanced	= false ;

// Tags for DokuWikiFCK
FCKConfig.ProtectedTags = 'indent' ;
FCKConfig.ProtectedTags = 'header' ;
FCKConfig.ProtectedTags = 'plugin' ;
FCKConfig.ProtectedTags = 'fckg' ;   
//FCKConfig.ProtectedTags = 'font' ; 

// This will be applied to the body element of the editor
FCKConfig.BodyId = '' ;
FCKConfig.BodyClass = '' ;

FCKConfig.DefaultStyleLabel = '' ;
FCKConfig.DefaultFontFormatLabel = '' ;
FCKConfig.DefaultFontLabel = '' ;
FCKConfig.DefaultFontSizeLabel = '' ;

FCKConfig.DefaultLinkTarget = '' ;

// The option switches between trying to keep the html structure or do the changes so the content looks like it was in Word
FCKConfig.CleanWordKeepsStructure = false ;

// Only inline elements are valid.
FCKConfig.RemoveFormatTags = 'b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var' ;

// Attributes that will be removed
//FCKConfig.RemoveAttributes = 'class,style,lang,width,height,align,hspace,valign' ;
FCKConfig.RemoveAttributes = 'lang,width,height,align,hspace,valign' ;

FCKConfig.CustomStyles = 
{
//	'Red Title'	: { Element : 'h3', Styles : { 'color' : 'Red' } }
};

FCKConfig.FontNamesArray = Array(
'Arial',
'Arial Black',
'Arial Narrow',
'Arial Rounded MT Bold',
'Baskerville, Baskerville Old Face',
'Bauhaus 93',
'Comic Sans MS',
'Copperplate, Copperplate Gothic Bold',
'Courier',
'Courier New',
'Futura, Futura Md BT',
'Georgia',
'Garamond',
'Helvetica',
'Impact',
'Sans-serif',
'Microsoft Sans Serif',
'Serif',
'Palatino, Palatino Linotype',
'Papyrus',
'Tahoma',
'Times New Roman',
'Trebuchet MS',
'Verdana'
);

// Do not add, rename or remove styles here. Only apply definition changes.
FCKConfig.CoreStyles = 
{
	// Basic Inline Styles.
	'Bold'			: { Element : 'b', Overrides : 'strong' },
	'Italic'		: { Element : 'i', Overrides : 'em' },
	'Underline'		: { Element : 'u' },
	'StrikeThrough'	: { Element : 'strike' },
	'Subscript'		: { Element : 'sub' },
	'Superscript'	: { Element : 'sup' },

	
	// Basic Block Styles (Font Format Combo).
	'p'				: { Element : 'p' },
	'div'			: { Element : 'div' },
	'pre'			: { Element : 'pre' },
	'address'		: { Element : 'address' },
	'h1'			: { Element : 'h1' },
	'h2'			: { Element : 'h2' },
	'h3'			: { Element : 'h3' },
	'h4'			: { Element : 'h4' },
	'h5'			: { Element : 'h5' },
	'h6'			: { Element : 'h6' },
	'code'                  : { Element : 'code' },
 
	// Other formatting features.
	'FontFace' : 
	{ 
		Element		: 'span', 
		Styles		: { 'font-family' : '#("Font")' }, 
		Overrides	: [ { Element : 'font', Attributes : { 'face' : null } } ]
	},
	
	'Size' :
	{ 
		Element		: 'span', 
		Styles		: { 'font-size' : '#("Size","fontSize")' }, 
		Overrides	: [ { Element : 'font', Attributes : { 'size' : null } } ]
	},
	
	'Color' :
	{ 
		Element		: 'span', 
		Styles		: { 'color' : '#("Color","color")' }, 
		Overrides	: [ { Element : 'font', Attributes : { 'color' : null } } ]
	},
	
	'BackColor'		: { Element : 'span', Styles : { 'background-color' : '#("Color","color")' } },

	'SelectionHighlight' : { Element : 'span', Styles : { 'background-color' : 'navy', 'color' : 'white' } }
};

//FCKConfig.CoreStyles['Code'] = { Element : 'code' };
// The distance of an indentation step.
FCKConfig.IndentLength = 40 ;
FCKConfig.IndentUnit = 'px' ;

// Alternatively, FCKeditor allows the use of CSS classes for block indentation.
// This overrides the IndentLength/IndentUnit settings.
FCKConfig.IndentClasses = [] ;

// [ Left, Center, Right, Justified ]
FCKConfig.JustifyClasses = [] ;

// The following value defines which File Browser connector and Quick Upload
// "uploader" to use. It is valid for the default implementaion and it is here
// just to make this configuration file cleaner.
// It is not possible to change this value using an external file or even
// inline when creating the editor instance. In that cases you must set the
// values of LinkBrowserURL, ImageBrowserURL and so on.
// Custom implementations should just ignore it.
var _FileBrowserLanguage	= 'php' ;	// asp | aspx | cfm | lasso | perl | php | py
var _QuickUploadLanguage	= 'php' ;	// asp | aspx | cfm | lasso | perl | php | py

// Don't care about the following two lines. It just calculates the correct connector
// extension to use for the default File Browser (Perl uses "cgi").
var _FileBrowserExtension = _FileBrowserLanguage == 'perl' ? 'cgi' : _FileBrowserLanguage ;
var _QuickUploadExtension = _QuickUploadLanguage == 'perl' ? 'cgi' : _QuickUploadLanguage ;

FCKConfig.LinkBrowser = true ;
FCKConfig.LinkBrowserURL = FCKConfig.BasePath + 'filemanager/browser/default/browser.html?Connector=' + encodeURIComponent( FCKConfig.BasePath + 'filemanager/connectors/' + _FileBrowserLanguage + '/connector.' + _FileBrowserExtension ) ;
FCKConfig.LinkBrowserWindowWidth	= FCKConfig.ScreenWidth * 0.7 ;		// 70%
FCKConfig.LinkBrowserWindowHeight	= FCKConfig.ScreenHeight * 0.7 ;	// 70%

FCKConfig.ImageBrowser = true ;
FCKConfig.ImageBrowserURL = FCKConfig.BasePath + 'filemanager/browser/default/browser.html?Type=Image&Connector=' + encodeURIComponent( FCKConfig.BasePath + 'filemanager/connectors/' + _FileBrowserLanguage + '/connector.' + _FileBrowserExtension ) ;
FCKConfig.ImageBrowserWindowWidth  = FCKConfig.ScreenWidth * 0.7 ;	// 70% ;
FCKConfig.ImageBrowserWindowHeight = FCKConfig.ScreenHeight * 0.7 ;	// 70% ;

FCKConfig.FlashBrowser = true ;
FCKConfig.FlashBrowserURL = FCKConfig.BasePath + 'filemanager/browser/default/browser.html?Type=Flash&Connector=' + encodeURIComponent( FCKConfig.BasePath + 'filemanager/connectors/' + _FileBrowserLanguage + '/connector.' + _FileBrowserExtension ) ;
FCKConfig.FlashBrowserWindowWidth  = FCKConfig.ScreenWidth * 0.7 ;	//70% ;
FCKConfig.FlashBrowserWindowHeight = FCKConfig.ScreenHeight * 0.7 ;	//70% ;

FCKConfig.LinkUpload = true ;
FCKConfig.LinkUploadURL = FCKConfig.BasePath + 'filemanager/connectors/' + _QuickUploadLanguage + '/upload.' + _QuickUploadExtension ;
//FCKConfig.LinkUploadAllowedExtensions	= ".(7z|aiff|asf|avi|bmp|csv|doc|fla|flv|gif|gz|gzip|jpeg|jpg|mid|mov|mp3|mp4|mpc|mpeg|mpg|ods|odt|pdf|png|ppt|pxd|qt|ram|rar|rm|rmi|rmvb|rtf|sdc|sitd|swf|sxc|sxw|tar|tgz|tif|tiff|txt|vsd|wav|wma|wmv|xls|xml|zip)$" ;			// empty for all
FCKConfig.LinkUploadAllowedExtensions	= "";
FCKConfig.LinkUploadDeniedExtensions	= "" ;	// empty for no one

FCKConfig.ImageUpload = true ;
FCKConfig.ImageUploadURL = FCKConfig.BasePath + 'filemanager/connectors/' + _QuickUploadLanguage + '/upload.' + _QuickUploadExtension + '?Type=Image' ;
//FCKConfig.ImageUploadAllowedExtensions	= ".(jpg|gif|jpeg|png|bmp|svg)$" ;		// empty for all
FCKConfig.ImageUploadAllowedExtensions	= ".(jpg|gif|jpeg|png|bmp)$" ;		// empty for all
FCKConfig.ImageUploadDeniedExtensions	= "" ;							// empty for no one

FCKConfig.FlashUpload = true ;
FCKConfig.FlashUploadURL = FCKConfig.BasePath + 'filemanager/connectors/' + _QuickUploadLanguage + '/upload.' + _QuickUploadExtension + '?Type=Flash' ;
FCKConfig.FlashUploadAllowedExtensions	= ".(swf|flv)$" ;		// empty for all
FCKConfig.FlashUploadDeniedExtensions	= "" ;					// empty for no one

FCKConfig.dokuSmileyPath = 'http://' + top.dokuBase + 'lib/images/smileys/';
// FCKConfig.insertedDokuSmiley = top.insertedDokuSmiley;

FCKConfig.SmileyPath	= FCKConfig.BasePath + 'images/smiley/msn/' ;
FCKConfig.SmileyImages	= ['regular_smile.gif','sad_smile.gif','wink_smile.gif','teeth_smile.gif','confused_smile.gif','tounge_smile.gif','embaressed_smile.gif','omg_smile.gif','whatchutalkingabout_smile.gif','angry_smile.gif','angel_smile.gif','shades_smile.gif','devil_smile.gif','cry_smile.gif','lightbulb.gif','thumbs_down.gif','thumbs_up.gif','heart.gif','broken_heart.gif','kiss.gif','envelope.gif'] ;
FCKConfig.SmileyColumns = 8 ;
FCKConfig.SmileyWindowWidth		= 350 ;
FCKConfig.SmileyWindowHeight	= 400 ;
//FCKConfig.SmileyWindowHeight	= 400 ;

FCKConfig.ToolbarSets["DokuwikiNoGuest"] = [  
  ['Source' ], 
  ['About']  
] ;  

FCKConfig.ToolbarSets["DokuwikiGuest"] = [   
  ['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],   
  ['OrderedList','UnorderedList'],
  ['Rule', 'Smiley', 'SpecialChar', 'Style'], [],  
  ['Cut','Copy','Paste','PasteText', 'SpellCheck', 'Find'],   
  ['FontFormat'], ['Undo','Redo','RemoveFormat', '-','Table' ],   
  ['Plugin_Tool',  'Delete_P' ],
  ['Source' ],   
  ['About']  
] ;  


FCKConfig.ToolbarSets["Dokuwiki"] = [   
  ['Bold','Italic','Underline','StrikeThrough','-','Subscript','Superscript'],   
  ['OrderedList','UnorderedList','Outdent','Indent', 'insertHtmlCode' ],  // insertHtmlCode is footnote plugin
  ['Rule', 'Smiley', 'SpecialChar', 'Style'], [],['fonts'],  
  ['Cut','Copy','Paste','PasteText','PasteWord', 'SpellCheck', 'Find'],   
  ['FontFormat'], ['Undo','Redo','RemoveFormat', '-','Table' ],   
  ['Plugin_Tool',  'Delete_P' ],['FitWindow'],
  ['Link','Unlink'], ['Image', 'Source','geshi' ],   
  ['About','keyboard']  
] ;  

FCK.getCurrentWikiNS = function () {
 var ns = "";
 if(top.getCurrentWikiNS) {
     ns = top.getCurrentWikiNS();
 }

  return ns;
}


FCKConfig.BackgroundBlockerColor = '#ffffff' ;
FCKConfig.BackgroundBlockerOpacity = 0.50 ;

FCKConfig.MsWebBrowserControlCompat = false ;

FCKConfig.PreventSubmitHandler = false ;

FCKConfig.Geshi_Types = new Array(
"actionscript","actionscript3","ada","apache","applescript","asm","asp",
"autoit","avisynth","bash","basic4gl","bf","bibtex","blitzbasic","bnf","boo","c",
"c_mac","caddcl","cadlisp","cfdg","cfm","cil","cmake","cobol","cpp","cpp-qt",
"csharp","css","d","dcs","delphi","diff","div","dos","dot","eiffel","email","erlang","fo",
"fortran","freebasic","genero","glsl","gml","gnuplot","groovy","gettext","haskell","hq9plus",
"html","idl","ini","inno","intercal","io","java5","java","javascript",
"kixtart","klonec","klonecpp","latex","lisp","locobasic","lolcode",
"lotusformulas","lotusscript","lscript","lsl2","lua","m68k","make","matlab",
"mirc","modula3","mpasm","mxml","mysql","nsis","oberon2","objc","ocaml-brief",
"ocaml","oobas","oracle8","oracle11","pascal","perl","per","php-brief","php",
"pic16","pixelbender","plsql","povray","powershell","progress","prolog","properties",
"providex","python","qbasic","rails","rebol","reg","robots","ruby","sas","scala",
"scheme","scilab","sdlbasic","smalltalk","smarty","sql","tcl","teraterm","text",
"thinbasic","tsql","typoscript","vbnet","vb","verilog","vhdl","vim",
"visualfoxpro","visualprolog","whitespace","winbatch","whois","xml","xorg_conf","xpp","z80"

);


function get_image_extensions(){
    var ajx = new sack();    
	ajx.requestFile =  "../extensions.php";
	ajx.method = 'POST';
	ajx.onCompletion = function() {
	    if(ajx.responseStatus && ajax.responseStatus[0] == 200) {
		    var image_types = ajx.response;		
		    if(image_types)
		        FCKConfig.ImageUploadAllowedExtensions	= '.(' + image_types+ ')$' ;		
		    } 		    
		
	};
	ajx.runAJAX();
}


FCKConfig.dokuSmileyConfImages;
try {
var ajax = new sack();
   do_smileys();
}catch(ex){

}

try {
get_image_extensions();
}catch(ex) {alert(ex)}

function do_smileys(){
	ajax.requestFile =  "../dwsmileys.php";
	ajax.method = 'POST';
	ajax.onCompletion = whenCompleted;
	ajax.runAJAX();
}


function whenCompleted(){
    
    if(ajax.responseStatus && ajax.responseStatus[0] == 200) {

       FCKConfig.dokuSmileyConfImages = new Array();
       smileys = ajax.response.replace(/#.*?\n/g,"");
       smileys = smileys.replace(/^[\s\n]+$/mg,"");
       smileys=smileys.split(/\n/);
       if(!smileys[0]) smileys.shift();
       if(!smileys[smileys.length-1]) smileys.pop();   
       for(var i=0; i < smileys.length; i++) {            
            var a = smileys[i].split(/\s+/);
            if(a[0].match(/DELETEME/) || a[0].match(/FIXME/)) continue;
            FCKConfig.dokuSmileyConfImages[i] = a;
      }      
    }
}

FCKConfig.dokuSmileyImages	=
                          [['8-)','icon_cool.gif'],
                      	  ['8-O','icon_eek.gif'],                      	
                      	  [':-(','icon_sad.gif'],
                      	  [':-)','icon_smile.gif'],
                      	  ['=)','icon_smile2.gif'],
                      	  [':-/','icon_doubt.gif'],                      	  
                      	  [':-?','icon_confused.gif'],
                      	  [':-D','icon_biggrin.gif'],
                      	  [':-P','icon_razz.gif'],
                      	
                      	  [':-O','icon_surprised.gif'],
                      	  [':-X','icon_silenced.gif'],
                      	 
                      	  [':-|','icon_neutral.gif'],
                      	  [';-)','icon_wink.gif'],
                      	  ['^_^','icon_fun.gif'],
                      	  [':?:','icon_question.gif'],
                      	  [':!:','icon_exclaim.gif'],
                      	  ['LOL','icon_lol.gif']];


FCK.get_FCK = function(){
  return FCK;
}

FCK.get_FCKConfig = function(){
  return FCKConfig;
}

