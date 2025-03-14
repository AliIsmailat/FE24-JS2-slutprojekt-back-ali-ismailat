import {Tasks, taskStatus, Employee} from "./types"
import{readAllData, writeData} from './data'


import express, { Request, Response } from "express";
import fs, { write } from "fs";
import path from "path";

const app = express();
const dirname = __dirname;






export function getTasksByStatus(status: taskStatus): Tasks[]{
const data = readAllData();
if(!data){
    console.log("Data failed to load.");
    return[];
}    
return data.assignments.filter((task: Tasks) => task.status === status );
}

export function getTaskById(taskId: number): Tasks| undefined{
const data = readAllData();
return data?.assignments.find(task => task.id === taskId);
}

export function getAllTasks(): Tasks[]{
    const data = readAllData();
    if (!data){
        console.log("Data has failed to load.");
        return[];
        
    }

    return data.assignments;
}

export function getEmployeeByName(name:string): Employee | undefined{
    const data = readAllData();
    return data?.employees.find(emp => emp.name.toLowerCase() === name.toLowerCase());
}

export function addTask(newTask: Tasks) {
    const data = readAllData();
    if (!data) {
        console.log("The data has failed to load");
        return;
    }


    let newId = generateAssignmentId();



    while (data.assignments.some(task => task.id === newId)) {
        newId = generateAssignmentId(); 
    }


    const timestamp = generateTimeStamp();

    const taskWithId: Tasks = { ...newTask, id: newId, timestamp };

    data.assignments.push(taskWithId);

    writeData(data);
    console.log(`Task ${taskWithId.title} with ID ${taskWithId.id} successfully added!`);
}

const dataFilePath = path.join(__dirname, "../data.json");

export function removeTask(taskId: number): boolean {
    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));

    const taskIndex = data.assignments.findIndex((t: any) => t.id === taskId);

    if (taskIndex === -1) {
        return false; 
    }

    data.assignments.splice(taskIndex, 1);

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8"); 

    return true;
}



export function getEmployees(): Employee[]{
    const data = readAllData();
    if(!data){
        console.log("Data has failed to load");
        return[];
    }
    return data.employees;
}




//kvar är assigntask



export function assignTask(taskId: number, employeeId: number) {
    const data = readAllData();
    if (!data) {
      console.error("Failed to load data.");
      return;
    }
  
    const task = data.assignments.find(task => task.id === taskId);
    const employee = data.employees.find(emp => emp.id == employeeId)
    if(task?.category != employee?.role) return false;
    if (task) {

      for (let index = 0; index < data.assignments.length; index++) {
        const element = data.assignments[index];
        if(element.id == task.id){
            element.assigned = employeeId;
            element.status = taskStatus.IN_PROGRESS;
            console.log("found it");
            
            break;
        }
      }
      writeData(data);
      return true;
      console.log(`Task ${taskId} assigned to employee ${employeeId}`);
    } else {
        return false;
    }
  }


   

export function addEmployee(newEmployee: Employee){
    const data = readAllData();
    if(!data){
        console.log("The data has failed to load");
        return;
        
    }

    let newId = generateId();


    while(data.employees.some(emp => emp.id === newId)){
        newId = generateId();
    }


    const employeeWithId:Employee = {...newEmployee, id:newId};

    data.employees.push(employeeWithId);

    writeData(data)
    console.log(`Employee ${employeeWithId.id} sucessfully added!`);
    
}




export function generateId(): number{
    const id = Math.floor(10000 + Math.random()*90000);
    return id;
}


export function generateAssignmentId(): number{
    const id = Math.floor(1000000000 + Math.random() * 9000000000);
    return id;
}



export function generateTimeStamp(): string{
    return new Date().toISOString();
}
