import { Router } from "../dependencies/dependencies.ts";
import { getFicha } from "../controller/fichaController.ts";

const FichaRouter = new Router()

FichaRouter.get("/Ficha",getFicha)


export{FichaRouter}