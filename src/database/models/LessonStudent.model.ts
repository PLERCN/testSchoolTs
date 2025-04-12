import { Model, DataTypes } from '@sequelize/core';
import { Table, Attribute, PrimaryKey } from '@sequelize/core/decorators-legacy';

@Table({ tableName: 'lesson_students', timestamps: false })
export class LessonStudent extends Model {
    @PrimaryKey
    @Attribute(DataTypes.INTEGER)
    declare lesson_id: number;

    @PrimaryKey
    @Attribute(DataTypes.INTEGER)
    declare student_id: number;

    @Attribute(DataTypes.BOOLEAN)
    declare visit: boolean;
}
