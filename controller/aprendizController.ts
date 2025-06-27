import { Context } from "../dependencies/dependencies.ts";
import { Aprendiz } from "../model/aprendizModel.ts";


export const getAprendiz = async (ctx:Context)=>{
    const {response} = ctx;

    try {

        const objUsuario = new Aprendiz();
        const ListaUsuarios = await objUsuario.listarAprendices()

        if(!ListaUsuarios || ListaUsuarios.length === 0){
            response.status = 400;
            response.body = {
                success:false,
                message:"No existen usuarios"
            };
            return;
        };
        

        response.status = 200;
        response.body = {
            success:true,
            data:ListaUsuarios
        }

    } catch (error) {
        if(error instanceof Error){
            response.status = 400;
            response.body = {
                success:false,
                message:"Error del servidor",
                error: error.message
            }
        }else{
            response.status = 500;
            response.body = {
                success:false,
                message:"Error interno del servidor",
                error: String(error)
            }
        }
    }
}

export const postUser = async (ctx:Context)=>{
    const {request, response} = ctx;

    try {
        
    } catch (error) {
        
    }
}