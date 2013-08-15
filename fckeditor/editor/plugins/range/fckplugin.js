var oEditor;
var oRange = {};


FCK.breakDelObject = function(editor) {
    oEditor = editor;
    this.replaceStack = new Array();
    this.nodes = oRange.getElementsFromSelection();
 
}

FCK.breakDelObject.prototype.debug = function() {

      var doc = oEditor.FCK.EditorDocument;
      var buf=[];
       var nodes = this.nodes;
       if(nodes) {
         for(var ii=0; ii<nodes.length; ii++) {
           var text = FCK.paraDelObject.getData(nodes[ii]); 
           if(nodes[ii].nodeName.match(/body/i)) continue;
           if(nodes[ii].nodeName.toUpperCase() == 'BR') {
                this.setBreakToPara(nodes[ii]);          
           }
           buf[buf.length]=nodes[ii].nodeName+"&lt;"+text+"&gt";
         }


         return buf.join(", ");
       }
      return  "";
     };
FCK.breakDelObject.prototype.replace = function() {

   var doc = oEditor.FCK.EditorDocument;    
      for(var i=0; i <  this.replaceStack.length; i++) {
        var df = this.replaceStack[i].df;
        var parent = this.replaceStack[i].parent;
        var n = this.replaceStack[i].replace;    
          
        parent.replaceChild(df,n);
      }   


};


FCK.breakDelObject.prototype.setBreakToPara= function(n) {
  var doc = oEditor.FCK.EditorDocument;
  var para = doc.createElement('p'); 
  var f = doc.createDocumentFragment();
   for(var m=n.firstChild; m != null; m = m.nextSibling) {
        var clone = m.cloneNode(true);
        f.appendChild(clone);
      
 }
    f.appendChild(para);
    this.replaceStack.push({ df:f, parent: n.parentNode, replace: n });
    
}


FCK.breakDelObject.getData= function(n) {

 var data = "";
 if(n.nodeType == 3) data += n.data;
 for(var m=n.firstChild; m != null; m = m.nextSibling) {

     if(m.nodeType == 3) {
          data += m.data;
     }
 }
 return data;
};

FCK.paraDelObject = function(editor) {
    oEditor = editor;
    this.replaceStack = new Array();
    this.nodes = oRange.getElementsFromSelection();
 
}

// parent.replaceChild(new,old);
FCK.paraDelObject.prototype.debug = function() {
      var doc = oEditor.FCK.EditorDocument;
      var buf=[];
       var nodes = this.nodes;
       if(nodes) {
         for(var ii=0; ii<nodes.length; ii++) {
           var text = FCK.paraDelObject.getData(nodes[ii]); 
           if(nodes[ii].nodeName.match(/body/i)) continue;
           if(nodes[ii].nodeName.toUpperCase() == 'P') {
                this.setParaToBR(nodes[ii]);          
           }
           buf[buf.length]=nodes[ii].nodeName+"&lt;"+text+"&gt";
         }


         return buf.join(", ");
       }
      return  "";
     };

FCK.paraDelObject.prototype.replace = function() {

   var doc = oEditor.FCK.EditorDocument;    
      for(var i=0; i <  this.replaceStack.length; i++) {
        var df = this.replaceStack[i].df;
        var parent = this.replaceStack[i].parent;
        var n = this.replaceStack[i].replace;    
          
        parent.replaceChild(df,n);
      }   


};


FCK.paraDelObject.prototype.setParaToBR= function(n) {
  var doc = oEditor.FCK.EditorDocument;
  var br = doc.createElement('br'); 
  var f = doc.createDocumentFragment();
   for(var m=n.firstChild; m != null; m = m.nextSibling) {
        var clone = m.cloneNode(true);
        f.appendChild(clone);
      
 }
    f.appendChild(br);
    this.replaceStack.push({ df:f, parent: n.parentNode, replace: n });
    
}


FCK.paraDelObject.getData= function(n) {

 var data = "";
 if(n.nodeType == 3) data += n.data;
 for(var m=n.firstChild; m != null; m = m.nextSibling) {

     if(m.nodeType == 3) {
          data += m.data;
     }
 }
 return data;
};

	
FCK.rangeObject = function(editor) {
    oEditor = editor;
    this.nodes = oRange.getElementsFromSelection();

    this.blockquote = oRange.getBlockQoteElement(this.nodes);

	if (document.selection) {													// IE	
    	this.text = oEditor.FCK.EditorDocument.selection.createRange().htmlText;
	}
    else {
       this.text = oRange.getRangeText(this.blockquote);
    }
    this.replaceStack = new Array();
}

