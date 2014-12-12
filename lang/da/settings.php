<?php

/**
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * 
 * @author Søren Birk <soer9648@eucl.dk>
 */
$lang['groups']                = 'Gruppe som tillades at deaktivere låsningstimer (forældet)';
$lang['fck_preview']           = 'FCK Forhåndsvisningsgruppe';
$lang['guest_toolbar']         = 'Vis Værktøjslinje til Gæster';
$lang['guest_media']           = 'Gæst Kan Linke til Mediefiler';
$lang['open_upload']           = 'Gæste Kan Uploade';
$lang['xcl_plugins']           = 'Kommasepareret liste over Uforanderlige Syntaks-plugins. Deres navne skal stå præcis som de vises i listen over Nuværende Installerede Plugins, som findes på pluginlisten på fckg administrationspanelet.';
$lang['default_fb']            = 'Standard adgang for fil-gennemgang. Hvis tomt, slår acl ikke igennem.';
$lang['openfb']                = 'Åbn Gennemse Filer. Dette giver brugeren adgang til den komplette mappestruktur, hvad end brugeren har rettigheder eller ej. ACL er stadig gældende for uploads.';
$lang['dw_edit_display']       = 'Kontrollerer hvilke brugere der har adgang til "DW Redigér"-knappen. Valgmuligheder: "all" for alle brugere; "admin" for admins og managers; "none" for ingen. Standardværdi "all".';
$lang['smiley_as_text']        = 'Vis smileys som tekst i FCKeditor (vises stadig som billeder i browseren)';
$lang['editor_bak']            = 'Gem backup til meta/&lt;namespace&gt;.fckg';
$lang['create_folder']         = 'Aktivér oprettelse af mapper i fil-browseren (j/n)';
$lang['dwedit_ns']             = 'Kommasepareret liste over navnerum, hvor FckgLite automatisk skifter til den medfødte DokuWiki Editor.';
$lang['acl_del']               = 'Standard (boks ikke afkrydset) tillader at brugere med upload-rettigheder kan slette mediefiler; hvis boksen er afkrydset, skal brugeren have slette-rettigheder, for at slette fra folderen.';
$lang['auth_ci']               = 'Brugerens login-id er ikke følsomt overfor store og små bogstaver. Det betyder at du både kan benytte BRUGER og bruger som login.';
$lang['nix_style']             = 'For Windows Servere (Vista og nyere). Denne indstilling gør det muligt at tilgå data\media gennem fckgckeditor\userfiles, hvis links til medier og filer er blevet oprettet med succes i userfiles.';
$lang['no_symlinks']           = 'Deaktiver automatisk oprettelse af symbolske links i fckg/userfiles.';
$lang['direction']             = 'Sæt Sprogretning i FCKeditor: <b>nocheck</b>: fckLite laver ikke ændringer ved sprogretningen; <b>dokuwiki</b>: den nuværende sprogretning for DokuWiki; <b>ltr</b>: Venstre-mod-højre; <b>rtl</b>: Højre-mod-venstre.';
$lang['scayt_auto']            = 'Automatisk aktivér SCAYT-stavekontrol. Standard til "on". For at deaktivere SCAYT, vælg "off".';
$lang['scayt']                 = 'Benyt SCAYT-stavekontrol. Dette er som standard sat til "on"; vælges "off", skiftes der til Spellerpages Checker.';
$lang['scayt_lang']            = 'Sæt standardsprog for SCAYT.';
$lang['smiley_hack']           = 'Gendan URL for FCKeditor\'s smilies, når der flyttes til ny server. Dette gøres på et side efter side-basis, når siden indlæses til redigering og gemmes. Dette bør normalt være sat til "off".';
$lang['complex_tables']        = 'Benyt kompleks tabelalgoritme. Modsat den standard fortolkning af tabeller, bør dette give et bedre resultat, når der blandes komplekse justeringer af rækkespredninger og kolonnespredninger.';
$lang['duplicate_notes']       = 'Sæt dette til sandt, hvis brugere opretter flere fodnoter i den samme fodnotetekst; nødvendigt, for at undgå at noter bliver korrupte.';
$lang['dw_priority']           = 'Sæt DokuWiki-editor som standard-editor.';
$lang['winstyle']              = 'Benyt direkte sti til mediemappen i stedet for fckeditor/userfiles. Dette kræver at filen fckeditor/userfiles/.htaccess.security kopieres til data/media og omdøbes til .htaccess.';
