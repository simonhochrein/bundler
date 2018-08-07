(function(files, entry) {
    window.global = window;
    global.process = {env: {NODE_ENV:"development"}, cwd: function(){return '/'}};
    window.cache = {};
    var exportGetter = function() {
        return this;
    }
    var require = function(file, name) {
        var module = {exports: {}};
        if(cache[files[file][1][name]]) {
            return cache[files[file][1][name]].exports;
        }else {
            var newfile = files[file][1][name];
            if(files[newfile]) {
                cache[newfile] = {exports: {}}
                files[newfile][0](require.bind(null, newfile), cache[newfile].exports, cache[newfile]);
        
                if(cache[newfile].exports && cache[newfile].exports.hasOwnProperty && !cache[newfile].exports.hasOwnProperty("default") && Object.isExtensible(cache[newfile].exports)) {
                    Object.defineProperty(cache[newfile].exports, "default", {get:exportGetter})
                }

                return cache[newfile].exports;
            } else {
                throw new Error("Cannot find module "+name+" from "+file);
            }
        }
    }
    files[entry][0](require.bind(null, entry), {}, {});
})({
"test/test2.js": [function(require, exports, module) {
console.log(require('body-parser'));
}, {"body-parser":null}],

}, "test/test2.js")
//@ sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvdGVzdDIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEiLCJmaWxlIjoidGVzdDIuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc29sZS5sb2cocmVxdWlyZSgnYm9keS1wYXJzZXInKSk7Il19