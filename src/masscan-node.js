const EventEmitter = require('events');
const child_process = require('child_process');
const fs = require("fs");


class Masscan extends EventEmitter {
    
    constructor(masscan_path = "/usr/bin/masscan") {
        super();
        this.masscan_path = masscan_path;
    }

    /**
     * Starts the masscan process
     * @param {String} range Example for entire internet: 0.0.0.0/0
     * @param {String} ports Example for all ports: 0-65535. For port 80, and ports from 8000 to 8100 : 80,8000-8100
     * @param {int} max_rate Maximum packet per second
     * @param {String} exclude_file The file containing the IP ranges to exclude from the scan. This one is recommended for scanning the entire internet: https://github.com/robertdavidgraham/masscan/blob/master/data/exclude.conf
     */
    start(range, ports, max_rate=100, exclude_file=null) {
        let args = `${range} -p${ports} --max-rate ${max_rate} ${exclude_file ? `--excludefile ${exclude_file}` : "--exclude 255.255.255.255"}`;
        console.log(`Start scan with args : ${args}`);
        this.process = child_process.execFile(this.masscan_path, args.split(" "), {maxBuffer: 1024*1024*1024});
        
        this.process.stdout.on("data", (chunk) => {
            if (chunk.startsWith("Discovered open port")) {
                let split = chunk.split(" ").filter((v) => v !== '');
                let l = split.length;
                let ip = split[l-2];
                let port = split[l-4].split("/")[0];
                this.emit("found", ip, port);
            }
        })

        this.process.stderr.on("data", (chunk) => {
            if (chunk.startsWith("rate:")) {
                this.last_output = chunk;
                let split = chunk.replace(/\s+/g,"").split(",");
                this.rate = parseFloat(split[0].slice(5).split("-")[0]);
                this.percentage = parseFloat(split[1].split("%")[0]);
                this.remaining = split[2].replace("remaining", "");
                this.found = parseFloat(split[3].split("=")[1]);
            }
        });

        this.process.once("exit", (err) => {
            if (err==1) {
                this.emit("error", this.last_output ? this.last_output : "Masscan proccess exited with error code 1, try with sudo.");
            } else if (err==0) {
                this.emit("finished");
            } else {
                console.log("Encountered unespected exit code : "+err+"\nLast masscan output :\n\t"+this.last_output);
            }
        });
    }
}

module.exports = {
    Masscan: Masscan
}