import { Router } from "express";
import { newsRouter } from "./news-routes.ts";

const router = Router();

router.use("/news", newsRouter);

export { router };
