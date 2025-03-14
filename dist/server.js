"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scrumboard_1 = require("./scrumboard");
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const dirname = __dirname;
const PORT = process.env.PORT || 3000;
const dataFilePath = path_1.default.join(dirname, "../data.json");
app.get("/api/assignments", (req, res) => {
    fs_1.default.readFile(dataFilePath, "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("error reading data");
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData.assignments);
    });
});
app.get("/api/employees", (req, res) => {
    fs_1.default.readFile(dataFilePath, "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("error reading data");
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData.employees);
    });
});
app.get("/api/assignments/status/:status", (req, res) => {
    const status = req.params.status;
    const tasks = (0, scrumboard_1.getTasksByStatus)(status);
    res.json(tasks);
});
app.get("/api/assignments/:id", (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = (0, scrumboard_1.getTaskById)(taskId);
    if (task) {
        res.json(task);
    }
    else {
        res.status(404).send("Task not found");
    }
});
app.post("/api/assignments", (req, res) => {
    const newTask = req.body;
    (0, scrumboard_1.addTask)(newTask);
    res.status(201).json(newTask);
});
app.delete("/api/assignments/:id", (req, res) => {
    fs_1.default.readFile(dataFilePath, "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading data");
            return;
        }
        let jsonData = JSON.parse(data);
        const taskId = parseInt(req.params.id);
        const taskIndex = jsonData.assignments.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        jsonData.assignments.splice(taskIndex, 1);
        fs_1.default.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).send("Error writing data");
                return;
            }
            res.json({ message: "Task removed successfully" });
        });
    });
});
app.get("/api/employees", (req, res) => {
    const employees = (0, scrumboard_1.getEmployees)();
    res.json(employees);
});
app.post("/api/employees", (req, res) => {
    const newEmployee = req.body;
    (0, scrumboard_1.addEmployee)(newEmployee);
    res.status(201).json(newEmployee);
});
app.put("/api/assignments/:taskId/assign/:employeeId", (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const employeeId = parseInt(req.params.employeeId);
    const status = (0, scrumboard_1.assignTask)(taskId, employeeId);
    if (status) {
        res.status(204).send();
    }
    else {
        res.status(401).send();
    }
});
app.patch("/api/assignments/:id", (req, res) => {
    fs_1.default.readFile(dataFilePath, "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading data");
            return;
        }
        let jsonData = JSON.parse(data);
        const taskId = parseInt(req.params.id);
        const newStatus = req.body.status;
        const taskIndex = jsonData.assignments.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        jsonData.assignments[taskIndex].status = newStatus;
        fs_1.default.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).send("Error writing data");
                return;
            }
            res.json({ message: "Task updated successfully", task: jsonData.assignments[taskIndex] });
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
