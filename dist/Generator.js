"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystem = require("fs");
var Path = require("path");
var source_map_1 = require("source-map");
var Cryptology = require("crypto");
var Util_1 = require("./Util");
var Options_1 = require("./Options");
var header = "(function(files, entry) {\n    window.global = window;\n    global.process = {env: {NODE_ENV:\"development\"}, cwd: function(){return '/'}};\n    window.cache = {};\n    var exportGetter = function() {\n        return this;\n    }\n    var require = function(file, name) {\n        var module = {exports: {}};\n        if(cache[files[file][1][name]]) {\n            return cache[files[file][1][name]].exports;\n        }else {\n            var newfile = files[file][1][name];\n            if(files[newfile]) {\n                cache[newfile] = {exports: {}}\n                files[newfile][0](require.bind(null, newfile), cache[newfile].exports, cache[newfile]);\n        \n                if(cache[newfile].exports && cache[newfile].exports.hasOwnProperty && !cache[newfile].exports.hasOwnProperty(\"default\") && Object.isExtensible(cache[newfile].exports)) {\n                    Object.defineProperty(cache[newfile].exports, \"default\", {get:exportGetter})\n                }\n\n                return cache[newfile].exports;\n            } else {\n                throw new Error(\"Cannot find module \"+name+\" from \"+file);\n            }\n        }\n    }\n    files[entry][0](require.bind(null, entry), {}, {});\n})({\n";
var Generator = /** @class */ (function () {
    function Generator(AppInstance, Bundle) {
        this.files = [];
        this.currentLine = 30;
        this.bundle = Bundle;
        this.app = AppInstance;
        this._cacheBuster = Options_1.Options.Get("Bundler.CacheBuster");
    }
    Generator.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (Resolve) {
                        var name = Path.basename(_this.bundle, Path.extname(_this.bundle));
                        _this.map = new source_map_1.SourceMapGenerator({
                            file: name + ".bundle.js"
                        });
                        // if (!FileSystem.existsSync(".build")) {
                        //     FileSystem.mkdirSync(".build");
                        // }
                        Util_1.ensureDirectoryExistence(_this.app.outDir);
                        // FileSystem.mkdirSync(this.app.outDir);
                        for (var _i = 0, _a = FileSystem.readdirSync(_this.app.outDir); _i < _a.length; _i++) {
                            var key = _a[_i];
                            if (key.indexOf(name + ".") == 0) {
                                FileSystem.unlinkSync(Path.join(_this.app.outDir, key));
                            }
                        }
                        _this.fileStream = FileSystem.createWriteStream(_this.app.outDir + "/" + name + ".bundle.js");
                        _this.fileStream.write(header);
                        if (_this._cacheBuster) {
                            _this.hash = Cryptology.createHash("md5");
                            _this.hash.write(header);
                        }
                        _this.searchDependencies(_this.bundle);
                        _this.fileStream.on("finish", function () {
                            // console.log(this.hash.digest("hex"));
                            if (_this._cacheBuster) {
                                var hash = _this.hash.digest("hex");
                                FileSystem.renameSync(_this.app.outDir + "/" + name + ".bundle.js", _this.app.outDir + "/" + name + "." + hash + ".js");
                                Resolve([name + "." + hash + ".js", name]);
                            }
                            else {
                                Resolve();
                            }
                        });
                        _this.fileStream.write("\n}, \"" + _this.bundle + "\")\n");
                        _this.fileStream.write("//@ sourceMappingURL=data:application/json;charset=utf-8;base64," + Buffer.from(_this.map.toString()).toString("base64"));
                        _this.fileStream.end();
                    })];
            });
        });
    };
    Generator.prototype.searchDependencies = function (FilePath) {
        var _this = this;
        if (!this.app.files[FilePath]) {
            console.log(FilePath);
        }
        var lines = this.app.files[FilePath].contents.split("\n").length;
        if (!this.app.files[FilePath].sourceMap) {
            this.map.setSourceContent(FilePath, this.app.files[FilePath].contents);
            for (var i = 1; i < lines + 1; i++) {
                this.map.addMapping({
                    source: FilePath,
                    original: { line: i, column: 0 },
                    generated: { line: this.currentLine + i, column: 0 }
                });
            }
        }
        else {
            var consumer = new source_map_1.SourceMapConsumer(JSON.parse(this.app.files[FilePath].sourceMap));
            this.app.files[FilePath].source && this.map.setSourceContent(FilePath, this.app.files[FilePath].source);
            consumer.eachMapping(function (Mapping) {
                _this.map.addMapping({
                    source: FilePath,
                    original: { line: Mapping.originalLine, column: Mapping.originalColumn },
                    generated: { line: _this.currentLine + Mapping.generatedLine, column: Mapping.generatedColumn }
                });
            });
        }
        this.currentLine += lines + 2;
        var content = "\"" + FilePath + "\": [function(require, exports, module) {\n" + this.app.files[FilePath].contents + "\n}, " + JSON.stringify(this.app.files[FilePath].dependencies) + "],\n";
        this.fileStream.write(content);
        if (this._cacheBuster) {
            this.hash.write(content);
        }
        Object.values(this.app.files[FilePath].dependencies).forEach(function (Dependency) {
            if (!~_this.files.indexOf(Dependency)) {
                _this.files.push(Dependency);
                _this.searchDependencies(Dependency);
            }
        });
    };
    return Generator;
}());
exports.Generator = Generator;
