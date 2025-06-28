import { getProgramas } from "../controller/programaController.ts";
import { Router } from "../dependencies/dependencies.ts";


const programaRouter = new Router();

programaRouter.get("/programa",getProgramas)
programaRouter.post("/programa",()=>{})
programaRouter.put("/programa",()=>{})
programaRouter.delete("/programa",()=>{})


export {programaRouter}