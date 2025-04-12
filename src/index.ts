import express from "express";

import { RoutesController } from "./modules/routes/routes.js";
import sequelize from "./database/database.js";

const router = express.Router();

const app = express();
app.use(express.json());
app.use(router)

const routes = new RoutesController(router)
await routes.initRoutes()

const port = 3000;
app.listen( port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
        console.log('Server started on port 3000');
    } catch (error) {
        console.error('Connection error:', error);
    }
})