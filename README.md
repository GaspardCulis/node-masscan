node-masscan
====
A [masscan](https://github.com/robertdavidgraham/masscan) wrapper for NodeJS.

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


