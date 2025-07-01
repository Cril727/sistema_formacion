import { Context, RouterContext } from "../dependencies/dependencies.ts";
import { InstructorProfesion } from "../model/instructorProfesionModel.ts";

export const getInstructorProfesion = async (ctx: Context) => {
    const { response } = ctx;

    try {
        const objInstructorProfesion = new InstructorProfesion();
        const ListaInstructorProfesion = await objInstructorProfesion.listarInstructorProfesion()

        if (!ListaInstructorProfesion || ListaInstructorProfesion.length === 0) {
            response.status = 400;
            response.body = {
                success: false,
                message: "No se han encontrado datos"
            }
            return;
        }

        response.status = 200;
        response.body = {
            success: true,
            data: ListaInstructorProfesion
        }
    } catch (error) {
        if (error instanceof Error) {
            response.status = 400;
            response.body = {
                success: false,
                message: "Error interno del servidor",
                error: error.message
            }
        } else {
            response.status = 500;
            response.body = {
                success: false,
                message: "Error interno del servidor",
                error: String(error)
            }
        }
    }
}


export const postInstructoresProfesiones = async (ctx: Context) => {
    const { request, response } = ctx;

    try {
        const contentLen = request.headers.get("Content-Length");

        if (!contentLen) {
            response.status = 400;
            response.body = {
                success: false,
                message: "El cuerpo de la solicitud esta vacion"
            }
            return;
        }

        const body = await request.body.json();

        const dataInstructorProfesion = {
            instructor_idinstructor: Number(body.instructorId),
            profesion_idprofesion: Number(body.profesionId),
            ...body
        }

        const objInstructorProfesion = new InstructorProfesion(dataInstructorProfesion);
        const agregar = await objInstructorProfesion.agregarInstructorProfesion();

        if (agregar.success) {
            response.status = 201;
            response.body = {
                success: true,
                message: "Relacion agregada correctamnete",
                relacion: agregar.instructorProfesion
            }
        } else {
            response.status = 400;
            response.body = {
                success: false,
                message: "No se pudo agregar la relación"
            };
        }

    } catch (error) {
        console.error(error);
        response.status = 500;
        response.body = {
            success: false,
            message: "Error interno del servidor"
        };
    }
}


export const putInstructoresProfesiones = async (ctx:Context)=>{
    const {request, response} = ctx;

    try {
        const contentLen = request.headers.get("Content-Length");

        if (!contentLen) {
            response.status = 400;
            response.body = {
                success: false,
                message: "El cuerpo de la solicitud esta vacion"
            }
            return;
        }

        const body = await request.body.json();

        const dataInstructorProfesion = {
            instructor_idinstructor: Number(body.instructorId),
            profesion_idprofesion: Number(body.profesionId),
            ...body
        }

        const objInstructorProfesion = new InstructorProfesion(dataInstructorProfesion);
        const editar = await objInstructorProfesion.actualizarInstructorProfesion();

        if(editar.success){
            response.status = 201;
            response.body = {
                success: true,
                message: "Relacion editada correctamnete",
                relacion: editar.instructorProfesion
            }
        } else {
            response.status = 400;
            response.body = {
                success: false,
                message: editar.message
            };
        }
    } catch (error) {
        console.error(error);
        response.status = 500;
        response.body = {
            success: false,
            message: "Error interno del servidor"
        };
    }
}


export const deleteInstructoresProfesiones = async (ctx:RouterContext<"/InstructorProfesion/:instructorId/:profesionId">)=>{
    const {params, response} = ctx;

    try {
        const instructorId = Number(params.instructorId);
        const profesionId  = Number(params.profesionId);

        if(!instructorId || !profesionId || profesionId <= 0 || instructorId <= 0){
            response.status = 400
            response.body = {
                success:false,
                message:"ID del aprendiz es invalido"
            };

            return;
        }

        const objInstructorProfesion = new InstructorProfesion();
        const eliminar = await objInstructorProfesion.eliminarInstructorProfesion(instructorId,profesionId);

        if(eliminar.success){
            response.status = 200;
            response.body = {
                success: true,
                message: "Aprendiz elminado correctamente"
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