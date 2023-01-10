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
const { Masscan } = require('./masscan');

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

### Note:
node-masscan is using ChildProcess stdout to get masscan live outputs, but because masscan can produce lots of output (depending on your scan parameters), the default stdout 200KB buffer isn't enough and had to be pumped up to 1Gb to avoid the child process being killed. If you get an *'Encountered unexpected exit code'* error, it should be because you exceeded this max buffer size (very unlikely). I used this code for a copenheimer like project and it hasn't failed me.