FCK.rangeObject.prototype.debug = function() {

       var buf=[];
       var kids = this.blockquote.childNodes;
       if(kids) {
         for(var ii=0; ii<kids.length; ii++) {
           var data = FCK.rangeObject.getNodeData(kids[ii]); 
           buf[buf.length]=kids[ii].nodeName+"&lt;"+ data +"&gt";
         }
         return (buf.join(", "));
       }
    return "";
};


//  BlockQ_Attr = { background: "#ffffff", textcolor: "#000000", width:"80%" };

FCK.rangeObject.prototype.createIndents = function(attrs) {
       
       this.background = attrs.background;
       this.textcolor = attrs.textcolor;

       var buf=[];
       var kids = this.blockquote.childNodes;
       if(kids) {
         for(var ii=0; ii<kids.length; ii++) {
           var data = this.insertIndent(kids[ii]); 
    
         }
    
       }
    
      
      for(var i=0; i <  this.replaceStack.length; i++) {
        var df = this.replaceStack[i].df;
        var parent = this.replaceStack[i].parent;
        var n = this.replaceStack[i].replace;  
        parent.replaceChild(df,n);
      }
};




FCK.rangeObject.setNodeColors = function (node, fg_color, bg_color) {
   node.style.cssText ="";
   var style =  "color: " + fg_color  +  ";  background-color: " + bg_color + ";";
   
  node.style.cssText = style;

  return style;
};

FCK.rangeObject.prototype.insertIndent = function(n) {
  var data = "";
  var doc = oEditor.FCK.EditorDocument;
  
    if(n.nodeType == 3) {
           var str = "";
           var parent_tag = n.parentNode.nodeName.toLowerCase(); 
           var parentNode = n.parentNode;
           if(/[\xA0\ufffd\xb7]/.test(n.data)) {
               var df = doc.createDocumentFragment();
               var regex = new RegExp(/([^\xA0\ufffd\xb7]*)([\xA0\ufffd\xb7]+)([^\xA0\ufffd\xb7]*)/g);           
                var str = n.data;
               // var output = "";
                while(result = regex.exec(str)) {

                    for(i in result) {
                       
                        var type = "parent: " + n.parentNode.nodeName + " this node: " + n.nodeName + " " + i;
                        switch (i) {
                            case '1':
                            case '3':                                                             
                            
                              if(result[i].length) {
                                 //output+= "<" +type + ">" + result[i] + '</' + parent_tag + ">\n";  
                                   var textnode = doc.createTextNode(result[i]);
                                   df.appendChild(textnode);
                              }
                               break;

                            case '2':                              
                              if(result[i].length) { 
                                   if(parent_tag == 'indent') {
                                     var style=FCK.rangeObject.setNodeColors (parentNode, this.background, this.background);  
                                    // output+='<indent style ="'+style+'">'+result[i]+'</indent>';   
                                     break;
                                   }
                                   var indent = doc.createElement('fck:indent');
                                   var style = FCK.rangeObject.setNodeColors (indent, this.background, this.background);  
                                   var textnode = doc.createTextNode(result[i]);
                                   indent.appendChild(textnode);
                                   df.appendChild(indent);                             
     
                                  // output+='<indent style ="'+style + '" ' + type + ' >'+result[i]+'</indent>';                                 
                              }
                               break;
          
                            default:                              
                              type = null;  
                        }                      
                    }
               }
         
              this.replaceStack.push({ df:df, parent: n.parentNode, replace: n });
     
          // alert(output);
           }

       
     }
     else {
       var kids = n.childNodes;
       for(var i = 0; i < kids.length; i++) {
          data += this.insertIndent(kids[i]);  
       }
    }

   return data;

};

