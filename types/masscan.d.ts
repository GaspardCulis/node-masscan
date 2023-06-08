/**
 * @extends {TypedEmitter<{
     'found': (ip: String, port: number) => void
     'error': (message: string) => void
     'complete': () => void
   }>}
 */
export class Masscan extends TypedEmitter<{
    found: (ip: string, port: number) => void;
    error: (message: string) => void;
    complete: () => void;
}> {
    /**
     *
     * @param { String } masscan_path Path to the masscan executable, default is /usr/bin/masscan
     */
    constructor(masscan_path?: string);
    masscan_path: string;
    /**
     * Starts the masscan process
     * @param {String} range range: CIDR ip range. Example for entire internet: 0.0.0.0/0
     * @param {String} ports ports: Example for all ports: 0-65535. For port 80, and ports from 8000 to 8100 : 80,8000-8100
     * @param {number} max_rate max_rate: Maximum packet per second, defaults to 100
     * @param {String} exclude_file exclude_file: The file containing the IP ranges to exclude from the scan. This one is recommended for scanning the entire internet: https://github.com/robertdavidgraham/masscan/blob/master/data/exclude.conf
     * @default
     */
    start(range: string, ports: string, max_rate?: number, exclude_file?: string): void;
    /**
     * @type { child_process.ChildProcess } The masscan child process
     * @private
     */
    private _process;
    /**
     * @type { String } The last outputed message of masscan process
     * @readonly
     */
    readonly last_output: string;
    /**
     * @type { number } The masscan packet send rate in kpps
     * @readonly
     */
    readonly rate: number;
    /**
     * @type { number } The scanning process percentage
     * @readonly
     */
    readonly percentage: number;
    /**
     * @type { String } The time remaining, format: HH:MM:SS
     * @readonly
     */
    readonly remaining: string;
    /**
     * @type { number } The total count of found IPs
     * @readonly
     */
    readonly found: number;
}
import { TypedEmitter } from "tiny-typed-emitter";
//# sourceMappingURL=masscan.d.ts.map