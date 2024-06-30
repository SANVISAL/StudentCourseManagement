import express, { NextFunction, Request, Response } from "express";
import CourseController from "../controllers/course.controller";
import { SearchByDates } from "../database,/repository/course.repository";
import { Student } from "../database,/model/student.model";
import { StatusCode } from "../utils/const/status-code";
import { createCourseSchema } from "../middleware/schema/createCourseSchema";
import { zodValidator } from "../middleware/zod-validation";

const courseRoute = express.Router();
const courseController = new CourseController();

courseRoute.post(
  "/courses",
  zodValidator(createCourseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Processing course creation request", req.body);
      const result = await courseController.createCourse(req.body);
      if (result === null) {
        return res
          .status(StatusCode.BadRequest)
          .json({ message: "Invalid Data." });
      } else {
        res.status(StatusCode.Created).json(result);
      }
    } catch (err: any) {
      console.error("Route Error:", err);
      // res.status(500).json({ message: "Internal Server Error" });
      next(err);
    }
  }
);
courseRoute.get(
  "/courses",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await courseController.getAllCourse();
      if (course) {
        res.status(StatusCode.OK).json(course);
      } else {
        res.status(StatusCode.NotFound).json({ message: "Course not found." });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

courseRoute.put(
  "/courses/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Processing course update request", req.body);
      const courseId = req.params?.id.toString();
      const updateCourse = await courseController.upateCourse(
        courseId,
        req.body
      );
      if (updateCourse) {
        res.status(StatusCode.Created).json(updateCourse);
      } else {
        res
          .status(StatusCode.BadRequest)
          .json({ message: "Course Can Not Update." });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);
courseRoute.delete(
  "/courses/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Processing course delete request", req.body);
      const courseId = req.params?.id.toString();
      const deleteStudent = await courseController.deleteCourse(courseId);
      if (deleteStudent) {
        res
          .status(StatusCode.NotFound)
          .json({ message: "Delete Successfully." });
      } else {
        res
          .status(StatusCode.BadRequest)
          .json({ message: "Course Can Not Delete." });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);
courseRoute.get(
  "/courses/search",
  async (req: Request, res: Response, next: NextFunction) => {
    const name = req.query.name;
    // if (!name) {
    //   return res.status(400).json({ message: "Name parameter is required." });
    // }
    try {
      const course = await courseController.findByName(name.toString());
      if (course) {
        res.status(StatusCode.Found).json(course);
      } else {
        res.status(StatusCode.NotFound).json({ message: "Course Not Found." });
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);
courseRoute.get(
  "/courses/dates",
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;
    const filter: SearchByDates = {
      startDate: startDate?.toString(),
      endDate: endDate?.toString(),
    };
    try {
      const course = await courseController.fliterByStartDateEndDate(filter);
      if (course == null) {
        res
          .status(StatusCode.NotFound)
          .json({ message: "Courses Not Found with Date" });
      } else {
        return res.status(StatusCode.OK).json(course);
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

courseRoute.get(
  "/courses/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params?.id.toString();
      const course = await courseController.findById(courseId);
      if (course == null) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Course not found." }); // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.
      } else {
        res.status(StatusCode.Found).json(course);
      }
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);

// API ENDPOINT TO SHOW REPORT OF COURSE
courseRoute.get(
  "/courses/:courseId/report",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const course = await courseController.findById(courseId);
      if (course == null) {
        return res
          .status(StatusCode.NotFound)
          .json({ message: "Course not found." }); // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.  // 404 Not Found status code if course not found.
      }
      // Count number of registered students
      const registeredStudentsCount = await Student.countDocuments({
        courses: courseId,
        isDeleted: false, // Consider only active students
      });
      const courseReport = {
        courseName: course.Name,
        professor: course.professorName,
        startDate: course.startDate,
        endDate: course.endDate,
        limitNumberOfStudents: course.numberOfStudents,
        numberOfRegisteredStudents: registeredStudentsCount,
      };
      res
        .status(StatusCode.Created)
        .json({ message: "Course Report", data: courseReport });
    } catch (err) {
      console.log("Route Error:", err);
      next(err);
    }
  }
);
export default courseRoute;
