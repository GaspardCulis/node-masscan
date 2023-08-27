"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Masscan = void 0;
var child_process = __importStar(require("child_process"));
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
var Masscan = /** @class */ (function (_super) {
    __extends(Masscan, _super);
    /**
     *
     * @param { String } masscan_path Path to the masscan executable, default is /usr/bin/masscan
     */
    function Masscan(masscan_path) {
        if (masscan_path === void 0) { masscan_path = "/usr/bin/masscan"; }
        var _this = _super.call(this) || this;
        _this.masscan_path = masscan_path;
        return _this;
    }
    /**
     * Starts the masscan process
     * @param {String} range range: CIDR ip range. Example for entire internet: 0.0.0.0/0
     * @param {String} ports ports: Example for all ports: 0-65535. For port 80, and ports from 8000 to 8100 : 80,8000-8100
     * @param {number} max_rate max_rate: Maximum packet per second, defaults to 100
     * @param {String} exclude_file exclude_file: The file containing the IP ranges to exclude from the scan. This one is recommended for scanning the entire internet: https://github.com/robertdavidgraham/masscan/blob/master/data/exclude.conf
     * @default
     */
    Masscan.prototype.start = function (range, ports, max_rate, exclude_file) {
        var _this = this;
        var _a, _b;
        if (max_rate === void 0) { max_rate = 100; }
        if (exclude_file === void 0) { exclude_file = null; }
        var args = "".concat(range, " -p").concat(ports, " --max-rate ").concat(max_rate ? max_rate : 100, " ").concat(exclude_file
            ? "--excludefile ".concat(exclude_file)
            : "--exclude 255.255.255.255");
        console.info("[masscan] Starting scan with args : ".concat(args));
        /**
         * @type { child_process.ChildProcess } The masscan child process
         * @private
         */
        this._process = child_process.spawn(this.masscan_path, args.split(" "));
        (_a = this._process.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (_chunk) {
            var chunk = _chunk.toString();
            if (chunk.startsWith("Discovered open port")) {
                var split = chunk.split(" ").filter(function (v) { return v !== ""; });
                var l = split.length;
                var ip = split[l - 2];
                var port = parseInt(split[l - 4].split("/")[0]);
                _this.emit("found", ip, port);
            }
        });
        (_b = this._process.stderr) === null || _b === void 0 ? void 0 : _b.on("data", function (_chunk) {
            var chunk = _chunk.toString();
            if (chunk.startsWith("rate:")) {
                /**
                 * @type { String } The last outputed message of masscan process
                 * @readonly
                 */
                _this.last_output = chunk;
                var split = chunk.replace(/\s+/g, "").split(",");
                /**
                 * @type { number } The masscan packet send rate in kpps
                 * @readonly
                 */
                _this.rate = parseFloat(split[0].slice(5).split("-")[0]);
                /**
                 * @type { number } The scanning process percentage
                 * @readonly
                 */
                _this.percentage = parseFloat(split[1].split("%")[0]);
                /**
                 * @type { String } The time remaining, format: HH:MM:SS
                 * @readonly
                 */
                _this.remaining = split[2].replace("remaining", "");
                /**
                 * @type { number } The total count of found IPs
                 * @readonly
                 */
                _this.found = parseInt(split[3].split("=")[1]);
            }
        });
        this._process.once("close", function (err) {
            if (err == 1) {
                _this.emit("error", _this.last_output
                    ? _this.last_output
                    : "Masscan proccess exited with error code 1, try with sudo.");
            }
            else if (err == 0) {
                _this.emit("complete");
            }
            else {
                console.log("Encountered unexpected exit code : " +
                    err +
                    "\nLast masscan output :\n\t" +
                    _this.last_output);
            }
        });
    };
    return Masscan;
}(tiny_typed_emitter_1.TypedEmitter));
exports.Masscan = Masscan;
