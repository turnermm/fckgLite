<?php

/**
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * 
 * @author Ben Fey <spam@lifeisgoooood.de>
 * @author Florian Lamml <info@florian-lamml.de>
 * @author Padhie <develop@padhie.de>
 * @author Dana <dannax3@gmx.de>
 */
$lang['groups']                = 'Liste der Gruppen mit Erlaubnis den Verriegelung-Timer zu sperren';
$lang['fck_preview']           = 'FCK Vorschaugruppe';
$lang['guest_toolbar']         = 'Toolbar für Gäste anzeigen';
$lang['guest_media']           = 'Gäste können Media-Dateien verlinken';
$lang['open_upload']           = 'Gäste können Dateien hochladen';
$lang['xcl_plugins']           = 'Durch Kommata getrennte Liste von unveränderlichen Syntax-Plugins. Deren Namen sollten exakt dieselben sein wie in der Liste der aktuell installierten Plugins, welche der Plugin-Liste der fckg-Administrationsoberfläche zu entnehmen sind.';
$lang['default_fb']            = 'Default File-Browsing Zugang. Wenn keiner aktiviert ist, wird acl nicht angewendet.';
$lang['openfb']                = 'Dateibrowser öffnen. Benutzer haben Zugriff auf die komplette Ordnerstruktur, unabhängig davon ob der Benutzer entsprechende Rechte besitzt oder nicht. Die ACL beschränkt den Upload von Dateien.';
$lang['dw_edit_display']       = 'Bestimmt welche Benutzer Zugriff auf den "DW Edit" Button erhalten. Auswahl: "all" für alle Benutzer; "admin" nur für Administratoren; "none" für niemand. Der Standard ist "all".';
$lang['smiley_as_text']        = 'Emoticons im FCKeditor als Text anzeigen (werden im Browser weiterhin als Bild angezeigt)';
$lang['editor_bak']            = 'Backup speichern in meta/&lt;namespace&gt;.fckg';
$lang['create_folder']         = 'Im Dateimanager den Button um Ordner zu erstellen anzeigen';
$lang['dwedit_ns']             = 'Durch Kommata getrennte Liste der Namesräume, wo FckgLite automatisch zum nativen DokuWiki-Editor wechselt.';
$lang['acl_del']               = 'Standard (nicht aktiviert) erlaubt es den Benutzern mit Upload-Berechtigungen ebenfalls Media-Dateien zu löschen; Falls aktiviert benötigen die Benutzer zusätzlich die Berechtigung "löschen".';
$lang['auth_ci']               = 'Bei der Benutzer ID wird Groß-/Kleinschreibung nicht unterschieden. Somit ist es möglich sich mit "BENUTZER" und "benutzer" anzumelden.';
$lang['nix_style']             = 'Für Windows-Server (Vista und neuer).
Diese Einstellung ermöglicht es, über fckgckeditor\userfiles auf data\media zuzugreifen, sofern Links zu media und file erfolgreich in den userfiles erstellt wurden.';
$lang['no_symlinks']           = 'Automatische Erstellung von Links in fckg/userfiles deaktivieren.';
$lang['direction']             = 'Festlegen der Sprachrichtung in FCKeditor: <b>nocheck</b>: fckgLite wird keine Änderungen an der Default-Sprachrichtungseinstellung vornehmen; <b>dokuwiki</b>: Die aktuelle Dokuwiki Sprachrichtung; <b>ltr</b>: Links-nach-Rechts ; <b>rtl</b>: Rechts-nach-Links.';
$lang['scayt_auto']            = 'Spellchecker "SCAYT" automatisch aktivieren. Standard ist "on". Um "SCAYT" zu deaktivieren auf "off" setzen.';
$lang['scayt']                 = 'Spellchecker "SCAYT" verwenden. Standard ist "on". Auf "off" setzen um zum "spellerpages" Spellchecker zu wechseln.';
$lang['scayt_lang']            = 'Setze SCAYT Standardsprache';
$lang['smiley_hack']           = 'Zurücksetzen der URL für FCKeditor-Smilies beim Umzug auf einen neuen Server. Dies wird auf Page by Page-Basis durchgeführt, wenn die Seite im Editier-Modus geladen ist und gespeichert wird. Diese Option sollte normalerweise ausgeschaltet sein.';
$lang['complex_tables']        = 'Benutzen des Algorithmus "Komplexe Tabellen". Im Gegensatz zur Standard-Syntaxanalyse von Tabellen wird dies bessere Resultate erzielen, wenn komplexe Anordnungen von Reihenbereichen und Spaltenbereichen gemischt werden.';
$lang['duplicate_notes']       = 'Setzen Sie dies auf true, wenn Benutzer mehrere Fußnoten mit dem selben Fußnoten-Text erstellen; nötig, um Notizen vor Verfälschung zu schützen.';
$lang['dw_priority']           = 'Den Dokuwiki Editor als Standard-Editor verwenden';
$lang['winstyle']              = 'Benutzen des direkten Pfades zum Media-Verzeichnis anstelle von fckeditor/userfiles. Dies macht es zwingend erforderlich, dass fckeditor/userfiles/.htaccess.security nach data/media kopiert und in .htaccess umbenannt wird.';
