
import { Document, Types } from "mongoose";
export interface IStudent extends Document {
  fullNameEn: string;
  fullNameKh: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  phoneNumber: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  courses: string[];
}
