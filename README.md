node-masscan
====
A minimal [masscan](https://github.com/robertdavidgraham/masscan) wrapper for NodeJS.

Install
-------
```bash
npm i node-masscan
```

Features
----------------
* Live access to masscan found IPs
* Access to masscan percentage, total found, time left and packet rate.

Usage
-----

```javascript
const { Masscan } = require('node-masscan');

let masscan = new Masscan(masscan_path = '/usr/bin/masscan');

masscan.on('complete', () => console.log('Scan finished'));

masscan.on('error', (message) => {
    console.log(`Masscan error : ${message}`);
});

masscan.on('found', (ip, port) => {
    console.log(`Found ${ip}:${port}`);
    console.log(`Percentage : ${masscan.percentage}%`);
})

masscan.start('0.0.0.0/0', "0-65535", 100000, 'data/exclude.conf');
```

Notes
-----

For more complex projects use [masscan-node](https://github.com/dumbasPL/masscan-node) it has way more options (issue [#1](https://github.com/GaspardCulis/node-masscan/issues/1#issuecomment-1698230346)).
