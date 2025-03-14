import express, { Request, Response } from "express";
import { Employee, Tasks, taskStatus } from "./types";
import { 
    getTasksByStatus,
    getTaskById,
    getAllTasks,
    getEmployeeByName,
    addTask,
    removeTask,
    getEmployees,
    assignTask,
    addEmployee 
} from "./scrumboard";

import cors from 'cors';
import fs from "fs";
import path from "path";




const app = express();
app.use(cors());
app.use(express.json());

const dirname = __dirname;
const PORT = process.env.PORT || 3000;


const dataFilePath = path.join(dirname, "../data.json")


app.get("/api/assignments", (req: Request, res: Response) =>{
    fs.readFile(dataFilePath, "utf-8", (err, data) =>{
        if(err){
            res.status(500).send("error reading data");
            return;
        }

        const jsonData = JSON.parse(data);
        res.json(jsonData.assignments);
    });
});


app.get("/api/employees", (req: Request, res: Response) =>{
    fs.readFile(dataFilePath, "utf-8", (err, data)=>{
        if(err){
            res.status(500).send("error reading data");
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData.employees);
    })
})


app.get("/api/assignments/status/:status", (req: Request, res: Response) => {
    const status: taskStatus = req.params.status as taskStatus;
    const tasks = getTasksByStatus(status);
    res.json(tasks);
});


app.get("/api/assignments/:id", (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id);
    const task = getTaskById(taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send("Task not found");
    }
});

app.post("/api/assignments", (req: Request, res: Response) => {
    const newTask: Tasks = req.body;
    addTask(newTask);
    res.status(201).json(newTask);
});


app.delete("/api/assignments/:id", (req: Request, res: Response) => {
    fs.readFile(dataFilePath, "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading data");
            return;
        }

        let jsonData = JSON.parse(data);
        const taskId = parseInt(req.params.id);

        const taskIndex = jsonData.assignments.findIndex((t: Tasks) => t.id === taskId);

        if (taskIndex === -1) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        jsonData.assignments.splice(taskIndex, 1);

        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).send("Error writing data");
                return;
            }
            res.json({ message: "Task removed successfully" });
        });
    });
});


app.get("/api/employees", (req: Request, res: Response) => {
    const employees = getEmployees();
    res.json(employees);
});


app.post("/api/employees", (req: Request, res: Response) => {
    const newEmployee: Employee = req.body;
    addEmployee(newEmployee);
    res.status(201).json(newEmployee);
});

app.put("/api/assignments/:taskId/assign/:employeeId", (req: Request, res: Response) => {
    const taskId = parseInt(req.params.taskId);
    const employeeId = parseInt(req.params.employeeId);
    const status = assignTask(taskId, employeeId);
    if(status){
        res.status(204).send();


    }else{
        res.status(401).send();
    }
});


app.patch("/api/assignments/:id", (req: Request, res: Response) => {
    fs.readFile(dataFilePath, "utf-8", (err, data) => {
        if (err) {
            res.status(500).send("Error reading data");
            return;
        }
        
        let jsonData = JSON.parse(data);
        const taskId = parseInt(req.params.id);
        const newStatus: taskStatus = req.body.status; 
        
        const taskIndex = jsonData.assignments.findIndex((t: Tasks) => t.id === taskId);
        
        if (taskIndex === -1) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        
        jsonData.assignments[taskIndex].status = newStatus;
        
        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
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



export default app;