import { Context, z, RouterContext } from "../dependencies/dependencies.ts";
import { Ficha } from "../model/fichaModel.ts";


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
