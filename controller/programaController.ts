import { Context } from "../dependencies/dependencies.ts";
import { Programa } from "../model/programaModel.ts";

export const getProgramas = async (ctx:Context) => {
    const { response } = ctx;

    try {
        const objPrograma = new Programa();
        const ListaProgramas = await objPrograma.listarPrograma();

        if(!ListaProgramas || ListaProgramas.length === 0){
            response.status = 400;
            response.body = {
                success: false,
                message: "No hay datos por mostrar"
            }
        }
        
        response.status = 200;
        response.body = {
            success: true,
            programa: ListaProgramas
        }
        
    } catch (error) {
        if(error instanceof Error){
            response.status = 500;
            response.body = {
                success: false,
                message: "Error del servidor",
                error: error.message
            }
        }else{
            response.status = 500;
            response.body = {
                success: false,
                message: "Error interno del servidor",
                error: String(error)
            }
        }
    }
}

export const postPrograma = async (ctx:Context) =>{
    
}