/** 
 *  'default' is the ochre toolbar, which is the FCKeditor's default scheme
 *  'silver' is DokuWikiFCK's default scheme;
 *        nothing on this page needs to be changed if you want the silver toolbar
 *   'office2003' replicates the appearance of the Ms Office toolbar
 *
*/

/**
 *    To select a new toolbar scheme, uncomment your choice; for instance, change
 *           //FCKConfig.FCKGSkinType='office2003';
 *    to:
 *           FCKConfig.FCKGSkinType='office2003';
 *
 *    The unwanted schemes must remain commented out
*/

//FCKConfig.FCKGSkinType='default';
//FCKConfig.FCKGSkinType='silver';
//FCKConfig.FCKGSkinType='office2003';


/** Do Not Change Anything Below This Line  */

if(FCKConfig.FCKGSkinType) {
    FCKConfig.SkinPath = FCKConfig.BasePath + 'skins/' + FCKConfig.FCKGSkinType +'/' ;
}

