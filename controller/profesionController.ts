import { Context,z,RouterContext } from "../dependencies/dependencies.ts";
import { Profesion } from "../model/profesionModel.ts";


export const getProfesion = async (ctx:Context)=>{

    const { response } = ctx;

    try {
        const objProfesion = new Profesion();
        const ListaProfesiones = await objProfesion.listarProfesiones();

        if(!ListaProfesiones || ListaProfesiones.length === 0){
            response.status = 400;
            response.body = {
                success:false,
                message:"No existen profesiones por mostrar"
            }
            return;
        }

        response.status = 200;
        response.body = {
            success:true,
            data:ListaProfesiones
        }

    } catch (error) {
        if(error instanceof Error){
            response.status = 400;
            response.body = {
                success:false,
                message:"Error interno del servidor",
                error:error.message
            }
        }else{
            response.status = 500;
            response.body = {
                success:false,
                message:"Error de servidor",
                error:String(error)
            }
        }
    }

}


export const postProfesion = async (ctx:Context)=>{
    
}


export const putProfesion = async (ctx:Context)=>{
    
}


export const deleteProfesion = async (ctx:RouterContext<"/profesion/:id">)=>{
    
}