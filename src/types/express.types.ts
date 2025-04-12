import type {Request} from "express";

export type RequestQuery<T> = Request<{}, {}, {}, T>