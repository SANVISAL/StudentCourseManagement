import StudentRepository from "../../repository/student.repository"; // Adjust the path to your repository
import { Student } from "../../model/student.model"; // Adjust the path to your Student model
import {
  ICreateStudent,
  IUpdateStudent,
} from "../../repository/@types/student.repository.type"; // Adjust the path to your interfaces
import DuplicateError from "../../../errors/duplicate-error";
import { ApiError, NotFoundError } from "../../../errors/api-error";
// Mocking Mongoose methods
import mongoose from "mongoose";
jest.mock("../../model/student.model");

describe("Student repository unit test", () => {
  let studentRepo: StudentRepository;

  beforeEach(() => {
    studentRepo = new StudentRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create student profile", () => {
    test("should add new student profile to database", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "John Doe",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "1234567890",
      };

      (Student.create as jest.Mock).mockResolvedValue(MOCK_DATA);

      const newStudent = await studentRepo.createStudent(MOCK_DATA);
      

      expect(newStudent).toBeDefined();
      expect(newStudent.data.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
      expect(newStudent.data.phoneNumber).toEqual(MOCK_DATA.phoneNumber);
    });

    test("should not create a student with existing phone number", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "John Doe",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "1234567890",
      };

      (Student.create as jest.Mock).mockImplementation(() => {
        throw new DuplicateError("Duplicate entry");
      });

      await expect(studentRepo.createStudent(MOCK_DATA)).rejects.toThrow(
        ApiError
      );
    });
  });

  describe("Get all students", () => {
    test("should return all students from database", async () => {
      const MOCK_DATA: ICreateStudent[] = [
        {
          fullNameEn: "John Doe",
          fullNameKh: "សាន​ វិសាល",
          dateOfBirth: "1990-01-01",
          gender: "Male",
          phoneNumber: "1234567890",
        },
        {
          fullNameEn: "Jane Smith",
          fullNameKh: "សាន​ វិសាល",
          dateOfBirth: "1990-01-01",
          gender: "Female",
          phoneNumber: "0987654321",
        },
      ];

      (Student.find as jest.Mock).mockResolvedValue(MOCK_DATA);

      const students = await studentRepo.getAllStudents();

      expect(students).toBeDefined();
      expect(students.length).toEqual(MOCK_DATA.length);
      expect(students[0].fullNameEn).toEqual(MOCK_DATA[0].fullNameEn);
      expect(students[1].fullNameEn).toEqual(MOCK_DATA[1].fullNameEn);
    });

    test("should throw an error if no students found", async () => {
      (Student.find as jest.Mock).mockResolvedValue([]);

      await expect(studentRepo.getAllStudents()).rejects.toThrow(ApiError);
    });
  });

  describe("Update student profile", () => {
    test("should update an existing student profile in the database", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "Jane Smith",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Female",
        phoneNumber: "0987654321",
      };
      const savedStudent = new Student(MOCK_DATA);
      await savedStudent.save();

      const UPDATE_DATA: IUpdateStudent = {
        fullNameEn: "San Visal",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Female",
        phoneNumber: "0987654321",
      };

      (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue(UPDATE_DATA);

      const updatedStudent = await studentRepo.updateStudent(
        savedStudent._id as string,
        UPDATE_DATA
      );

      expect(updatedStudent).toBeDefined();
      expect(updatedStudent.fullNameEn).toEqual(UPDATE_DATA.fullNameEn);
      expect(updatedStudent.phoneNumber).toEqual(UPDATE_DATA.phoneNumber);
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = new mongoose.Types.ObjectId().toHexString();
      const UPDATE_DATA: IUpdateStudent = {
        fullNameEn: "San Visal",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Female",
        phoneNumber: "0987654321",
      };

      (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        studentRepo.updateStudent(INVALID_ID, UPDATE_DATA)
      ).rejects.toThrow(ApiError);
    });
  });

  describe("Delete student profile", () => {
    test("should delete an existing student profile in the database", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "Jane Smith",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Female",
        phoneNumber: "0987654321",
      };
      const savedStudent = new Student(MOCK_DATA);
      await savedStudent.save();

      const deletedStudent = {
        ...MOCK_DATA,
        isDeleted: true,
        deletedAt: new Date(),
      };
      (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        deletedStudent
      );

      const result = await studentRepo.deleteStudent(
        savedStudent._id as string
      );

      expect(result).toBeDefined();
      expect(result.isDeleted).toEqual(true);
      expect(result.deletedAt).toBeDefined();
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = new mongoose.Types.ObjectId().toHexString();

      (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(studentRepo.deleteStudent(INVALID_ID)).rejects.toThrow(
        ApiError
      );
    });
  });

  describe("Find student by name", () => {
    test("should find students by name in the database", async () => {
      const MOCK_DATA: ICreateStudent[] = [
        {
          fullNameEn: "Jane John",
          fullNameKh: "សាន​ វិសាល",
          dateOfBirth: "1990-01-01",
          gender: "Female",
          phoneNumber: "0987654320",
        },
        {
          fullNameEn: "Jane Smith",
          fullNameKh: "សាន​ វិសាល",
          dateOfBirth: "1990-01-01",
          gender: "Female",
          phoneNumber: "0987654321",
        },
      ];

      (Student.find as jest.Mock).mockResolvedValue([MOCK_DATA[1]]);

      const searchName = "Jane Smith";
      const foundStudents = await studentRepo.findByName(searchName);

      expect(foundStudents).toBeDefined();
      expect(foundStudents.length).toEqual(1);
      expect(foundStudents[0].fullNameEn).toEqual(searchName);
    });

    test("should throw an error if no students found with the given name", async () => {
      const INVALID_NAME = "Nonexistent Name";

      (Student.find as jest.Mock).mockResolvedValue([]);

      await expect(studentRepo.findByName(INVALID_NAME)).rejects.toThrow(
        ApiError
      );
    });
  });

  describe("Find student by ID", () => {
    test("should find a student by ID in the database", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "Jane John",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Female",
        phoneNumber: "0987654320",
      };
      const savedStudent = new Student(MOCK_DATA);
      await savedStudent.save();

      (Student.findById as jest.Mock).mockResolvedValue(savedStudent);

      const foundStudent = await studentRepo.findById(
        savedStudent._id as string
      );

      expect(foundStudent).toBeDefined();
      expect(foundStudent.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
      expect(foundStudent._id.toString()).toEqual(savedStudent._id.toString());
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = new mongoose.Types.ObjectId().toHexString();

      (Student.findById as jest.Mock).mockResolvedValue(null);

      await expect(studentRepo.findById(INVALID_ID)).rejects.toThrow(ApiError);
    });
  });
});
