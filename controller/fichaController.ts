import { Context, z, RouterContext } from "../dependencies/dependencies.ts";
import { Ficha } from "../model/fichaModel.ts";


const FichaSchema = z.object({
    codigo: z.string().min(1,"El nombre del codigo es obligatorio"),
    fecha_inicio_lectiva: z.string().min(1,"La fecha de inicio lectiva es obligatoria"),
    fecha_fin_lectiva: z.string().min(1,"La fecha de fin lectiva es obligatoria"),
    fecha_fin_practica: z.string().min(1,"La fecha del fin de practicas es obligatoria"),
    programa_idprograma: z.string().min(1)
})





export const getFicha = async (ctx:Context)=>{
    const {response} = ctx;

    try {
        const objFicha = new Ficha();
        const ListaFichas = await objFicha.listarFichas()

        if (!ListaFichas || ListaFichas.length === 0) {
            response.status = 400;
            response.body = {
                success:false,
                message:"No existen usuarios"
            };
            return;
        }

        response.status = 200; 
        response.body = {
            success:true,
            data:ListaFichas
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

export const postFicha = async (ctx:Context)=>{
    const {request , response} = ctx;

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
        const validated = FichaSchema.parse(body);

        const fichaData = {
        idficha: null,
        ...validated,
         programa_idprograma: Number(validated.programa_idprograma)
        };

        const objFicha = new Ficha(fichaData)
        const agregar = await objFicha.agregarFicha();

        if (agregar.success) {
            response.status = 200;
            response.body = {
                success:true,
                message:"Ficha agregada correctamente",
                ficha:agregar.ficha
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