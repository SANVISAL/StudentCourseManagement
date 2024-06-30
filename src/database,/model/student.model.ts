import { model, Schema } from "mongoose";
import { IStudent } from "./@types/student.types";
const studentSchema = new Schema({
  fullNameEn: { type: String, required: false, default: "" },
  fullNameKh: { type: String, required: false, default: "" },
  dateOfBirth: { type: String, required: false, default: "" },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value: string) {
        return /\d{10}/.test(value);
      },
      message: (props: any) => `${props.value} is not a valid phone number!`
    }
  },
  isDeleted: { type: Boolean, required: false, default: false },
  deletedAt: { type: Date, default: null },
  courses: { type: [String], required: false, default: "" },
});

const Student = model<IStudent>("Student", studentSchema);
export { Student };
