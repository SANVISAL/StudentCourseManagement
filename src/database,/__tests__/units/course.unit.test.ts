import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import CourseRepository from "../../repository/course.repository";
import { Course } from "../../model/course.model";
import {
  ICreateCourse,
  IUpdateCourse,
} from "../../repository/@types/course.repository.type";
import { SearchByDates } from "../../repository/course.repository";

jest.mock("../../model/course.model");

describe("Course repository unit test", () => {
  let courseRepo: CourseRepository;

  beforeEach(() => {
    courseRepo = new CourseRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        const savedCourse = {
          ...MOCK_DATA,
          _id: new mongoose.Types.ObjectId(),
        };

        // Mock the save method on Course prototype
        (Course.prototype.save as jest.Mock).mockResolvedValue(savedCourse);

        const newCourse = await courseRepo.createCourse(MOCK_DATA);

        expect(newCourse).toBeDefined();
        expect(newCourse.data.Name).toEqual(MOCK_DATA.Name);
        expect(newCourse.data.startDate).toEqual(MOCK_DATA.startDate);
        expect(Course.prototype.save).toHaveBeenCalledTimes(1);
      });

    // test("should create a new course successfully", async () => {
    //   const MOCK_DATA: ICreateCourse = {
    //     Name: "course name",
    //     professorName: "test name",
    //     numberOfStudents: 10,
    //     startDate: "test sdate",
    //     endDate: "test edate",
    //   };

    //   const savedCourse = {
    //     _id: "mocked_id",
    //     ...MOCK_DATA,
    //   };

    //   (Course.prototype.save as jest.Mock).mockResolvedValue(savedCourse);

    //   const result = await courseRepo.createCourse(MOCK_DATA);

    //   expect(result).toBeDefined();
    //   expect(result.message).toEqual("Course created successfully");
    //   expect(result.data.Name).toEqual(MOCK_DATA.Name);

    //   // Verify the course was saved in the database
    //   const savedCourseFromDB = await Course.findOne({ name: MOCK_DATA.Name });
    //   expect(savedCourseFromDB).toBeDefined();
    //   expect(savedCourseFromDB.Name).toEqual(MOCK_DATA.Name);
    //   expect(savedCourseFromDB.startDate).toEqual(MOCK_DATA.startDate);
    //   expect(savedCourseFromDB.endDate).toEqual(MOCK_DATA.endDate);
    // });

    // test("should throw an error if course details are invalid", async () => {
    //   const INVALID_DATA = {
    //     name: "",
    //     professorName: "test name",
    //     numberOfStudents: 10,
    //     startDate: "test sdate",
    //     endDate: "test edate",
    //   };

    //   await expect(
    //     courseRepo.createCourse(INVALID_DATA as any)
    //   ).rejects.toThrow("Invalid course details");

    //   // Ensure no course was saved in the database
    //   const savedCourse = await Course.findOne({ name: INVALID_DATA.name });
    //   expect(savedCourse).toBeNull();
    // });

    // test("should throw an error if saving the course fails", async () => {
    //   const MOCK_DATA: ICreateCourse = {
    //     Name: "course name",
    //     professorName: "test name",
    //     numberOfStudents: 10,
    //     startDate: "test sdate",
    //     endDate: "test edate",
    //   };

    //   // Mock the save method to simulate a failure
    //   jest.spyOn(Course.prototype, "save").mockImplementationOnce(() => {
    //     throw new Error("Database error");
    //   });

    //   await expect(courseRepo.createCourse(MOCK_DATA)).rejects.toThrow(
    //     "Unexpected error occurred while creating course"
    //   );

    //   // Ensure no course was saved in the database
    //   const savedCourse = await Course.findOne({ name: MOCK_DATA.Name});
    //   expect(savedCourse).toBeNull();
    // });
  });

  describe("Get all courses", () => {
    test("should return all courses from database", async () => {
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
      (Course.find as jest.Mock).mockResolvedValue(MOCK_DATA);

      const courses = await courseRepo.getAllCourses();

      expect(courses).toBeDefined();
      expect(courses.length).toEqual(MOCK_DATA.length);
      expect(courses[0].Name).toEqual(MOCK_DATA[0].Name);
      expect(courses[1].Name).toEqual(MOCK_DATA[1].Name);
    });

    test("should throw an error if no courses found", async () => {
      (Course.find as jest.Mock).mockResolvedValue([]);

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
      const savedCourse = {
        ...MOCK_DATA,
        _id: new mongoose.Types.ObjectId(),
      };
      (Course.findById as jest.Mock).mockResolvedValue(savedCourse);
      (Course.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...savedCourse,
        Name: "updated course name",
      });

      const UPDATE_DATA: IUpdateCourse = {
        Name: "updated course name",
        professorName: "test name1",
        numberOfStudents: 10,
        startDate: "test sdate1",
        endDate: "test edate1",
      };

      const updatedCourse = await courseRepo.updateCourse(
        savedCourse._id.toHexString(),
        UPDATE_DATA
      );

      expect(updatedCourse).toBeDefined();
      expect(updatedCourse?.Name).toEqual(UPDATE_DATA.Name);
      expect(Course.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if the course ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000";
      (Course.findById as jest.Mock).mockResolvedValue(null);

      const UPDATE_DATA: IUpdateCourse = {
        Name: "updated course name1",
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
      const savedCourse = {
        ...MOCK_DATA,
        _id: new mongoose.Types.ObjectId(),
        isDeleted: false,
      };
      (Course.findById as jest.Mock).mockResolvedValue(savedCourse);
      (Course.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...savedCourse,
        isDeleted: true,
        deletedAt: new Date(),
      });

      const deletedCourse = await courseRepo.deleteCourse(
        savedCourse._id.toHexString()
      );

      expect(deletedCourse).toBeDefined();
      expect(deletedCourse?.isDeleted).toEqual(true);
      expect(Course.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if the course ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000";
      (Course.findById as jest.Mock).mockResolvedValue(null);

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
      (Course.find as jest.Mock).mockResolvedValue([MOCK_DATA]);

      const foundCourse = await courseRepo.findByName("Findable Course");

      expect(foundCourse).toBeDefined();
      expect(foundCourse[0].Name).toEqual(MOCK_DATA.Name);
      expect(Course.find).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if no course found with the given name", async () => {
      (Course.find as jest.Mock).mockResolvedValue([]);

      await expect(courseRepo.findByName("Nonexistent Name")).rejects.toThrow(
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
      (Course.find as jest.Mock).mockResolvedValue([COURSE_1, COURSE_2]);

      const filter: SearchByDates = {
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      };

      const foundCourses = await courseRepo.filterStartDateByEndDate(filter);

      expect(foundCourses).toBeDefined();
      expect(foundCourses.length).toBe(2);
      expect(foundCourses[0].Name).toEqual(COURSE_1.Name);
      expect(foundCourses[1].Name).toEqual(COURSE_2.Name);
      expect(Course.find).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if no courses found within the date range", async () => {
      (Course.find as jest.Mock).mockResolvedValue([]);

      const filter: SearchByDates = {
        startDate: "2025-01-01",
        endDate: "2025-12-31",
      };

      await expect(courseRepo.filterStartDateByEndDate(filter)).rejects.toThrow(
        "Course Not Found"
      );
    });
  });

  describe("Find course by ID", () => {
    test("should find a course by ID in the database", async () => {
      const MOCK_DATA: ICreateCourse = {
        Name: "Course 2",
        professorName: "professor name 2",
        numberOfStudents: 25,
        startDate: "2024-07-01",
        endDate: "2024-12-31",
      };
      const savedCourse = {
        ...MOCK_DATA,
        _id: new mongoose.Types.ObjectId(),
      };
      (Course.findById as jest.Mock).mockResolvedValue(savedCourse);

      const foundCourse = await courseRepo.findById(
        savedCourse._id.toHexString()
      );

      expect(foundCourse).toBeDefined();
      expect(foundCourse?.Name).toEqual(MOCK_DATA.Name);
      expect(foundCourse?._id.toHexString()).toEqual(
        savedCourse._id.toHexString()
      );
      expect(Course.findById).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if the course ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000";
      (Course.findById as jest.Mock).mockResolvedValue(null);

      await expect(courseRepo.findById(INVALID_ID)).rejects.toThrow(
        "Course Not Found"
      );
    });
  });
});
