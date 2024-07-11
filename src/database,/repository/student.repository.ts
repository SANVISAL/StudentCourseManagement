import { ApiError, MissingReqirement } from "../../errors/api-error";
import DuplicateError from "../../errors/duplicate-error";
import { logger } from "../../utils/logger";
import { Student } from "../model/student.model";
import {
  ICreateStudent,
  IUpdateStudent,
} from "./@types/student.repository.type";
import { NotFoundError } from "../../errors/api-error";

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
      if (!studentDetails.phoneNumber || !studentDetails.fullNameEn) {
        throw new MissingReqirement("Missing required student details");
      }

      const studentRequest = await this.findByPhoneNumber(
        studentDetails.phoneNumber
      );
      if (studentRequest) {
        throw new DuplicateError("Student Already Exist");
      } else {
        const student = new Student(studentDetails);
        const newStudent = await student.save();
        if (!newStudent) {
          throw new ApiError("Error creating student");
        }
        return { message: "Student created successfully", data: student };
      }
    } catch (err) {
      if (err instanceof ApiError || err instanceof DuplicateError) {
        throw err;
      }
      console.log("StudentRepository:", err);
      // throw new ApiError("Unexpected error occurred while creating student");
    }
  }
  async findByPhoneNumber(phoneNumber: string) {
    try {
      const student = await Student.findOne({ phoneNumber: phoneNumber });
      return student; // Return the student or null if not found
    } catch (err) {
      logger.error("StudentRepository:", err);
      throw new ApiError("Unexpected error occurred while creating student");
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
  async getAllStudents() {
    try {
      const students = await Student.find({ isDeleted: false });

      console.log("Students:", students);
      if (students.length !== 0) {
        return students;
      } else {
        throw new NotFoundError("Students not found");
      }
    } catch (err) {
      console.log("Student Repository", err);
      if (err instanceof NotFoundError) {
        console.log("dffhffb:", err);
        throw err;
      } else {
        throw new ApiError("Unexpected error occurred while finding students");
      }
    }
  }
  async updateStudent(id: string, studentDetails: IUpdateStudent) {
    try {
      if (!studentDetails.phoneNumber || !studentDetails.fullNameEn) {
        throw new MissingReqirement("Missing required student details");
      }
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
        throw new NotFoundError("Not Found Student With The ID");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      logger.error("StudentRepository:", err);
      throw new ApiError("Unexpected error occurred while updating student");
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
        throw new NotFoundError("Not Found Student With The ID");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      logger.error("StudentRepository:", err);
      throw new ApiError("Unexpected error occurred while deleting student");
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
        throw new NotFoundError("Student Not Found");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      logger.error("StudentRepository:", err);
      throw new ApiError("Unexpected error occurred while finding student");
    }
  }

  async findById(id: string) {
    try {
      const student = await Student.findById(id);
      if (student !== null) {
        return student;
      } else {
        throw new NotFoundError("Student Not Found");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      logger.error("StudentRepository:", err);
      throw new ApiError("Unexpected error occurred while finding student");
    }
  }
}
export default StudentRepository;
