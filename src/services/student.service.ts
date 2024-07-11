import {
  ICreateStudent,
  IUpdateStudent,
} from "../database,/repository/@types/student.repository.type";
import StudentRepository from "../database,/repository/student.repository";

class StudentService {
  private studentRepository: StudentRepository;
  constructor() {
    this.studentRepository = new StudentRepository();
  }

  async createStudent(studentDetails: ICreateStudent) {
    try {
      const student = await this.studentRepository.createStudent(
        studentDetails
      );
      return student;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getAllStudent() {
    try {
      return await this.studentRepository.getAllStudents();
    } catch (err) {
      throw err;
    }
  }
  async findByPhoneNumber(phoneNumber: string) {
    try {
      const student = await this.studentRepository.findByPhoneNumber(
        phoneNumber
      );
      if (!student) {
        throw new Error("Student Not Found");
      } else {
        return student;
      }
    } catch (err) {
      throw err;
    }
  }
  async updateStudent(id: string, studentDetails: IUpdateStudent) {
    try {
      const student = await this.studentRepository.updateStudent(
        id,
        studentDetails
      );
      return student;
    } catch (err) {
      throw err;
    }
  }
  async deleteStudent(id: string) {
    try {
      const student = await this.studentRepository.deleteStudent(id);
      return student;
    } catch (err) {
      throw err;
    }
  }

  async findByName(name: string) {
    try {
      const student = await this.studentRepository.findByName(name);
      return student;
    } catch (err) {
      throw err;
    }
  }
  async findById(id: string) {
    try {
      const student = await this.studentRepository.findById(id);
      if (student == null) {
        throw new Error("Student Not Found");
      } else {
        return student;
      }
    } catch (err) {
      throw err;
    }
  }
}

export default StudentService;
