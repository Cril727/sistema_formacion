import { Context } from "../dependencies/dependencies.ts";
import { InstructorProfesion } from "../model/instructorProfesionModel.ts";

export const getInstructorProfesion = async (ctx:Context)=>{
    const {response} = ctx;

    try {
        const objInstructorProfesion = new InstructorProfesion();
        const ListaInstructorProfesion = await objInstructorProfesion.listarInstructorProfesion()

        if(!ListaInstructorProfesion || ListaInstructorProfesion.length === 0){
            response.status = 400;
            response.body = {
                success:false,
                message: "No se han encontrado datos"
            }
            return;
        }

        response.status = 200;
        response.body = {
            success:true,
            data:ListaInstructorProfesion
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
                message:"Error interno del servidor",
                error:String(error)
            }
        }
    }
}