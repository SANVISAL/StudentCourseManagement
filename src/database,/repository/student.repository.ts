
import { Student } from "../model/student.model";
import {
  ICreateStudent,
  IUpdateStudent,
} from "./@types/student.repository.type";
// import DuplicateError from "../../errors/duplicate-error";
// import { ApiError } from "../../errors/Api-error";
// import { logger } from "../../utils/logger";
// import DuplicateError from "../../errors/duplicate-error";

class StudentRepository {
  //==================================
  // STEP 1: CREATE
  // STEP 2: FIND BY PHONE
  // STEP 3: GET ALL STUDENT
  // STEP 4: UPDATE STUDENT
  // STEP 5: DELETE STUDENT
  // STEP 6: FIND BY NAME
  //==================================
  async createStudent(studentDetails: ICreateStudent) {
    try {
      const studentRequest = await this.findByPhoneNumber(
        studentDetails.phoneNumber
      );
      if (studentRequest) {
        throw new Error("Student Already Exist");
      } else {
        const student = new Student(studentDetails);
        const newStudent = await student.save();
        if (!newStudent){
          throw new Error("Error creating student");
        }
        return { message: "Student created successfully", data: student };
      }
    } catch (error) {
      console.log("StudentRepository:", error);
      throw error;
    }
  }
  async findByPhoneNumber(phoneNumber: string) {
    try {
      const student = await Student.findOne({ phoneNumber: phoneNumber });
      return student; // Return the student or null if not found
    } catch (err) {
      console.log("Student Repository Find By Phone:", err);
      throw err;
    }
  }

  // async createStudent(studentDetails: ICreateStudent) {
  //   try {
  //     const studentRequest = await this.findByPhoneNumber(
  //       studentDetails.phoneNumber
  //     );
  //     if (studentRequest) {
  //       throw new DuplicateError("Student Already Exist");
  //     } else {
  //       const student = new Student(studentDetails);
  //       const newStudent = await student.save();
  //       if (!newStudent) {
  //         throw new ApiError("Error creating student");
  //       }
  //       return { message: "Student created successfully", data: student };
  //     }
  //   } catch (error) {
  //     logger.error(`An error occurred in create(): ${error}`);
  //     if (error instanceof ApiError || error instanceof DuplicateError) {
  //       throw error;
  //     }
  //     throw new ApiError("Unexpected error occurred while creating student");
  //   }
  // }

  // async findByPhoneNumber(phoneNumber: string) {
  //   try {
  //     const student = await Student.findOne({ phoneNumber: phoneNumber });
  //     return student; // Return the student or null if not found
  //   } catch (err) {
  //     console.log("Student Repository Find By Phone:", err);
  //     throw err;
  //   }
  // }
  async getAllStudnet() {
    try {
      const student = await Student.find({ isDeleted: false });
      console.log("Student:", student);
      if (student.length !== 0) {
        return student;
      } else {
        throw new Error("Student Not Found");
      }
    } catch (err) {
      console.log("Student Repository:", err);
      throw err;
    }
  }
  async updateStudent(id: string, studentDetails: IUpdateStudent) {
    try {
      console.log("Student Repository Update", studentDetails);
      const student = await Student.findById(id);
      if (student !== null) {
        const updateStudent = await Student.findByIdAndUpdate(
          id,
          studentDetails,
          { new: true }
        );
        return updateStudent;
      } else {
        throw new Error("Invalid Student ID To Update");
      }
    } catch (err) {
      console.log("Update Student Repository:", err);
      throw err;
    }
  }

  async deleteStudent(id: string) {
    try {
      const student = await Student.findById(id);
      if (student !== null) {
        const deleteStudent = await Student.findByIdAndUpdate(
          id,
          {
            isDeleted: true,
            deletedAt: new Date(),
          },
          { new: true }
        );
        return deleteStudent;
      } else {
        throw new Error("Invalid Student ID To Delete");
      }
    } catch (err) {
      throw err;
    }
  }
  async findByName(name: string) {
    try {
      const query = {
        $or: [{ fullNameEn: name }, { fullNameKh: name }],
      };
      const students = await Student.find(query);
      console.log("Student:", students);
      if (students.length > 0) {
        return students;
      } else {
        throw new Error("Student Not Found");
      }
    } catch (err) {
      console.log("Student Repository:", err);
      throw err;
    }
  }

  async findById(id: string) {
    try {
      const student = await Student.findById(id);
      if (student !== null) {
        return student;
      } else {
        throw new Error("Student Not Found");
      }
    } catch (err) {
      throw err;
    }
  }
}
export default StudentRepository;
