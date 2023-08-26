/// <reference types="node" />
import * as child_process from "child_process";
import { TypedEmitter } from "tiny-typed-emitter";
interface MasscanEvents {
    found: (ip: String, port: number) => void;
    error: (message: string) => void;
    complete: () => void;
}
export default class Masscan extends TypedEmitter<MasscanEvents> {
    masscan_path: string;
    _process: child_process.ChildProcess | undefined;
    last_output: string | undefined;
    rate: number | undefined;
    percentage: number | undefined;
    remaining: string | undefined;
    found: number | undefined;
    /**
     *
     * @param { String } masscan_path Path to the masscan executable, default is /usr/bin/masscan
     */
    constructor(masscan_path?: string);
    /**
     * Starts the masscan process
     * @param {String} range range: CIDR ip range. Example for entire internet: 0.0.0.0/0
     * @param {String} ports ports: Example for all ports: 0-65535. For port 80, and ports from 8000 to 8100 : 80,8000-8100
     * @param {number} max_rate max_rate: Maximum packet per second, defaults to 100
     * @param {String} exclude_file exclude_file: The file containing the IP ranges to exclude from the scan. This one is recommended for scanning the entire internet: https://github.com/robertdavidgraham/masscan/blob/master/data/exclude.conf
     * @default
     */
    start(range: string, ports: string, max_rate?: number, exclude_file?: string | null): void;
}
export {};
//# sourceMappingURL=masscan.d.ts.map