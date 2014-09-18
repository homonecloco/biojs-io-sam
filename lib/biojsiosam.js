/*
 * biojs-io-sam
 * https://github.com/homonecloco/biojs-io-sam
 *
 * Copyright (c) 2014 Ricardo H. Ramirez-Gonzalez
 * Licensed under the Apache 2 license.
 */

/**
@class biojsiosam
 */

/**
 * Private Methods
 */

/*
 * Public Methods
 */

/**
 * Method responsible to say Hello
 *
 * @example
 *
 *     biojsiosam.hello('biojs');
 *
 * @method hello
 * @param {String} name Name of a person
 * @return {String} Returns hello name
 */

module.exports.hello = function (name) {
  return 'hello ' + name;
};

module.exports.parse_sam = function(sam){

    var lines=sam.split("\n"); 
    var result = [];
    for(var i=0;i<lines.length;i++){
      obj = this.parse_sam_line(lines[i]);
      result.push(obj);
    }
    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
  }

module.exports.parse_sam_line =  function(sam_line){
    var currentline = sam_line.split("\t");

    var cigar = currentline[5] 
    var container = this;
    //console.log("Parsing flagg:" +  parseInt(currentline[1],10));

    var sequence = currentline[9] ;
    //console.log("Sequence: " + sequence);
    //console.log(sam_line);
    var obj = {
      qname : currentline[0] ,
      flags : parseInt(currentline[1],10),
      rname : currentline[2] ,
      pos   : parseInt(currentline[3],10) ,
      mapq  : parseInt(currentline[4],10) ,
      cigar : currentline[5] ,
      rnext : currentline[6] ,
      pnext : parseInt(currentline[7],10),
      tlen  : parseInt(currentline[8],10) ,
      seq   : sequence,
      qual  : currentline[10] ,
      duplicates : 1,
      full_id: function(){
        //var id =container.opt.target; 
        var id =  this.qname;
        if(this.first_in_pair()){
          id += "/1";
        }
        if(this.second_in_pair()){
          id += "/2"
        }
        return id;
      },
      len   : 100,  

    /*     1 @is_paired  = (@flag & 0x0001) > 0
           2 @is_mapped             = @flag & 0x0002 > 0
           4 @query_unmapped        = @flag & 0x0004 > 0
           8 @mate_unmapped         = @flag & 0x0008 > 0
          16 @query_strand          = !(@flag & 0x0010 > 0)
          32 @mate_strand           = !(@flag & 0x0020 > 0)
          64 @first_in_pair         = @flag & 0x0040 > 0
         128 @second_in_pair        = @flag & 0x0080 > 0
         256 @primary               = !(@flag & 0x0100 > 0)
         512 @failed_quality        = @flag & 0x0200 > 0
        1024 @is_duplicate          = @flag & 0x0400 > 0*/ 
      has_flag : function (f){ 
        f = parseInt(f);
        return (this.flags & f) == f ;
      },
      forward:   function(){return this.has_flag(16);},
      is_paired: function(){return this.has_flag(1);},
      is_mapped: function(){return this.has_flag(2);},
      query_unmapped: function(){return this.has_flag(4);}, 
      mate_unmapped: function(){return this.has_flag(8);}, 
      forward:   function(){return this.has_flag(16);},
      reverse:   function(){return !this.has_flag(16);},
      mate_forward:   function(){return this.has_flag(32);},
      mate_reverse:   function(){return !this.has_flag(32);},
      first_in_pair: function(){return this.has_flag(64);},
      second_in_pair: function(){return this.has_flag(128);}, 
      primary: function(){return !this.has_flag(256);},
      failed_quality: function(){return this.has_flag(512);},
      is_duplicate: function(){return this.has_flag(1024);},
      /* display_bases: false,
    display_orientation: false, 
    display_cigar:false,
    display_mate_missing: false*/
      
      _display_orientation: function(new_div){
        if(container.opt.display_orientation){
          if(this.forward()){
            new_div.classList.add("bam_forward");
          }else{
            new_div.classList.add("bam_reverse");
          }
        }
      }, 

      _display_mates: function(new_div){
        if(container.opt.display_mates){
          if(this.first_in_pair()){
            new_div.classList.add("bam_first");
          }
          if(this.second_in_pair()){
            new_div.classList.add("bam_second");
          }
          if(this.mate_unmapped){
            new_div.classList.add("bam_mate_missing");
          }
        }
      },

      _draw_seq: function(new_div){
        
        var seq_len = this.parsed_seq.length;
        var next_insertion = -1;
        var index_insertion = 0;
        if(this.insertions.size > 0){
          next_insertion = this.insertions[0];
        }
       
        for (var i = 0; i < seq_len; i++) {
          display_base = this.parsed_seq[i];
          var current_base_span = document.createElement("div");
          new_div.appendChild(current_base_span);
          current_base_span.className = "bam_base_" + display_base;
          current_base_span.classList.add = "bam_base";
          current_base_span.style.width = container.opt.base_width + "px";
          current_base_span.style.cssFloat = "left";
          current_base_span.appendChild(current_base_span.ownerDocument.createTextNode(display_base));
          last_div = current_base_span;
          current_base_span.title = this.pos + i;

          if(next_insertion == i ){
            last_div.classList.add("bam_base_I");
            next_insertion = this.insertions[index_insertion++];
          }

        };

      },

      _parse_cigar: function(){
        var cigars = this.cigar.replace(/([SIXMND])/g, ":$1,");
        var cigars_array = cigars.split(',');
        var cig_index = 0;
        this.len = 0
        var cig_end  = -1;
        var cig ;
        var key;
        var length;
        var cig_index = 0;
        var last_div;
        var parsed_seq = "";
        var insertions = [];
        changed = true;

        for ( var i = 0; i < this.seq.length; i++ ){
          if(i > cig_end || changed == true){
            cig = cigars_array[cig_index].split(":"); 
            key = cig[1];
            length = parseInt(cig[0]);
            cig_end = i + length;
            cig_index +=1
            changed = false;
          }

          if(key == "M" || key == "X" || key == "="){
            parsed_seq += this.seq[i];
            this.len += 1;
          }else if(key == "I"){
            insertions.push(i);
            changed = true;
          }else if(key == "D" || key == "N"){
            for (var j  = 0; j < length; j ++ ) {
              parsed_seq += "*";
              display_base =  "*";
             
            }
            changed = true;
                  //cig_index += 1;
            i--;
          }
        }
        this.len = parsed_seq.length;
        this.parsed_seq = parsed_seq;
        this.insertions = insertions;
      },



      build_div: function(){
        var new_div = document.createElement("div");
        new_div.style.height = (parseInt( container.opt.base_width) + 3)  + "px";
        new_div.style.fontSize =  container.opt.base_width + "px";
        new_div.classList.add("bam_tag");
        new_div.style.position = "absolute";
        n_pos = ( this.pos - 1) * container.opt.base_width;
        new_div.style.left = n_pos + "px";
        
        new_div.id = this.full_id();
        
        this._display_orientation(new_div);
        this._display_mates(new_div);
       
        //TODO: make a function that displays or not depending a preference to display duplicates
        if(this.is_duplicate()){
          new_div.classList.add("bam_duplicate");
        }
        this._parse_cigar();

        if(container.opt.display_bases){
          this._draw_seq(new_div);
        }
        
        new_div.style.width = container.opt.base_width * this.len + "px"; 
        this.div = new_div;
 //             console.log("new_div len:" + len);

        return new_div;
        }};



        for(var j=12;j < currentline.length;j++){
          var tag = sam_line[j].split(":")

          if (tag[1] == "i"){
           obj[tag[0]] = parseInt(tag[2]);
         }else if (tag[1 == "f"]){
          obj[tag[0]] = parseFloat(tag[2]);
        }
        else{ 
          obj[tag[0]] = tag[2];
        }
      }
      return obj;
    }
 