import { Conexion } from "./Conexion.ts";

interface AprendizData {
    idaprendiz:number | null;
    nombre:string,
    apellido:string,
    email:string,
    telefono:string
}


export class Aprendiz{
    public _objAprendiz : AprendizData | null;

    constructor(ObjAprendiz:AprendizData | null = null){
        this._objAprendiz = ObjAprendiz
    }

    public async listarAprendices():Promise<AprendizData[]>{
        
        try {
            const result = await Conexion.execute("SELECT * FROM aprendiz")

            if(!result || !result.rows){
                console.warn("La consulta no devuelve datos");
                return [];
            }

            return result.rows as AprendizData[];
        } catch (error) {
            console.error("Error al seleccionaer usuario"+error);
            throw new Error("No se pueden obtener los datos")
        }
    }



    public async agregarAprendiz(){
        
    }

}