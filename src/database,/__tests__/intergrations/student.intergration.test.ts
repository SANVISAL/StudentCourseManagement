import StudentRepository from "../../repository/student.repository"; // Adjust the path to your repository
import { Student } from "../../model/student.model"; // Adjust the path to your Student model
import {
  ICreateStudent,
  IUpdateStudent,
} from "../../repository/@types/student.repository.type"; // Adjust the path to your interfaces
// import DuplicateError from "../../../errors/duplicate-error";

jest.mock("../../model/student.model");

describe("Student repository unit test", () => {
  let studentRepo: StudentRepository;

  beforeEach(() => {
    studentRepo = new StudentRepository();
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

      const savedStudent = {
        ...MOCK_DATA,
        _id: "some-id",
      };

      (Student.prototype.save as jest.Mock).mockResolvedValue(savedStudent);

      const newStudent = await studentRepo.createStudent(MOCK_DATA);

      expect(newStudent).toBeDefined();
      expect(newStudent.data.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
      expect(newStudent.data.phoneNumber).toEqual(MOCK_DATA.phoneNumber);
      expect(Student.prototype.save).toHaveBeenCalledTimes(1);
    });

    test("should not create a student with existing phone number", async () => {
      const MOCK_DATA: ICreateStudent = {
        fullNameEn: "John Doe",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "1234567890",
      };

      (Student.findOne as jest.Mock).mockResolvedValue(MOCK_DATA);

      await expect(studentRepo.createStudent(MOCK_DATA)).rejects.toThrow(
        "Student Already Exist"
      );
    });
  });

  // describe('createStudent', () => {
  //   test('should add new student profile to database', async () => {
  //     const MOCK_DATA: ICreateStudent = {
  //       fullNameEn: 'John Doe',
  //       fullNameKh: 'សាន​ វិសាល',
  //       dateOfBirth: '1990-01-01',
  //       gender: 'Male',
  //       phoneNumber: '1234567890',
  //     };

  //     const result = await studentRepo.createStudent(MOCK_DATA);

  //     expect(result).toBeDefined();
  //     expect(result.message).toEqual('Student created successfully');
  //     expect(result.data.phoneNumber).toEqual(MOCK_DATA.phoneNumber);

  //     const studentInDb = await Student.findOne({ phoneNumber: MOCK_DATA.phoneNumber });
  //     expect(studentInDb).not.toBeNull();
  //     expect(studentInDb.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
  //   });

  //   test('should not create a student with existing phone number', async () => {
  //     const MOCK_DATA: ICreateStudent = {
  //       fullNameEn: 'John Doe',
  //       fullNameKh: 'សាន​ វិសាល',
  //       dateOfBirth: '1990-01-01',
  //       gender: 'Male',
  //       phoneNumber: '1234567890',
  //     };

  //     // Pre-insert a student with the same phone number
  //     const existingStudent = new Student(MOCK_DATA);
  //     await existingStudent.save();

  //     await expect(studentRepo.createStudent(MOCK_DATA)).rejects.toThrow(DuplicateError);

  //     const studentCount = await Student.countDocuments({ phoneNumber: MOCK_DATA.phoneNumber });
  //     expect(studentCount).toBe(1); // Ensure only one student exists with the given phone number
  //   });
  // });

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

      (Student.find as jest.Mock).mockResolvedValue(MOCK_DATA);

      const students = await studentRepo.getAllStudnet();

      expect(students).toBeDefined();
      expect(students.length).toEqual(MOCK_DATA.length);
      expect(students[0].fullNameEn).toEqual(MOCK_DATA[0].fullNameEn);
      expect(students[1].fullNameEn).toEqual(MOCK_DATA[1].fullNameEn);
    });

    test("should throw an error if no students found", async () => {
      (Student.find as jest.Mock).mockResolvedValue([]);

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
      const savedStudent = {
        ...MOCK_DATA,
        _id: "some-id",
      };

      (Student.findById as jest.Mock).mockResolvedValue(savedStudent);
      (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...savedStudent,
        fullNameEn: "San Visal",
      });

      const UPDATE_DATA: IUpdateStudent = {
        fullNameEn: "San Visal",
        fullNameKh: "សាន​ វិសាល",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        phoneNumber: "0987654321",
      };

      const updatedStudent = await studentRepo.updateStudent(
        savedStudent._id as string,
        UPDATE_DATA
      );

      expect(updatedStudent).toBeDefined();
      expect(updatedStudent?.fullNameEn).toEqual(UPDATE_DATA.fullNameEn);
      expect(updatedStudent?.phoneNumber).toEqual(UPDATE_DATA.phoneNumber);
      expect(Student.findByIdAndUpdate).toHaveBeenCalledTimes(1);
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

      (Student.findById as jest.Mock).mockResolvedValue(null);

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
      const savedStudent = {
        ...MOCK_DATA,
        _id: "some-id",
        isDeleted: false,
      };

      (Student.findById as jest.Mock).mockResolvedValue(savedStudent);
      (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...savedStudent,
        isDeleted: true,
        deletedAt: new Date(),
      });

      const deletedStudent = await studentRepo.deleteStudent(
        savedStudent._id as string
      );

      expect(deletedStudent).toBeDefined();
      expect(deletedStudent?.isDeleted).toEqual(true);
      expect(deletedStudent?.deletedAt).toBeDefined();
      expect(Student.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId

      (Student.findById as jest.Mock).mockResolvedValue(null);

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
      ];

      (Student.find as jest.Mock).mockResolvedValue(MOCK_DATA);

      const searchName = "Jane Smith";
      const foundStudents = await studentRepo.findByName(searchName);

      expect(foundStudents).toBeDefined();
      expect(foundStudents.length).toEqual(1);
      expect(foundStudents[0].fullNameEn).toEqual(searchName);
      expect(Student.find).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if no students found with the given name", async () => {
      const INVALID_NAME = "Nonexistent Name";

      (Student.find as jest.Mock).mockResolvedValue([]);

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
      const savedStudent = {
        ...MOCK_DATA,
        _id: "some-id",
      };

      (Student.findById as jest.Mock).mockResolvedValue(savedStudent);

      const foundStudent = await studentRepo.findById(
        savedStudent._id as string
      );

      expect(foundStudent).toBeDefined();
      expect(foundStudent?.fullNameEn).toEqual(MOCK_DATA.fullNameEn);
      expect(foundStudent?._id as string).toEqual(savedStudent._id as string);
      expect(Student.findById).toHaveBeenCalledTimes(1);
    });

    test("should throw an error if the student ID does not exist", async () => {
      const INVALID_ID = "000000000000000000000000"; // An invalid ObjectId

      (Student.findById as jest.Mock).mockResolvedValue(null);

      await expect(studentRepo.findById(INVALID_ID)).rejects.toThrow(
        "Student Not Found"
      );
    });
  });
});
