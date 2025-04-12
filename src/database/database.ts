import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import dotenv from "dotenv";
import { Lesson } from "#models/Lesson.model";
import { Teacher } from "#models/Teacher.model";
import { Student } from "#models/Student.model";
import { LessonTeacher } from "#models/LessonTeacher.model";
import { LessonStudent } from "#models/LessonStudent.model";

dotenv.config({path: "./src/config/config.env"});

const sequelize =  new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(`${process.env.DATABASE_PORT}`),
    clientMinMessages: 'notice',
    models: [Lesson, Teacher, Student, LessonTeacher, LessonStudent],
});

export default sequelize;
