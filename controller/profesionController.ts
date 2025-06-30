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
        const contentLen = request.headers.get("ContenetLengh")

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
    
}


export const deleteProfesion = async (ctx:RouterContext<"/profesion/:id">)=>{
    
}