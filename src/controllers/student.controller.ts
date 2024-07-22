import { Router } from "express";
import StudentService from "../services/student.service";
import {
  ICreateStudent,
  IUpdateStudent,
} from "../database,/repository/@types/student.repository.type";

class StudentController {
  private studentService: StudentService;
  constructor() {
    this.studentService = new StudentService();
  }
  public async createStudent(studentDetail: ICreateStudent) {
    try {
      const result = await this.studentService.createStudent(studentDetail);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  public async getAllStudent() {
    try {
      const result = await this.studentService.getAllStudent();
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async upateStudent(id: string, studentDetails: IUpdateStudent) {
    try {
      const result = await this.studentService.updateStudent(
        id,
        studentDetails
      );
      return result;
    } catch (err) {
      throw err;
    }
  }
  async deleteStudent(id: string) {
    try {
      const result = await this.studentService.deleteStudent(id);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async findByName(name: string) {
    try {
      const result = await this.studentService.findByName(name);
      return result;
    } catch (err) {
      throw err
    }
  }
  //
  async findById(id: string) {
    try {
      const result = await this.studentService.findById(id);;
      return result;
    } catch (err) {
      throw err
    }
  }
}

export default StudentController;
