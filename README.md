# biojs-io-sam

[![Build Status](https://secure.travis-ci.org/homonecloco/biojs-io-sam.png?branch=master)](http://travis-ci.org/homonecloco/biojs-io-sam)
[![NPM version](https://badge-me.herokuapp.com/api/npm/biojs-io-sam.png)](http://badges.enytc.com/for/npm/biojs-io-sam) 

> SAM format parser, with the hability to retrive regions from  a ws

## Getting Started
Install the module with: `npm install biojs-io-sam`

```javascript
var biojsiosam = require('biojs-io-sam');
biojsiosam.parse_sam(stringWithSamFile); 
```

## Documentation

#### .parse_sam(stringWithSamFile)

**Parameter**: `stringWithSamFile`
**Type**: `String`
**Example**: `test\_1	0	chr\_2	225	1	70M	*	0	0	TAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAAC	IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII	AS:i:0	XS:i:0	XN:i:0	XM:i:0	XO:i:0	XG:i:0	NM:i:0	MD:Z:70	YT:Z:UU
test\_2	0	chr\_2	73	1	70M	*	0	0	CCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTAACCCTA	IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII	AS:i:0	XS:i:0	XN:i:0	XM:i:0	XO:i:0	XG:i:0	NM:i:0	MD:Z:70	YT:Z:UU`

This methods returns an array of string lines, wach one with the properties. 


## Contributing

Please submit all issues and pull requests to the [homonecloco/biojs-io-sam](http://github.com/homonecloco/biojs-io-sam) repository!

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/homonecloco/biojs-io-sam/issues).


## TODO
Write the documentation of all the methods to query the flags and so on. 

## License 


This software is licensed under the Apache 2 license, quoted below.

Copyright (c) 2014, Ricardo H. Ramirez-Gonzalez

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
