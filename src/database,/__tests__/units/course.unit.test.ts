import CourseRepository from "../../repository/course.repository";
import { Course } from "../../model/course.model";
import {
  ICreateCourse,
  IUpdateCourse,
} from "../../repository/@types/course.repository.type";
import { ApiError } from "../../../errors/api-error";

jest.mock("../../model/course.model");

describe("CourseRepository Unit Tests", () => {
  const courseRepo = new CourseRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new course", async () => {
    const courseDetails: ICreateCourse = {
      Name: "Computer Science",
      professorName: "Dr. John Doe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 30,
    };

    (Course.create as jest.Mock).mockResolvedValue(courseDetails);

    const result = await courseRepo.createCourse(courseDetails);

    expect(result).toBeDefined();
    expect(result.data.Name).toBe(courseDetails.Name);
    expect(result.data.professorName).toBe(courseDetails.professorName);
  });

  test("should fail to create a course with missing required details", async () => {
    const courseDetails: Partial<ICreateCourse> = {
      professorName: "Dr. John Doe",
    };

    (Course.create as jest.Mock).mockRejectedValue(
      new ApiError("Missing required details", 400)
    );

    await expect(
      courseRepo.createCourse(courseDetails as ICreateCourse)
    ).rejects.toThrow(ApiError);
  });
  test("should fail to create a course if course.save() returns null", async () => {
    const courseDetails: ICreateCourse = {
      Name: "Computer Science",
      professorName: "Dr. John Doe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 30,
    };

    (Course.create as jest.Mock).mockResolvedValue({
      ...courseDetails,
      save: jest.fn().mockResolvedValue(null),
    });

    await expect(courseRepo.createCourse(courseDetails)).rejects.toThrow(
      "Course Creation Failed"
    );
  });

  test("should retrieve all courses", async () => {
    const mockCourses = [
      {
        Name: "Mathematics",
        professorName: "Prof. Jane Doe",
        startDate: "2024-09-01",
        endDate: "2025-06-30",
        numberOfStudents: 25,
      },
    ];

    (Course.find as jest.Mock).mockResolvedValue(mockCourses);

    const courses = await courseRepo.getAllCourses();

    expect(courses).toBeDefined();
    expect(courses.length).toBe(1);
    expect(courses[0].Name).toBe("Mathematics");
  });

  test("should update an existing course", async () => {
    const course = {
      Name: "Physics",
      professorName: "Prof. Richard Roe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 25,
    };

    const updatedDetails: IUpdateCourse = {
      Name: "Advanced Physics",
      professorName: "Prof. Richard Roe",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 25,
    };

    (Course.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedDetails);

    const updatedCourse = await courseRepo.updateCourse(
      "some-course-id",
      updatedDetails
    );

    expect(updatedCourse).toBeDefined();
    expect(updatedCourse.Name).toBe(updatedDetails.Name);
    expect(updatedCourse.numberOfStudents).toBe(
      updatedDetails.numberOfStudents
    );
  });

  test("should delete an existing course", async () => {
    const course = {
      Name: "Chemistry",
      professorName: "Prof. Sarah Smith",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 25,
      isDeleted: true,
    };

    (Course.findByIdAndUpdate as jest.Mock).mockResolvedValue(course);

    const deletedCourse = await courseRepo.deleteCourse("some-course-id");

    expect(deletedCourse).toBeDefined();
    expect(deletedCourse.isDeleted).toBe(true);
  });

  test("should find course by name", async () => {
    const mockCourses = [
      {
        Name: "Biology",
        professorName: "Prof. James Bond",
        startDate: "2024-09-01",
        endDate: "2025-06-30",
        numberOfStudents: 30,
      },
    ];

    (Course.find as jest.Mock).mockResolvedValue(mockCourses);

    const courses = await courseRepo.findByName("Biology");

    expect(courses).toBeDefined();
    expect(courses.length).toBe(1);
    expect(courses[0].Name).toBe("Biology");
  });

  test("should filter courses by start and end dates", async () => {
    const mockCourses = [
      {
        Name: "History",
        professorName: "Prof. Emily Clark",
        startDate: "2024-09-01",
        endDate: "2025-06-30",
        numberOfStudents: 30,
      },
    ];

    const filters = { startDate: "2024-09-01", endDate: "2025-06-30" };
    (Course.find as jest.Mock).mockResolvedValue(mockCourses);

    const courses = await courseRepo.filterStartDateByEndDate(filters);

    expect(courses).toBeDefined();
    expect(courses.length).toBe(1);
    expect(courses[0].Name).toBe("History");
  });

  test("should find course by ID", async () => {
    const course = {
      Name: "English",
      professorName: "Prof. George Martin",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      numberOfStudents: 30,
    };

    (Course.findById as jest.Mock).mockResolvedValue(course);

    const foundCourse = await courseRepo.findById("some-course-id");

    expect(foundCourse).toBeDefined();
    expect(foundCourse.Name).toBe("English");
  });
});
