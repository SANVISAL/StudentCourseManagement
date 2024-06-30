import express, { NextFunction, Request, Response } from "express";
import StudentController from "../controllers/student.controller";
import { Course } from "../database,/model/course.model";
import { Student } from "../database,/model/student.model";
import { StatusCode } from "../utils/const/status-code";
import { zodValidator } from "../middleware/zod-validation";
import { createStudentSchema } from "../middleware/schema/createstudentschema";

const studentRoute = express.Router();
const studentController = new StudentController();
// =========================================
// Step 1:  CREATE STUDENT
// Step 2:  GET ALL STUDENTS
// Step 3:  UPDATE STUDENTS
// Step 4:  DELETE STUDENTS
// Step 5:  SEARCH STUDENTS BY NAME
// Step 6:  REGISTER BY STUDENT ID AND COURSE ID
// Step 7:  REMOVE COURSE REGISTER BY STUDENT ID AND COURSE ID
//==========================================

// Step 1:  CREATE STUDENT
studentRoute.post(
  "/students",
  zodValidator(createStudentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Processing student creation request", req.body);
      const result = await studentController.createStudent(req.body);
      if (result !== null) {
        res.status(StatusCode.Created).json(result);
      } else {
        res.status(StatusCode.BadRequest).json({ message: "Invalid data" });
      }
    } catch (err: any) {
      console.error("Route Error:", err);
      // res.status(500).json({ message: "Internal Server Error" });
      next(err);
    }
  }
);

// Step 2:  GET ALL STUDENTS
studentRoute.get(
  "/students",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await studentController.getAllStudent();
      if (student !== null) {
        res.status(StatusCode.OK).json(student);
      } else {
        res.status(StatusCode.NotFound).json({ message: "No student found" });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// Step 3:  UPDATE STUDENTS
studentRoute.put(
  "/students/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Processing student update request", req.body);
      const studentId = req.params?.id.toString();
      const updateStudent = await studentController.upateStudent(
        studentId,
        req.body
      );
      if (updateStudent !== null) {
        res.status(StatusCode.Created).json(updateStudent);
      } else {
        res.status(StatusCode.NotFound).json({ message: "Student not found" });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// Step 4:  DELETE STUDENTS
studentRoute.delete(
  "/students/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Processing student delete request", req.body);
      const studentId = req.params?.id.toString();
      const deleteStudent = await studentController.deleteStudent(studentId);
      if (deleteStudent) {
        res
          .status(StatusCode.NotFound)
          .json({ message: "Delete Successfully" });
      } else {
        res.status(StatusCode.Found).json({ message: "Delete Unsuccess" });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// Step 5:  SEARCH STUDENTS BY NAME
studentRoute.get(
  "/students/search",
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.query.name;
    try {
      const students = await studentController.findByName(name.toString());
      if (students.length > 0) {
        res.status(StatusCode.Found).json(students);
      } else {
        res
          .status(StatusCode.NotFound)
          .json({ message: " Student Name Not Found!" });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// Step 5:  GET STUDENTS BY ID
studentRoute.get(
  "/students/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.params?.id.toString();
      const student = await studentController.findById(studentId);
      if (student == null) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Student not found." }); // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.
      } else {
        res.status(StatusCode.OK).json(student);
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// Step 6:  REGISTER BY STUDENT ID AND COURSE ID
studentRoute.post(
  "/students/:studentId/courses/:courseId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, courseId } = req.params;
      const student = await studentController.findById(studentId);
      if (student == null) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Student not found." }); // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.
      }
      if (!student.courses.includes(courseId)) {
        student.courses.push(courseId);
        await student.save();
        res
          .status(StatusCode.Created)
          .json({ message: "Course added successfully." });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// Step 7:  REMOVE COURSE REGISTER BY STUDENT ID AND COURSE ID
studentRoute.delete(
  "/students/:studentId/courses/:courseId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, courseId } = req.params;
      const student = await studentController.findById(studentId);
      if (student == null) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Student not found." }); // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.  // 404 Not Found status code if student not found.
      }
      student.courses = student.courses.filter((course) => course !== courseId);
      await student.save();
      res
        .status(StatusCode.NotFound)
        .json({ message: "Course Delete successfully." });
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// Step 8:  STUDENT REPORT
studentRoute.get(
  "/students/:studentId/report",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId } = req.params;
      const student = await studentController.findById(studentId);
      if (student == null) {
        res.status(StatusCode.NotFound).json({ message: "Student not found." }); // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.
      }
      // Count number of courses registered by the student
      const numberOfCourses = student.courses.length - 1;
      // Prepare the report object
      const studentReport = {
        fullNameEn: student.fullNameEn,
        fullNameKh: student.fullNameKh,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        phoneNumber: student.phoneNumber,
        numberOfCourses: numberOfCourses,
      };

      res
        .status(StatusCode.Created)
        .json({ message: "Student Report", data: studentReport });
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

export default studentRoute;
