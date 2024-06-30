import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import CourseRepository, {
  SearchByDates,
} from "../../repository/course.repository";
import { Course } from "../../model/course.model";
import { ICourse } from "../../model/@types/course.types";
import {
  ICreateCourse,
  IUpdateCourse,
} from "../../repository/@types/course.repository.type";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();
  await mongoose.connect(mongoURL);
}, 1000000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Course repository integration test", () => {
  let courseRepo: CourseRepository;
  beforeEach(() => {
    courseRepo = new CourseRepository();
  });

  afterEach(async () => {
    await Course.deleteMany({});
  });

  describe("Create Course profile", () => {
    test("should add new course to database", async () => {
      const MOCK_DATA: ICreateCourse = {
        Name: "course name",
        professorName: "test name",
        numberOfStudents: 10,
        startDate: "test sdate",
        endDate: "test edate",
      };
      const newCourse = await courseRepo.createCourse(MOCK_DATA);
      expect(newCourse).toBeDefined();
      expect(newCourse.data.Name).toEqual(MOCK_DATA.Name);
      expect(newCourse.data.startDate).toEqual(MOCK_DATA.startDate);

      // Check if student profile exists in database
      const foundCourse = await Course.findById(newCourse.data._id);
      expect(foundCourse).toBeDefined();
      expect(foundCourse?.Name).toEqual(MOCK_DATA.Name);
    });

    // test("should not create a student with existing phone number", async () => {
    //   const MOCK_DATA: ICreateCourse = {
    //     Name: "course name",
    //     professorName: "test name",
    //     numberOfStudents: 10,
    //     startDate: "test sdate",
    //     endDate: "test edate",
    //   };

    //   await courseRepo.createCourse(MOCK_DATA);

    //   await expect(courseRepo.createCourse(MOCK_DATA)).rejects.toThrow(
    //     "Student Already Exist"
    //   );
    // });
  });
  describe("Get all students", () => {
    test("should return all course from database", async () => {
      const MOCK_DATA: ICreateCourse[] = [
        {
          Name: "course name1",
          professorName: "test name1",
          numberOfStudents: 10,
          startDate: "test sdate1",
          endDate: "test edate1",
        },
        {
          Name: "course name2",
          professorName: "test name2",
          numberOfStudents: 10,
          startDate: "test sdate2",
          endDate: "test edate2",
        },
      ];

      // Insert mock data
      for (const data of MOCK_DATA) {
        await courseRepo.createCourse(data);
      }

      const students = await courseRepo.getAllCourses();
      expect(students).toBeDefined();
      expect(students.length).toEqual(MOCK_DATA.length);
      expect(students[0].Name).toEqual(MOCK_DATA[0].Name);
      expect(students[1].Name).toEqual(MOCK_DATA[1].Name);
    });

    test("should throw an error if no course found", async () => {
      await expect(courseRepo.getAllCourses()).rejects.toThrow(
        "Course Not Found"
      );
    });
  });

  describe("Update Course", () => {
    test("should update an existing course in the database", async () => {
      const MOCK_DATA: ICreateCourse = {
        Name: "course name1",
        professorName: "test name1",
        numberOfStudents: 10,
        startDate: "test sdate1",
        endDate: "test edate1",
      };
      const createCourse1 = await courseRepo.createCourse(MOCK_DATA);

      const UPDATE_DATA: IUpdateCourse = {
        Name: "update course name1",
        professorName: "test name1",
        numberOfStudents: 10,
        startDate: "test sdate1",
        endDate: "test edate1",
      };
      const updatedStudent = await courseRepo.updateCourse(
        createCourse1.data._id.toHexString(),
        UPDATE_DATA
      );

      expect(updatedStudent).toBeDefined();
      expect(updatedStudent?.Name).toEqual(UPDATE_DATA.Name);
      expect(updatedStudent?.professorName).toEqual(UPDATE_DATA.professorName);

      // Verify the student has been updated in the database
      const foundCourse = await Course.findById(createCourse1.data._id);
      expect(foundCourse).toBeDefined();
      expect(foundCourse?.Name).toEqual(UPDATE_DATA.Name);
    });

    test("should throw an error if the course ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId
      const UPDATE_DATA: IUpdateCourse = {
        Name: "update course name1",
        professorName: "test name1",
        numberOfStudents: 10,
        startDate: "test sdate1",
        endDate: "test edate1",
      };

      await expect(
        courseRepo.updateCourse(INVALID_ID, UPDATE_DATA)
      ).rejects.toThrow("Invalid Course ID");
    });
  });
  describe("Delete Course", () => {
    test("should delete an existing course in the database", async () => {
      const MOCK_DATA: ICreateCourse = {
        Name: "course name1",
        professorName: "test name1",
        numberOfStudents: 10,
        startDate: "test sdate1",
        endDate: "test edate1",
      };
      const createdCourse = await courseRepo.createCourse(MOCK_DATA);

      const deletedCourse = await courseRepo.deleteCourse(
        createdCourse.data._id.toHexString()
      );

      expect(deletedCourse).toBeDefined();
      expect(deletedCourse?.isDeleted).toEqual(true);
      expect(deletedCourse?.deletedAt).toBeDefined();

      // Verify the student has been marked as deleted in the database
      const foundCourse = await Course.findById(createdCourse.data._id);
      expect(foundCourse).toBeDefined();
      expect(foundCourse?.isDeleted).toEqual(true);
    });

    test("should throw an error if the course ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId

      await expect(courseRepo.deleteCourse(INVALID_ID)).rejects.toThrow(
        "Invalid Course ID To Delete"
      );
    });
  });
  describe("Find course by name", () => {
    test("should find course by name in the database", async () => {
      const MOCK_DATA: ICreateCourse = {
        Name: "Findable Course",
        professorName: "professor name",
        numberOfStudents: 20,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      };
      await courseRepo.createCourse(MOCK_DATA);

      const foundCourse = await courseRepo.findByName("Findable Course");
      expect(foundCourse).toBeDefined();
      expect(foundCourse[0].Name).toEqual(MOCK_DATA.Name);
    });

    test("should throw an error if no course found with the given name", async () => {
      const INVALID_NAME = "Nonexistent Name";

      await expect(courseRepo.findByName(INVALID_NAME)).rejects.toThrow(
        "Course Not Found"
      );
    });
  });
  describe("Filter courses by start and end dates", () => {
    test("should find courses within the date range", async () => {
      const COURSE_1: ICreateCourse = {
        Name: "Course 1",
        professorName: "professor name 1",
        numberOfStudents: 15,
        startDate: "2024-01-01",
        endDate: "2024-06-30",
      };
      const COURSE_2: ICreateCourse = {
        Name: "Course 2",
        professorName: "professor name 2",
        numberOfStudents: 25,
        startDate: "2024-07-01",
        endDate: "2024-12-31",
      };
      await courseRepo.createCourse(COURSE_1);
      await courseRepo.createCourse(COURSE_2);

      const filter: SearchByDates = {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      };
      const foundCourses = await courseRepo.filterStartDateByEndDate(filter);
      expect(foundCourses).toBeDefined();
      expect(foundCourses.length).toBe(2);
      expect(foundCourses[0].Name).toEqual(COURSE_1.Name);
      expect(foundCourses[1].Name).toEqual(COURSE_2.Name);
    });

    test("should throw an error if no courses found within the date range", async () => {
      const filter: SearchByDates = {
        startDate: "2025-01-01",
        endDate: "2025-12-31",
      };

      await expect(courseRepo.filterStartDateByEndDate(filter)).rejects.toThrow(
        "Course Not Found"
      );
    });
  });
  describe("Find student by ID", () => {
    test("should find a student by ID in the database", async () => {
      const MOCK_DATA: ICreateCourse = {
        Name: "Course 2",
        professorName: "professor name 2",
        numberOfStudents: 25,
        startDate: "2024-07-01",
        endDate: "2024-12-31",
      };
      const createdCourse = await courseRepo.createCourse(MOCK_DATA);

      const foundCourse = await courseRepo.findById(
        createdCourse.data._id.toHexString()
      );

      expect(foundCourse).toBeDefined();
      expect(foundCourse?.Name).toEqual(MOCK_DATA.Name);
      expect(foundCourse?._id.toHexString()).toEqual(
        createdCourse.data._id.toHexString()
      );
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId

      await expect(courseRepo.findById(INVALID_ID)).rejects.toThrow(
        "Course Not Found"
      );
    });
  });
});
