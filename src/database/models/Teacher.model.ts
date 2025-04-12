import { Model, DataTypes } from '@sequelize/core';
import { Table, Attribute, PrimaryKey, AutoIncrement, HasMany, BelongsToMany } from '@sequelize/core/decorators-legacy';
import { LessonTeacher } from '#models/LessonTeacher.model';
import { Lesson } from "#models/Lesson.model";

@Table({ tableName: 'teachers', timestamps: false })
export class Teacher extends Model {
    @PrimaryKey
    @AutoIncrement
    @Attribute(DataTypes.INTEGER)
    declare id: number;

    @Attribute(DataTypes.STRING)
    declare name: string;

    @BelongsToMany(() => Lesson, {
        through: () => LessonTeacher,
        foreignKey: 'teacher_id',
        otherKey: 'lesson_id',
    })
    declare lessons?: Lesson[];
}
