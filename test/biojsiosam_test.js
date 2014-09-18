/*
 * biojs-io-sam
 * https://github.com/homonecloco/biojs-io-sam
 *
 * Copyright (c) 2014 Ricardo H. Ramirez-Gonzalez
 * Licensed under the Apache 2 license.
 */

var chai = require('chai');
chai.expect();
chai.should();

var biojsiosam = require('../lib/biojsiosam.js');

describe('biojs-io-sam module', function(){
  describe('#hello()', function(){
    it('should return a hello', function(){
      biojsiosam.hello('biojs').should.equal("hello biojs");
    });
  });
  describe('#parse_sam_line',function(){
  	it('should parse the sam line', function(){
  		sam_line = biojsiosam.parse_sam_line("test_1	0	chr_1	225	1	70M	*	0	0	TAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAAC	IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII	AS:i:0	XS:i:0	XN:i:0	XM:i:0	XO:i:0	XG:i:0	NM:i:0	YT:Z:UU");
  		sam_line.qname.should.equal("test_1");
  		sam_line.flags.should.equal(0);
  		sam_line.rname.should.equal("chr_1");
  		sam_line.pos.should.equal(225);
  		sam_line.mapq.should.equal(1);
  		sam_line.cigar.should.equal("70M");
  		sam_line.rnext.should.equal("*");
  		sam_line.pnext.should.equal(0);
  		sam_line.tlen.should.equal(0);
  		sam_line.seq.should.equal("TAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAAC");
  		sam_line.qual.should.equal("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
  		sam_line.full_id().should.equal("test_1")
  		//console.log(sam_line.full_id());
  	});
  });
});
