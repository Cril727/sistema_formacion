import { Context, z, RouterContext } from "../dependencies/dependencies.ts";
import { Aprendiz } from "../model/aprendizModel.ts";

const AprendizSchema = z.object({
    nombre: z.string().min(1,"El nombre es obligatorio"),
    apellido: z.string().min(1,"El apellido es obligatorio"),
    email: z.string().email(),
    telefono: z.string().min(1)
})


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

export const postAprendiz = async (ctx:Context)=>{
    const {request, response} = ctx;

    try {
        const contenLen = request.headers.get("Content-Length");

        if(contenLen === "0"){
            response.status = 400;
            response.body = {
                success:false,
                message:"Cuerpo de la solicitud vacia"
            };
            return;
        }

        const body = await request.body.json();
        const validated = AprendizSchema.parse(body);

        const aprendizData = {
            idaprendiz:null,
            ...validated
        };

        const objAprendiz = new Aprendiz(aprendizData)
        const agregar = await objAprendiz.agregarAprendiz();

        if(agregar.success){
            response.status = 200;
            response.body = {
                success:true,
                message:"Aprendiz agregado correctamente",
                aprendiz:agregar.aprendiz
            }
        }else{
            response.status = 400;
            response.body = {
                success:false,
                message:agregar.message
            }
        }
        
    } catch (error) {
        if(error instanceof z.ZodError){
            response.status = 400;
            response.body = {
                success: false,
                message:"Datos invalios",
                errors: error.format(),
            }
        }else{
            response.status = 500;
            response.body = {
                success:false,
                message:"Datos invalidos",
            }
        }
    }
}


export const putAprendiz = async(ctx:Context)=>{
    const {response, request} = ctx;

    try {

        const contenLen = request.headers.get("Content-Length");

        if(contenLen === "0"){
            response.status = 400;
            response.body = {
                success:false,
                message:"Cuerpo de la solicitud vacia"
            };
            return;
        }

        const body = await request.body.json();
        const validated = AprendizSchema.parse(body);

        const aprendizData = {
            idaprendiz: body.idaprendiz,
            ...validated
        }

        const objAprendiz = new Aprendiz(aprendizData);
        const update = await objAprendiz.actualizarAprendiz();

        if(update.success){
            response.status = 200
            response.body = {
                success:true,
                message:"Actualizado Correctamente",
                aprendiz:update.aprendiz
            }
        }else{
            response.status = 400,
            response.body = {
                success:false,
                message:"Error al actualizar el usuario" + update.message
            }
        }
    } catch (error) {
        if(error instanceof z.ZodError){
            response.status = 400;
            response.body = {
                success: false,
                message: "Error de servidor datos invalidos",
                errors: error.format()
            }
        }else{
            response.status = 500;
            response.body = {
                success: false,
                message: "Error de servidor"
            }
        }
    }
}


export const deleteAprendiz = async (ctx:RouterContext<"/Aprendiz/:id">) =>{
    const {params, response} = ctx;

    try {
        const idaprendiz = parseInt(params.id);

        if(!idaprendiz || idaprendiz <= 0){
            response.status = 400
            response.body = {
                success:false,
                message:"ID del usuario es invalido"
            };

            return;
        }

        const objAprendiz = new Aprendiz();
        const eliminar = await objAprendiz.eliminarAprendiz(idaprendiz);

        if(eliminar.success){
            response.status = 200;
            response.body = {
                success: true,
                message: "Usuario elminado correctamente"
            }
        }else{
            response.status = 400;
            response.body = {
                success: false,
                message: "Erro al eliminar el usuario" + eliminar.message
            }
        }

    } catch (error) {
        if(error instanceof Error){
            response.status = 500;
            response.body = {
                success: false,
                message: "Error interno del servidor" + error.message
            }
        }else{
            response.status = 500;
            response.body = {
                success: false,
                message: "Error interno del servidor"
            }
        }
    }
}