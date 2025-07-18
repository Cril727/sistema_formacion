import { Context,z,RouterContext } from "../dependencies/dependencies.ts";
import { Profesion } from "../model/profesionModel.ts";

const programaSchema = z.object({
    nombre_profesion : z.string().min(1,"El nombre de la profesion es requerida")
})


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

    const {request, response} = ctx

    try {
        const contentLen = request.headers.get("Content-Length")

        if(contentLen === "0"){
            response.status = 400;
            response.body = {
                success:false,
                message:"Cuerpo de la solicitud vacia"
            }
            return;
        }

        const body = await request.body.json();
        const validated = programaSchema.parse(body);

        const profesionData = {
            idprofesion:null,
            ...validated
        }

        const objProfesion = new Profesion(profesionData);
        const agregar = await objProfesion.agregarProfesion()

        if(agregar.success){
            response.status = 201;
            response.body = {
                success: true,
                message: "Profesion agregada correctamente",
                profesion: agregar.profesion
            }
        }else{
            response.status = 400;
            response.body = {
                success:false,
                message: agregar.message
            }
        }
    } catch (error) {
        if(error instanceof z.ZodError){
            response.status = 400;
            response.body = {
                success: false,
                message:"Datos invalidos",
                errors: error.format()
            }
        }else{
            response.status = 500;
            response.body = {
                success:false,
                message:"Error del servidor",
            }
        }
    }
    
}


export const putProfesion = async (ctx:Context)=>{
    const {request, response} = ctx

    try {
        const contenLen = request.headers.get("Content-Length");

        if(contenLen === "0"){
            response.status = 400;
            response.body = {
                success:false,
                message:"El cuerpo de la solicitud esta vacio"
            }
            return;
        }

        const body = await request.body.json();
        const validated = programaSchema.parse(body);

        const dataProfesion = {
            idprofesion : body.idprofesion,
            ...validated
        }

        const objProfesion = new Profesion(dataProfesion);
        const update = await objProfesion.actualizarProfesion();

        if(update.success){
            response.status = 200;
            response.body = {
                success:update.success,
                message:"Profesion actualizada Correctamente",
                profesion: update.profesion
            }
        }else{
            response.status = 400;
            response.body = {
                success: update.success,
                message: "No se pudo actualizar la profesion"
            }
        }

    } catch (error) {
        if(error instanceof z.ZodError){
            response.status = 400;
            response.body = {
                success: false,
                message: "Datos invalidos",
                errors: error.format()
            }
        }else{
            response.status = 500;
            response.body = {
                success: false,
                message: "Error del servidor",
                error: String(error)
            }
        }
    }
}


export const deleteProfesion = async (ctx:RouterContext<"/profesion/:id">)=>{
    
    const {params, response} = ctx;

    try {
        const idprofesion = parseInt(params.id);

        if(!idprofesion || idprofesion < 0){
            response.status = 400;
            response.body = {
                success: false, 
                message:"ID de la profesion invalido"
            }
            return;
        }


        const objProfesion = new Profesion();
        const eliminar  = await objProfesion.eliminarProfesion(idprofesion);

        if(eliminar.success){
            response.status = 200;
            response.body = {
                success:true,
                message:"Profesion eliminada correctamente"
            }
        }else{
            response.status = 400;
            response.body = {
                success:true,
                message:"No se ha podido eliminar la profesion Profesion " + eliminar.message
            }
        }
    } catch (error) {
        if(error instanceof Error){
            response.status = 400;
            response.body = {
                success:true,
                message:error.message
            }
        }else{
            response.status = 500;
            response.body = {
                success:true,
                message:"Error del servidor"
            }
        }
    }
}