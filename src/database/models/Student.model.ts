import {Table, Attribute, PrimaryKey, AutoIncrement, HasMany, BelongsToMany} from '@sequelize/core/decorators-legacy';
import { Model, DataTypes } from '@sequelize/core';
import { LessonStudent } from '#models/LessonStudent.model';
import { Lesson } from "#models/Lesson.model";

@Table({ tableName: 'students', timestamps: false })
export class Student extends Model {
    @PrimaryKey
    @AutoIncrement
    @Attribute(DataTypes.INTEGER)
    declare id: number;

    @Attribute(DataTypes.STRING)
    declare name: string;

    @BelongsToMany(() => Lesson, {
        through: {
            model: () => LessonStudent,
        },
        foreignKey: 'student_id',
        otherKey: 'lesson_id'
    })
    declare lessons?: Array<Lesson & { LessonStudent: LessonStudent }>;
}
