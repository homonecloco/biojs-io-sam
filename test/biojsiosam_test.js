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
  describe('#parseSamLine',function(){
  	it('should parse the sam line', function(){
  		samLine = biojsiosam.parseLine("test_1	0	chr_1	225	1	70M	*	0	0	TAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAAC	IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII	AS:i:0	XS:i:0	XN:i:0	XM:i:0	XO:i:0	XG:i:0	NM:i:0	YT:Z:UU");
  		samLine.qname.should.equal("test_1");
  		samLine.flags.should.equal(0);
  		samLine.rname.should.equal("chr_1");
  		samLine.pos.should.equal(225);
  		samLine.mapq.should.equal(1);
  		samLine.cigar.should.equal("70M");
  		samLine.rnext.should.equal("*");
  		samLine.pnext.should.equal(0);
  		samLine.tlen.should.equal(0);
  		samLine.seq.should.equal("TAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAAC");
  		samLine.qual.should.equal("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
  		samLine.fullId().should.equal("test_1")
  		//console.log(samLine.full_id());
  	});
  });
});
