import { Model, DataTypes } from '@sequelize/core';
import { Table, Attribute, PrimaryKey } from '@sequelize/core/decorators-legacy';

@Table({ tableName: 'lesson_teachers', timestamps: false })
export class LessonTeacher extends Model {
    @PrimaryKey
    @Attribute(DataTypes.INTEGER)
    declare lesson_id: number;

    @PrimaryKey
    @Attribute(DataTypes.INTEGER)
    declare teacher_id: number;
}
