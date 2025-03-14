"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksByStatus = getTasksByStatus;
exports.getTaskById = getTaskById;
exports.getAllTasks = getAllTasks;
exports.getEmployeeByName = getEmployeeByName;
exports.addTask = addTask;
exports.removeTask = removeTask;
exports.getEmployees = getEmployees;
exports.assignTask = assignTask;
exports.addEmployee = addEmployee;
exports.generateId = generateId;
exports.generateAssignmentId = generateAssignmentId;
exports.generateTimeStamp = generateTimeStamp;
const types_1 = require("./types");
const data_1 = require("./data");
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const dirname = __dirname;
function getTasksByStatus(status) {
    const data = (0, data_1.readAllData)();
    if (!data) {
        console.log("Data failed to load.");
        return [];
    }
    return data.assignments.filter((task) => task.status === status);
}
function getTaskById(taskId) {
    const data = (0, data_1.readAllData)();
    return data === null || data === void 0 ? void 0 : data.assignments.find(task => task.id === taskId);
}
function getAllTasks() {
    const data = (0, data_1.readAllData)();
    if (!data) {
        console.log("Data has failed to load.");
        return [];
    }
    return data.assignments;
}
function getEmployeeByName(name) {
    const data = (0, data_1.readAllData)();
    return data === null || data === void 0 ? void 0 : data.employees.find(emp => emp.name.toLowerCase() === name.toLowerCase());
}
function addTask(newTask) {
    const data = (0, data_1.readAllData)();
    if (!data) {
        console.log("The data has failed to load");
        return;
    }
    let newId = generateAssignmentId();
    while (data.assignments.some(task => task.id === newId)) {
        newId = generateAssignmentId();
    }
    const timestamp = generateTimeStamp();
    const taskWithId = Object.assign(Object.assign({}, newTask), { id: newId, timestamp });
    data.assignments.push(taskWithId);
    (0, data_1.writeData)(data);
    console.log(`Task ${taskWithId.title} with ID ${taskWithId.id} successfully added!`);
}
const dataFilePath = path_1.default.join(__dirname, "../data.json");
function removeTask(taskId) {
    const data = JSON.parse(fs_1.default.readFileSync(dataFilePath, "utf-8"));
    const taskIndex = data.assignments.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
        return false;
    }
    data.assignments.splice(taskIndex, 1);
    fs_1.default.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
}
function getEmployees() {
    const data = (0, data_1.readAllData)();
    if (!data) {
        console.log("Data has failed to load");
        return [];
    }
    return data.employees;
}
//kvar är assigntask
function assignTask(taskId, employeeId) {
    const data = (0, data_1.readAllData)();
    if (!data) {
        console.error("Failed to load data.");
        return;
    }
    const task = data.assignments.find(task => task.id === taskId);
    const employee = data.employees.find(emp => emp.id == employeeId);
    if ((task === null || task === void 0 ? void 0 : task.category) != (employee === null || employee === void 0 ? void 0 : employee.role))
        return false;
    if (task) {
        for (let index = 0; index < data.assignments.length; index++) {
            const element = data.assignments[index];
            if (element.id == task.id) {
                element.assigned = employeeId;
                element.status = types_1.taskStatus.IN_PROGRESS;
                console.log("found it");
                break;
            }
        }
        (0, data_1.writeData)(data);
        return true;
        console.log(`Task ${taskId} assigned to employee ${employeeId}`);
    }
    else {
        return false;
    }
}
function addEmployee(newEmployee) {
    const data = (0, data_1.readAllData)();
    if (!data) {
        console.log("The data has failed to load");
        return;
    }
    let newId = generateId();
    while (data.employees.some(emp => emp.id === newId)) {
        newId = generateId();
    }
    const employeeWithId = Object.assign(Object.assign({}, newEmployee), { id: newId });
    data.employees.push(employeeWithId);
    (0, data_1.writeData)(data);
    console.log(`Employee ${employeeWithId.id} sucessfully added!`);
}
function generateId() {
    const id = Math.floor(10000 + Math.random() * 90000);
    return id;
}
function generateAssignmentId() {
    const id = Math.floor(1000000000 + Math.random() * 9000000000);
    return id;
}
function generateTimeStamp() {
    return new Date().toISOString();
}
