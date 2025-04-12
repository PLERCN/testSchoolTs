import {LessonsModule} from "./lessons.js";
import express from "express";

export class LessonsController {
    rout_path = "/lessons";
    router: express.Router;
    constructor(router: express.Router) {
        this.router = router
    }

    lessonsModule = new LessonsModule()

    async initRoute() {
        this.router.route(`${this.rout_path}`)
            .get(this.lessonsModule.getLessons)
    }
}
