import { Context, z, RouterContext } from "../dependencies/dependencies.ts";
import { Programa } from "../model/programaModel.ts";

const programaSchema = z.object({
    nombre_programa : z.string().min(1,"El nombre es requerido")
})

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


export const postPrograma = async (ctx:Context)=>{
    const {response, request} = ctx;

    try {
        const contenLen = request.headers.get("Content-Length")

        if(contenLen == "0"){
            response.status = 400;
            response.body = {
                success:false,
                messaje:"Cuerpo de la solicitud vacio"
            }
            return;
        }

        const body = await request.body.json();
        const validated =  programaSchema.parse(body);

        const programaData = {
            idprograma:null,
            ...validated
        }

        const objPrograma = new Programa(programaData);
        const agregar = await objPrograma.agregarPrograma();

        if(agregar.success){
            response.status = 201;
            response.body = {
                success:true,
                message:"Programa agregado Correctamente",
                programa: agregar.programa
            }
        }else{
            response.status = 400;
            response.body = {
                success: false,
                message:"No se pudo agregar el usuario"
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
                message: "Datos invalidos",
            }
        }
    }
}


export const putPrograma = async (ctx:Context)=>{
    const { request, response} = ctx
    try {

        const contenLen = request.headers.get("Content-Length")

        if(contenLen === "0"){
            response.status = 400;
            response.body = {
                success:false,
                messaje:"Cuerpo de la solicitud vacio"
            }
            return;
        }

        const body = await request.body.json();
        const validated = programaSchema.parse(body)

        const ProgramaData = {
            idprograma: body.idprograma,
            ...validated
        }

        const objPrograma = new Programa(ProgramaData);
        const actualizar = await objPrograma.actualizarPrograma();

        if(actualizar.success){
            response.status = 200;
            response.body = {
                success:true,
                message:"Programa actualizado correctamente",
                programa: actualizar.programa
            }
        }else{
            response.status = 400;
            response.body = {
                success:false,
                message: "Error al actualizar el programa" + actualizar.message,
            }
        }
        
    } catch (error) {
        if(error instanceof z.ZodError){
            response.status = 400;
            response.body = {
                success:false,
                message: "Error de servidor Datos invalidos",
                errors: error.format()
            }
        }else{

            response.status = 400;
            response.body = {
                success:false,
                message: "Error de servidor Datos invalidos",
            }
        }
    }
}


export const deletePrograma = async (ctx:RouterContext<"/programa/:id">)=>{
}