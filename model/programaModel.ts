import { Conexion } from "./Conexion.ts";

interface ProgramaData{
    idprograma:number | null,
    nombre_programa: string
}

export class Programa{

    public _objPrograma : ProgramaData | null;

    constructor(Objprograma: ProgramaData | null = null){
        this._objPrograma = Objprograma
    }

    public async listarPrograma(): Promise<ProgramaData[]>{
        try {
            const result = await Conexion.execute("SELECT * FROM programa")

            if(!result || !result.rows){
                console.warn("La consulta no trae datos");

                return[];
            }

            return result.rows as ProgramaData[];

        } catch (error) {
            console.log("Error al traer los datos" + error);
            throw new Error("No se pueden traer los datos")
        }
    }
}