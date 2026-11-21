import { Router } from "express";
import { newsRouter } from "./news-route.ts";

const router = Router();

router.use("/v1/news", newsRouter);

export { router };
