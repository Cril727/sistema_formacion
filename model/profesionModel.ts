import { Conexion } from "./Conexion.ts";

interface ProfesionData {
    idprofesion : number | null,
    nombre_profesion : string
}

export class Profesion{

    public _objProfesion : ProfesionData | null;

    constructor(ObjProfesion: ProfesionData | null = null){
        this._objProfesion = ObjProfesion;
    }

    public async listarProfesiones ():Promise<ProfesionData[]>{
        try {
            const result = await Conexion.execute("SELECT * FROM profesion");

            if(!result || !result.rows){
                console.warn("No ha devuelto datos la consulta");
                return [];
            }

            return result.rows as ProfesionData[];

        } catch (error) {
            console.log("Error al obtener las profesiones" + error);
            throw new Error("Error al obtener las profesiones")
        }
    }
}