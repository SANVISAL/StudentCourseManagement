export interface ICourse extends Document {
  Name: string;
  professorName: string;
  numberOfStudents: number;
  startDate: string;
  endDate: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
}
