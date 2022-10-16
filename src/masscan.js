const child_process = require('child_process');
const { TypedEmitter } = require("tiny-typed-emitter");

/**
 * @extends {TypedEmitter<{
     'found': (ip: String, port: number) => void
     'error': (message: string) => void
     'complete': () => void
   }>}
 */
class Masscan extends TypedEmitter {
    
    /**
     * 
     * @param { String } masscan_path Path to the masscan executable, default is /usr/bin/masscan
     */
    constructor(masscan_path = "/usr/bin/masscan") {
        super();
        this.masscan_path = masscan_path;
    }

    /**
     * Starts the masscan process
     * @param {String} range range: CIDR ip range. Example for entire internet: 0.0.0.0/0
     * @param {String} ports ports: Example for all ports: 0-65535. For port 80, and ports from 8000 to 8100 : 80,8000-8100
     * @param {int} max_rate max_rate: Maximum packet per second, defaults to 100
     * @param {String} exclude_file exclude_file: The file containing the IP ranges to exclude from the scan. This one is recommended for scanning the entire internet: https://github.com/robertdavidgraham/masscan/blob/master/data/exclude.conf
     * @default
     */
    start(range, ports, max_rate=100, exclude_file=null) {
        let args = `${range} -p${ports} --max-rate ${max_rate ? max_rate : 100} ${exclude_file ? `--excludefile ${exclude_file}` : "--exclude 255.255.255.255"}`;
        console.info(`[masscan] Starting scan with args : ${args}`);
        /**
         * @type { child_process.ChildProcess } The masscan child process
         * @private
         */
        this._process = child_process.execFile(this.masscan_path, args.split(" "), {maxBuffer: 1024*1024*1024});
        
        this._process.stdout.on("data", (chunk) => {
            if (chunk.startsWith("Discovered open port")) {
                let split = chunk.split(" ").filter((v) => v !== '');
                let l = split.length;
                let ip = split[l-2];
                let port = parseInt(split[l-4].split("/")[0]);
                this.emit('found', ip, port);
            }
        })

        this._process.stderr.on("data", (chunk) => {
            if (chunk.startsWith("rate:")) {
                /**
                 * @type { String } The last outputed message of masscan process
                 * @readonly
                 */
                this.last_output = chunk;
                let split = chunk.replace(/\s+/g,"").split(",");
                /**
                 * @type { number } The masscan packet send rate in kpps
                 * @readonly
                 */
                this.rate = parseFloat(split[0].slice(5).split("-")[0]);
                /**
                 * @type { number } The scanning process percentage
                 * @readonly
                 */
                this.percentage = parseFloat(split[1].split("%")[0]);
                /**
                 * @type { String } The time remaining, format: HH:MM:SS 
                 * @readonly
                 */
                this.remaining = split[2].replace("remaining", "");
                /**
                 * @type { number } The total count of found IPs
                 * @readonly
                 */
                this.found = parseInt(split[3].split("=")[1]);
            }
        });

        this._process.once("exit", (err) => {
            if (err==1) {
                this.emit('error', this.last_output ? this.last_output : "Masscan proccess exited with error code 1, try with sudo.");
            } else if (err==0) {
                this.emit('complete');
            } else {
                console.log("Encountered unexpected exit code : "+err+"\nLast masscan output :\n\t"+this.last_output);
            }
        });
    }
}

module.exports = {
    Masscan: Masscan
}