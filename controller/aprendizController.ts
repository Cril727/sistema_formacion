import { Context } from "../dependencies/dependencies.ts";

const aprendiz  = [{id:1,hh:"sdfs"}]

export const getAprendiz = (ctx:Context)=>{
    ctx.response.body = aprendiz
}