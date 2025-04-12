import { Response } from "express";
import { LessonsQuery, StudentWithVisit } from "../../../types/routes/lessons/lessons.types.js";
import { RequestQuery } from "../../../types/express.types.js";
import { Op, literal, ValidationError } from '@sequelize/core';
import { Lesson } from "#models/Lesson.model";
import { Teacher } from "#models/Teacher.model";
import { Student } from "#models/Student.model";

export class LessonsModule {
     getLessons = async (req: RequestQuery<LessonsQuery>, res: Response) => {
         try {
             const query: LessonsQuery = req.query;
             const {error, params} = await this.validateLesson(query);

             if (error) {
                 res.status(400).json({error})
                 return;
             }

             const queryOptions: any = {
                 attributes: [
                     'id',
                     'date',
                     'title',
                     'status'
                 ],
                 include: [],
                 group: ['Lesson.id'],
                 subQuery: false,
                 raw: true,
                 nest: true,
             };

             if (params.date) {
                 queryOptions.where = {
                     date: params.date.length === 1
                         ? params.date[0]
                         : { [Op.between]: params.date }
                 };
             }


             if (params.status !== undefined) {
                 queryOptions.where = {
                     ...queryOptions.where,
                     status: params.status
                 };
             }

             queryOptions.include.push({
                 model: Student,
                 through: {
                     as: 'LessonStudent',
                     attributes: []
                 },
                 attributes: [],
                 required: false,
             });

             if (params.teacherIds?.length) {
                 queryOptions.include.push({
                     model: Teacher,
                     through: { attributes: [] },
                     where: { id: { [Op.in]: params.teacherIds } },
                     attributes: [],
                     required: true
                 });
             }

             if (params.studentsCount) {
                 // Формируем условие для HAVING через literal и агрегатную функцию
                 const countCondition = Array.isArray(params.studentsCount)
                     ? `BETWEEN ${params.studentsCount[0]} AND ${params.studentsCount[1]}`
                     : `= ${params.studentsCount}`;

                 queryOptions.having = literal(
                     `COUNT(DISTINCT "students->LessonStudent"."student_id") ${countCondition}`
                 );
             }

             if (params.page && params.lessonsPerPage) {
                 queryOptions.limit = params.lessonsPerPage;
                 queryOptions.offset = (params.page - 1) * params.lessonsPerPage;
             }

             const lessons = await Lesson.findAll(queryOptions);

             const result = await Promise.all(
                 lessons.map(async lesson => ({
                     ...lesson,
                     teachers: await this.getTeachersForLesson(lesson.id),
                     students: await this.getStudentsForLesson(lesson.id)
                 }))
             );

             res.json(result);
         } catch (e) {
             this.handleError(res, e);
         }
     }

    async getTeachersForLesson(lessonId: number) {
        const teachers = await Teacher.findAll({
            raw: true,
            include: [{
                model: Lesson,
                where: { id: lessonId },
                attributes: [],
                through: { attributes: [] }
            }]
        });

        return teachers.map(t => ({ id: t.id, name: t.name }));
    }

    async getStudentsForLesson(lessonId: number) {
        const students = await Student.findAll({
            include: [{
                model: Lesson,
                where: { id: lessonId },
                through: {
                    as: 'LessonStudent',
                    attributes: ['visit'],
                },
            }]
        });

        return students.map((student: StudentWithVisit) => ({
            id: student.id,
            name: student.name,
            visit: student.lessons?.map(lesson => lesson.LessonStudent.visit)[0] ?? false
        }));
    }

     handleError(res: Response, error: unknown) {
        if (error instanceof ValidationError) {
            res.status(400).json({ error: error.message });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

     validateLesson = async (query: LessonsQuery) => {
         const params: any = {};
         const errors: string[] = [];

         if (query.date) {
             const dates = query.date.split(',');
             if (dates.length > 2) {
                 errors.push('Invalid date format');
             } else {
                 params.date = []
                 for (const date of dates) {
                     const date_format = new Date(date)
                     params.date.push(date_format);
                 }
             }
         }

         if (query.status && ![0, 1].includes(Number(query.status))) {
             errors.push('Invalid status value');
         } else {
             params.status = query.status;
         }

         if (query.teacherIds) {
             const ids = query.teacherIds.split(',').map(Number);
             if (ids.some(isNaN)) {
                 errors.push('Invalid teacher IDs');
             }
             params.teacherIds = ids;
         }

         if (query.studentsCount) {
             const counts = query.studentsCount.split(',').map(Number);
             if (counts.some(isNaN) || counts.length > 2) {
                 errors.push('Invalid students count');
             }
             params.studentsCount = counts.length === 1 ? counts[0] : counts;
         }

         params.page = Math.max(1, Number(query.page) || 1);
         params.lessonsPerPage = Math.max(1, Math.min(100, Number(query.lessonsPerPage) || 5));

         return errors.length
             ? { error: errors.join('; ') }
             : { params };
     }
}
