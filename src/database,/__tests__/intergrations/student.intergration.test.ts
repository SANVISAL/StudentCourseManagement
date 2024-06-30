import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import StudentRepository from "../../repository/student.repository"; // Adjust the path to your repository
import { Student } from "../../model/student.model"; // Adjust the path to your Student model
import {
  ICreateStudent,
  IUpdateStudent,
} from "../../repository/@types/student.repository.type"; // Adjust the path to your interfaces

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

describe("Student repository integration test", () => {
  let studentRepo: StudentRepository;

  beforeEach(() => {
    studentRepo = new StudentRepository();
  });

  afterEach(async () => {
    await Student.deleteMany({});
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

      const newStudent = await studentRepo.createStudent(MOCK_DATA);
      expect(newStudent).toBeDefined();
      expect(newStudent.data.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
      expect(newStudent.data.phoneNumber).toEqual(MOCK_DATA.phoneNumber);

      // Check if student profile exists in database
      const foundStudent = await Student.findById(newStudent.data._id);
      expect(foundStudent).toBeDefined();
      expect(foundStudent?.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
    });

    test("should not create a student with existing phone number", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "John Doe",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "1234567890",
      };

      await studentRepo.createStudent(MOCK_DATA);

      await expect(studentRepo.createStudent(MOCK_DATA)).rejects.toThrow(
        "Student Already Exist"
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
          gender: "Male",
          phoneNumber: "0987654321",
        },
      ];

      // Insert mock data
      for (const data of MOCK_DATA) {
        await studentRepo.createStudent(data);
      }

      const students = await studentRepo.getAllStudnet();
      expect(students).toBeDefined();
      expect(students.length).toEqual(MOCK_DATA.length);
      expect(students[0].fullNameEn).toEqual(MOCK_DATA[0].fullNameEn);
      expect(students[1].fullNameEn).toEqual(MOCK_DATA[1].fullNameEn);
    });

    test("should throw an error if no students found", async () => {
      await expect(studentRepo.getAllStudnet()).rejects.toThrow(
        "Student Not Found"
      );
    });
  });
  describe("Update student profile", () => {
    test("should update an existing student profile in the database", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "Jane Smith",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "0987654321",
      };
      const createdStudent = await studentRepo.createStudent(MOCK_DATA);

      const UPDATE_DATA: IUpdateStudent = {
        fullNameEn: "San Visal",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "0987654321",
      };
      const updatedStudent = await studentRepo.updateStudent(
        createdStudent.data._id as string,
        UPDATE_DATA
      );

      expect(updatedStudent).toBeDefined();
      expect(updatedStudent?.fullNameEn).toEqual(UPDATE_DATA.fullNameEn);
      expect(updatedStudent?.phoneNumber).toEqual(UPDATE_DATA.phoneNumber);

      // Verify the student has been updated in the database
      const foundStudent = await Student.findById(createdStudent.data._id);
      expect(foundStudent).toBeDefined();
      expect(foundStudent?.fullNameEn).toEqual(UPDATE_DATA.fullNameEn);
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId
      const UPDATE_DATA: IUpdateStudent = {
        fullNameEn: "San Visal",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "0987654321",
      };

      await expect(
        studentRepo.updateStudent(INVALID_ID, UPDATE_DATA)
      ).rejects.toThrow("Invalid Student ID");
    });
  });
  describe("Delete student profile", () => {
    test("should delete an existing student profile in the database", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "Jane Smith",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "0987654321",
      };
      const createdStudent = await studentRepo.createStudent(MOCK_DATA);

      const deletedStudent = await studentRepo.deleteStudent(
        createdStudent.data._id as string
      );

      expect(deletedStudent).toBeDefined();
      expect(deletedStudent?.isDeleted).toEqual(true);
      expect(deletedStudent?.deletedAt).toBeDefined();

      // Verify the student has been marked as deleted in the database
      const foundStudent = await Student.findById(createdStudent.data._id);
      expect(foundStudent).toBeDefined();
      expect(foundStudent?.isDeleted).toEqual(true);
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId

      await expect(studentRepo.deleteStudent(INVALID_ID)).rejects.toThrow(
        "Invalid Student ID To Delete"
      );
    });
  });
  describe("Find student by name", () => {
    test("should find students by name in the database", async () => {
      const MOCK_DATA: ICreateStudent[] = [
        {
          fullNameEn: "Jane john",
          fullNameKh: "សាន​ វិសាល",
          dateOfBirth: "1990-01-01",
          gender: "Male",
          phoneNumber: "0987654320",
        },
        {
          fullNameEn: "Jane Smith",
          fullNameKh: "សាន​ វិសាល",
          dateOfBirth: "1990-01-01",
          gender: "Male",
          phoneNumber: "0987654321",
        },
        // Add other required fields
      ];

      // Insert mock data
      for (const data of MOCK_DATA) {
        await studentRepo.createStudent(data);
      }

      const searchName = "Jane Smith";
      const foundStudents = await studentRepo.findByName(searchName);

      expect(foundStudents).toBeDefined();
      expect(foundStudents.length).toEqual(1);
      expect(foundStudents[0].fullNameEn).toEqual(searchName);
    });

    test("should throw an error if no students found with the given name", async () => {
      const INVALID_NAME = "Nonexistent Name";

      await expect(studentRepo.findByName(INVALID_NAME)).rejects.toThrow(
        "Student Not Found"
      );
    });
  });
  describe("Find student by ID", () => {
    test("should find a student by ID in the database", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "Jane john",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "0987654320",
      };
      const createdStudent = await studentRepo.createStudent(MOCK_DATA);

      const foundStudent = await studentRepo.findById(
        createdStudent.data._id as string
      );

      expect(foundStudent).toBeDefined();
      expect(foundStudent?.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
      expect(foundStudent?._id as string).toEqual(
        createdStudent.data._id as string
      );
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId

      await expect(studentRepo.findById(INVALID_ID)).rejects.toThrow(
        "Student Not Found"
      );
    });
  });
});
