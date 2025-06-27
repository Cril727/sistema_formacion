import { Client } from "../dependencies/dependencies.ts";

export const Conexion = await new Client().connect({
    db:"sistema_formacion",
    hostname:"localhost",
    username:"root",
    password:""
})
