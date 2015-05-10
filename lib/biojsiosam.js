  /*
 * biojs-io-sam
 * https://github.com/homonecloco/biojs-io-sam
 *
 * Copyright (c) 2014 Ricardo H. Ramirez-Gonzalez
 * Licensed under the Apache 2 license.
 */

var parser = require('biojs-io-parser');
parser.mixin(module.exports);

module.exports.parse = function(sam){

    var lines=sam.split('\n'); 
    var result = [];
	var obj;
    for(var i=0;i<lines.length;i++){
      obj = this.parseLine(lines[i]);
      result.push(obj);
    }
    return result; //JavaScript object
  };

module.exports.parseLine =  function(samLine){
    var currentLine = samLine.split('\t');
    var container = this;
    var sequence = currentLine[9] ;
    var obj = {
      qname : currentLine[0] ,
      flags : parseInt(currentLine[1],10),
      rname : currentLine[2] ,
      pos   : parseInt(currentLine[3],10) ,
      mapq  : parseInt(currentLine[4],10) ,
      cigar : currentLine[5] ,
      rnext : currentLine[6] ,
      pnext : parseInt(currentLine[7],10),
      tlen  : parseInt(currentLine[8],10) ,
      seq   : sequence,
      qual  : currentLine[10] ,
      duplicates : 1,
      fullId: function(){
        //var id =container.opt.target; 
        var id =  this.qname;
        if(this.firstInPair()){
          id += '/1';
        }
        if(this.secondInPair()){
          id += '/2';
        }
        return id;
      },
      len   : 100,  

    /*     1 @isPaired  = (@flag & 0x0001) > 0
           2 @isMapped             = @flag & 0x0002 > 0
           4 @queryUnmapped        = @flag & 0x0004 > 0
           8 @mateUnmapped         = @flag & 0x0008 > 0
          16 @query_strand          = !(@flag & 0x0010 > 0)
          32 @mate_strand           = !(@flag & 0x0020 > 0)
          64 @firstInPair         = @flag & 0x0040 > 0
         128 @secondInPair        = @flag & 0x0080 > 0
         256 @primary               = !(@flag & 0x0100 > 0)
         512 @failedQuality        = @flag & 0x0200 > 0
        1024 @isDuplicate          = @flag & 0x0400 > 0*/ 
      hasFlag : function (f){ 
        f = parseInt(f);
        return (this.flags & f) === f ;
      },
      forward:   function(){return this.hasFlag(16);},
      isPaired: function(){return this.hasFlag(1);},
      isMapped: function(){return this.hasFlag(2);},
      queryUnmapped: function(){return this.hasFlag(4);}, 
      mateUnmapped: function(){return this.hasFlag(8);}, 
      reverse:   function(){return !this.hasFlag(16);},
      mateForward:   function(){return this.hasFlag(32);},
      mateReverse:   function(){return !this.hasFlag(32);},
      firstInPair: function(){return this.hasFlag(64);},
      secondInPair: function(){return this.hasFlag(128);}, 
      primary: function(){return !this.hasFlag(256);},
      failedQuality: function(){return this.hasFlag(512);},
      isDuplicate: function(){return this.hasFlag(1024);},
      /* displayBases: false,
    displayOrientation: false, 
    display_cigar:false,
    display_mate_missing: false*/
      
      _displayOrientation: function(newDiv){
        if(container.opt.displayOrientation){
          if(this.forward()){
            newDiv.classList.add('bam_forward');
          }else{
            newDiv.classList.add('bam_reverse');
          }
        }
      }, 

      _displayMates: function(newDiv){
        if(container.opt.displayMates){
          if(this.firstInPair()){
            newDiv.classList.add('bam_first');
          }
          if(this.secondInPair()){
            newDiv.classList.add('bam_second');
          }
          if(this.mateUnmapped){
            newDiv.classList.add('bam_mate_missing');
          }
        }
      },

      _drawSeq: function(newDiv){
        
        var seqLen = this.parsedSeq.length;
        var nextInsertion = -1;
        var indexInsertion = 0;
        if(this.insertions.size > 0){
          nextInsertion = this.insertions[0];
        }
       
        for (var i = 0; i < seqLen; i++) {
          var displayBase = this.parsedSeq[i];
          var currentBaseSpan = document.createElement('div');
          newDiv.appendChild(currentBaseSpan);
          currentBaseSpan.className = 'bam_base_' + displayBase;
          currentBaseSpan.classList.add = 'bam_base';
          currentBaseSpan.style.width = container.opt.baseWidth + 'px';
          currentBaseSpan.style.cssFloat = 'left';
		  var textNode = currentBaseSpan.ownerDocument.createTextNode(displayBase);
          currentBaseSpan.appendChild(textNode);
          var lastDiv = currentBaseSpan;
          currentBaseSpan.title = this.pos + i;

          if(nextInsertion === i ){
            lastDiv.classList.add('bam_base_I');
            nextInsertion = this.insertions[indexInsertion++];
          }

        }

      },

      _parseCigar: function(){
        var cigars = this.cigar.replace(/([SIXMND])/g, ':$1,');
        var cigarArray = cigars.split(',');
        var cigarIndex = 0;
        this.len = 0;
        var cigarEnd  = -1;
        var cig ;
        var key;
        var length;
        var parsedSeq = '';
        var insertions = [];
        var changed = true;
		
        for ( var i = 0; i < this.seq.length; i++ ){
          if(i > cigarEnd || changed === true){
            cig = cigarArray[cigarIndex].split(':'); 
            key = cig[1];
            length = parseInt(cig[0]);
            cigarEnd = i + length;
            cigarIndex +=1;
            changed = false;
          }

          if(key === 'M' || key === 'X' || key === '='){
            parsedSeq += this.seq[i];
            this.len += 1;
          }else if(key === 'I'){
            insertions.push(i);
            changed = true;
          }else if(key === 'D' || key === 'N'){
            for (var j  = 0; j < length; j ++ ) {
              parsedSeq += '*';           
           }
            changed = true;
            i--;
          }
        }
        this.len = parsedSeq.length;
        this.parsedSeq = parsedSeq;
        this.insertions = insertions;
      },



      buildDiv: function(){
        var newDiv = document.createElement('div');
        newDiv.style.height = (parseInt( container.opt.baseWidth) + 3)  + 'px';
        newDiv.style.fontSize =  container.opt.baseWidth + 'px';
        newDiv.classList.add('bam_tag');
        newDiv.style.position = 'absolute';
        var nPos = ( this.pos - 1) * container.opt.baseWidth;
        newDiv.style.left = nPos + 'px';
        
        newDiv.id = this.fullId();
        
        this._displayOrientation(newDiv);
        this._displayMates(newDiv);
       
        //TODO: make a function that displays or not depending a 
		//preference to display duplicates
        if(this.isDuplicate()){
          newDiv.classList.add('bam_duplicate');
        }
        this._parseCigar();

        if(container.opt.displayBases){
          this._drawSeq(newDiv);
        }
        
        newDiv.style.width = container.opt.baseWidth * this.len + 'px'; 
        this.div = newDiv;
        return newDiv;
        }};



        for(var j=12;j < currentLine.length;j++){
          var tag = samLine[j].split(':');
          if (tag[1] === 'i'){
           obj[tag[0]] = parseInt(tag[2]);
         }else if (tag[1] === 'f'){
          obj[tag[0]] = parseFloat(tag[2]);
        }
        else{ 
          obj[tag[0]] = tag[2];
        }
      }
      return obj;

    };
 
