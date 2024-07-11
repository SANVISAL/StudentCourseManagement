import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import CourseRepository from "../../repository/course.repository";
import { Course } from "../../model/course.model";
import {
  ICreateCourse,
  IUpdateCourse,
} from "../../repository/@types/course.repository.type";
import { ApiError, MissingReqirement } from "../../../errors/api-error";

// Setting up an in-memory MongoDB server
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Course.deleteMany({});
});

describe("CourseRepository Integration Tests", () => {
  const courseRepo = new CourseRepository();

  test("should create a new course", async () => {
    const courseDetails: ICreateCourse = {
      Name: "Computer Science",
      professorName: "Dr. John Doe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 30,
    };

    const result = await courseRepo.createCourse(courseDetails);

    expect(result).toBeDefined();
    expect(result.data.Name).toBe(courseDetails.Name);
    expect(result.data.professorName).toBe(courseDetails.professorName);
  });

  test("should fail to create a course with missing required details", async () => {
    const courseDetails: Partial<ICreateCourse> = {
      professorName: "Dr. John Doe",
    };

    await expect(
      courseRepo.createCourse(courseDetails as ICreateCourse)
    ).rejects.toThrow(ApiError);
  });

  test("should retrieve all courses", async () => {
    await Course.create({
      Name: "Mathematics",
      professorName: "Prof. Jane Doe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 25,
    });

    const courses = await courseRepo.getAllCourses();

    expect(courses).toBeDefined();
    expect(courses.length).toBe(1);
    expect(courses[0].Name).toBe("Mathematics");
  });

  test("should update an existing course", async () => {
    const course = await Course.create({
      Name: "Physics",
      professorName: "Prof. Richard Roe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 25,
    });

    const updatedDetails: IUpdateCourse = {
      Name: "Advanced Physics",
      professorName: "Prof. Richard Roe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 25,
    };

    const updatedCourse = await courseRepo.updateCourse(
      course._id.toString(),
      updatedDetails
    );

    expect(updatedCourse).toBeDefined();
    expect(updatedCourse.Name).toBe(updatedDetails.Name);
    expect(updatedCourse.numberOfStudents).toBe(
      updatedDetails.numberOfStudents
    );
  });

  test("should delete an existing course", async () => {
    const course = await Course.create({
      Name: "Chemistry",
      professorName: "Prof. Sarah Smith",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 25,
    });

    const deletedCourse = await courseRepo.deleteCourse(course._id.toString());

    expect(deletedCourse).toBeDefined();
    expect(deletedCourse.isDeleted).toBe(true);
  });

  test("should find course by name", async () => {
    await Course.create({
      Name: "Biology",
      professorName: "Prof. James Bond",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 30,
    });

    const courses = await courseRepo.findByName("Biology");

    expect(courses).toBeDefined();
    expect(courses.length).toBe(1);
    expect(courses[0].Name).toBe("Biology");
  });

  test("should filter courses by start and end dates", async () => {
    await Course.create({
      Name: "History",
      professorName: "Prof. Emily Clark",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 30,
    });

    const filters = { startDate: "2024-09-01", endDate: "2025-06-30" };
    const courses = await courseRepo.filterStartDateByEndDate(filters);

    expect(courses).toBeDefined();
    expect(courses.length).toBe(1);
    expect(courses[0].Name).toBe("History");
  });

  test("should find course by ID", async () => {
    const course = await Course.create({
      Name: "English",
      professorName: "Prof. George Martin",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 30,
    });

    const foundCourse = await courseRepo.findById(course._id.toString());

    expect(foundCourse).toBeDefined();
    expect(foundCourse.Name).toBe("English");
  });
});
