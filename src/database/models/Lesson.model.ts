import { Model, DataTypes } from '@sequelize/core';
import { Table, Attribute, PrimaryKey, AutoIncrement, BelongsToMany } from '@sequelize/core/decorators-legacy';
import { LessonTeacher } from '#models/LessonTeacher.model';
import { LessonStudent } from '#models/LessonStudent.model';
import {Teacher} from "#models/Teacher.model";
import {Student} from "#models/Student.model";

@Table({ tableName: 'lessons', timestamps: false })
export class Lesson extends Model {
    @PrimaryKey
    @AutoIncrement
    @Attribute(DataTypes.INTEGER)
    declare id: number;

    @Attribute(DataTypes.DATE)
    declare date: Date;

    @Attribute(DataTypes.STRING)
    declare title: string;

    @Attribute(DataTypes.INTEGER)
    declare status: number;

    @BelongsToMany(() => Teacher, {
        through: { model: () => LessonTeacher },
        foreignKey: 'lesson_id',
        otherKey: 'teacher_id'
    })
    declare teachers?: Teacher[];

    @BelongsToMany(() => Student, {
        through: { model: () => LessonStudent },
        foreignKey: 'lesson_id',
        otherKey: 'student_id'
    })
    declare students?: Array<Student & { LessonStudent: LessonStudent }>;
}
