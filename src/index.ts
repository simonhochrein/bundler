import { isMaster } from "cluster";

if (isMaster) {
    require("./Master");
} else {
    require("./Bundler");
}