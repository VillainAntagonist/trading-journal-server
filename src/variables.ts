import {MongoClient} from "mongodb";

require("dotenv").config();
export const uri = process.env.DB_URI || 'mongodb://localhost:27017';
export const database = process.env.DB_NAME || '';
export const client = new MongoClient(uri);
