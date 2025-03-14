"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAllData = readAllData;
exports.writeData = writeData;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const dirname = __dirname;
const DATA_FILE = './data.json';
function readAllData() {
    try {
        const allData = fs_1.default.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(allData);
    }
    catch (err) {
        console.error("Error reading data:", err);
        return null;
    }
}
function writeData(data) {
    try {
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (err) {
        console.log("error writing the data:", err);
    }
}
