import { Router } from "express";
import { createCake } from "../controllers/cakes.controller.js";
import { cakesJOI } from "../schemas/cakes.schema.js";
import { validate } from "../middlewares/validator.middleware.js";

const cakesRouter = Router();

cakesRouter.post("/cakes", validate(cakesJOI), createCake);

export default cakesRouter;