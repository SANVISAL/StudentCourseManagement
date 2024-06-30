import mongoose, { model } from "mongoose";
import { ICourse } from "./@types/course.types";

const courseSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  professorName: { type: String, required: true },
  numberOfStudents: { type:Number, required: true },
  startDate: { type: String, required: true , default:"" },
  endDate: { type: String, required: true },
  isDeleted: { type: Boolean, required: false, default: false },
  deletedAt: { type: Date, default: null },
});

const Course = model<ICourse>("Course", courseSchema);
export { Course };
