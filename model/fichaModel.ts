import { Conexion } from "./Conexion.ts";


interface FichaData {
    idficha: number | null;
    codigo: string,
    fecha_inicio_lectiva:string,
    fecha_fin_lectiva:string,
    fecha_fin_practica:string,
    programa_idprograma: number | null;
}



export class Ficha {
    public _objFicha: FichaData | null;

    constructor(objFicha: FichaData | null = null){
        this._objFicha = objFicha
    }

    
    public async listarFichas(): Promise<FichaData[]>{
        try {
            const result = await Conexion.execute("SELECT * FROM ficha")

            if (!result || !result.rows) {
                console.warn("La consulta no devuelve datos");
                return[];
            }

            return result.rows as FichaData[];
        } catch (error) {
            console.error("Error al seleccionar ficha" + error);
            throw new Error("No se pueden obtener los datos")
            
        }
    }
}