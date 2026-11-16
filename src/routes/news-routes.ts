import { Router } from "express";
import { NewsGetController } from "../controllers/news/NewsGetController.ts";

const newsRouter = Router();
const newsGetController = new NewsGetController();

newsRouter.get("/", newsGetController.show);

export { newsRouter };
