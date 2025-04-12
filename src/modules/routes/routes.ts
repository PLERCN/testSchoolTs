import express from "express";
import {LessonsController} from "./lessons/lessonsController.js";

export class RoutesController {
    router = express.Router();
    constructor(router: express.Router) {
        this.router = router;
    }

    async initRoutes() {
        const lessons_route = new LessonsController(this.router)
        await lessons_route.initRoute()
    }
}