FCK.rangeObject.getNodeData = function (n) {
  var data = "";

    if(n.nodeType == 3) {
           var str = "";
           for(var i=0; i < n.data.length; i++) {

             var c = n.data.charCodeAt(i);            
             str += c.toString(16) + ",";   
           }            
           return '[['+n.data+ ' {' + str + '} ]]';
     }
     else {
       var kids = n.childNodes;
       for(var i = 0; i < kids.length; i++) {
          data += "  " + kids[i].nodeName + ": ";
          data += FCK.rangeObject.getNodeData(kids[i]);  
       }
    }

   return data;
};


oRange.getElementsFromSelection = function() {

   var nodes=null, candidates=[], children, el, parent, rng;

   // Main
   rng=getSelectionRange();
   if(rng) {
     parent=getCommonAncestor(rng);
     if(parent) {
       // adjust from text node to element, if needed
       while(parent.nodeType!=1) parent=parent.parentNode;

       // obtain all candidates from parent (excluded)
       // up to BODY (included)
       if(parent.nodeName.toLowerCase()!="body") {
         el=parent;
         do {
           el=el.parentNode;
           candidates[candidates.length]=el;
         } while(el.nodeName.toLowerCase()!="body");
       }

       // obtain all candidates down to all children
       children=parent.all||parent.getElementsByTagName("*");
       for(var j=0; j<children.length; j++)
         candidates[candidates.length]=children[j];

       // proceed - keep element when range touches it
       nodes=[parent];
       for(var ii=0, r2; ii<candidates.length; ii++) {
         r2=createRangeFromElement(candidates[ii]);
         if(r2 && rangeContact(rng, r2))
           nodes[nodes.length]=candidates[ii];
       }
     }
   };
 
   return nodes;

   // Helpers

   function getSelectionRange () {
     var win = oEditor.FCK.EditorWindow;	
     var doc = oEditor.FCK.EditorDocument;
     var rng=null;
     if(win.getSelection) {
       rng=win.getSelection();
       if(rng && rng.rangeCount && rng.getRangeAt) {
         rng=rng.getRangeAt(0);
       }
     } else if(doc.selection && doc.selection.type=="Text") {
       rng=doc.selection.createRange();
     }
 
     return rng;
   };


   function getCommonAncestor(rng) {
     return rng.parentElement ?
              rng.parentElement() : rng.commonAncestorContainer;
   }

   function rangeContact(r1, r2) {
     var p=null;
     if(r1.compareEndPoints) {
       p={
         method:"compareEndPoints",
         StartToStart:"StartToStart",
         StartToEnd:"StartToEnd",
         EndToEnd:"EndToEnd",
         EndToStart:"EndToStart"
       }
     } else if(r1.compareBoundaryPoints) {
       p={
         method:"compareBoundaryPoints",
         StartToStart:0,
         StartToEnd:1,
         EndToEnd:2,
         EndToStart:3
       }
     }
     return p && !(
           r2[p.method](p.StartToStart, r1)==1 &&
           r2[p.method](p.EndToEnd, r1)==1 &&
           r2[p.method](p.StartToEnd, r1)==1 &&
           r2[p.method](p.EndToStart, r1)==1
           ||
           r2[p.method](p.StartToStart, r1)==-1 &&
           r2[p.method](p.EndToEnd, r1)==-1 &&
           r2[p.method](p.StartToEnd, r1)==-1 &&
           r2[p.method](p.EndToStart, r1)==-1
         );
   }


   function createRangeFromElement(el) {

     var win = oEditor.FCK.EditorWindow;	
     var doc = oEditor.FCK.EditorDocument;

     var rng=null;
     if(doc.body.createTextRange) {
       rng=doc.body.createTextRange();
       rng.moveToElementText(el);
     } else if(doc.createRange) {
       rng=doc.createRange();
       rng.selectNodeContents(el);
     }
     return rng;
   }

};




// Firefox, Safari
oRange.getRangeText = function(node) {
    var doc = oEditor.FCK.EditorDocument;
    var oRange1 = doc.createRange();

    oRange1.selectNodeContents(node);
    var text = oRange1.toString();

    text = text.replace(/\n/g,"<BR />");

    return text;
};


oRange.getBlockQoteElement = function(nodes) {
var blockq;
       if(!nodes) nodes=oRange.getElementsFromSelection();

       if(nodes) {
         for(var ii=0; ii<nodes.length; ii++) {
               if(nodes[ii].nodeName.toUpperCase() == 'BLOCKQUOTE') {
                 return nodes[ii];    
                }
           }
       }

   return blockq;

};




