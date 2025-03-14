import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();
const dirname = __dirname;

import {Data} from './types'



const DATA_FILE = './data.json'



export function readAllData(): Data | null {
    try {
      const allData = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(allData) as Data;
      


    } catch (err) {
      console.error("Error reading data:", err);
      return null;  
    }
  }


export function writeData(data: Data): void{
    try{
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    }catch (err){
        console.log("error writing the data:", err);
    }
}





