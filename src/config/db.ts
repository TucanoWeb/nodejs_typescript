import dotenv from "dotenv";
import { ConnectionAttributes } from "oracledb";
dotenv.config();

export const dbConfig: ConnectionAttributes = {
  user: process.env.ORACLE_DB_USER,
  password: process.env.ORACLE_DB_PASSWORD,
  connectionString: process.env.ORACLE_CONN_STR,
}