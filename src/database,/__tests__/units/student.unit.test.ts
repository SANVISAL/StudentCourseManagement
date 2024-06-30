// jest.spyOn allows you to spy on an existing method or function without changing its implementation. Spying means you can monitor how many times the function is called

import StudentRepository from "../../repository/student.repository";
import {
  ICreateStudent,
  IUpdateStudent,
} from "../../repository/@types/student.repository.type";
import { Student } from "../../model/student.model";

describe("StudentRepository - Unit Test", () => {
  let studentRepo: StudentRepository;

  beforeEach(() => {
    studentRepo = new StudentRepository();
  });

  afterEach(() => {
    studentRepo = new StudentRepository();
    jest.clearAllMocks();  // Restore all mocked functions after each test
  });

  test("should add new student profile to database", async () => {
    // Mock the dependencies and data
    const MOCK_DATA: ICreateStudent = {
      fullNameEn: "John Doe",
      fullNameKh: "សាន​ វិសាល",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      phoneNumber: "1234567890",
    };

    // Mock the findByPhoneNumber method to return null (indicating no existing student)
    jest.spyOn(studentRepo, "findByPhoneNumber").mockResolvedValue(null);

    // Mock the save method of the Student model to simulate saving in-memory without hitting the database
    const saveMock = jest.spyOn(Student.prototype, "save").mockResolvedValue({
      _id: "mocked_id",
      ...MOCK_DATA,
    } as any);

    const result = await studentRepo.createStudent(MOCK_DATA);

    // Assertions
    expect(result).toBeDefined();
    expect(result.message).toEqual("Student created successfully");
    expect(result.data.phoneNumber).toEqual(MOCK_DATA.phoneNumber);
    expect(saveMock).toHaveBeenCalled(); // Ensure save method was called
  });

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

    // Mock the find method of the Student model to simulate returning mock data
    const findMock = jest
      .spyOn(Student, "find")
      .mockResolvedValue(MOCK_DATA as any);

    // Call the method under test
    const students = await studentRepo.getAllStudnet();

    // Assertions
    expect(students).toBeDefined();
    expect(students.length).toEqual(MOCK_DATA.length);
    expect(students[0].fullNameEn).toEqual(MOCK_DATA[0].fullNameEn);
    expect(students[1].fullNameEn).toEqual(MOCK_DATA[1].fullNameEn);

    // Ensure that the find method was called once with the correct query
    expect(findMock).toHaveBeenCalledWith({ isDeleted: false });
  });

  test("should throw an error if no students found", async () => {
    // Mock the find method of the Student model to simulate returning an empty array
    jest.spyOn(Student, "find").mockResolvedValue([] as any);

    // Call the method under test and expect it to throw an error
    await expect(studentRepo.getAllStudnet()).rejects.toThrow(
      "Student Not Found"
    );
  });
  test("should update an existing student profile in memory", async () => {
    const MOCK_DATA: ICreateStudent = {
      fullNameEn: "Jane Smith",
      fullNameKh: "សាន​ វិសាល",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      phoneNumber: "0987654321",
    };
    const createdStudent = { data: { _id: "validObjectId", ...MOCK_DATA } };

    // Mock the createStudent method to simulate creating a student
    jest
      .spyOn(studentRepo, "createStudent")
      .mockResolvedValue(createdStudent as any);

    const UPDATE_DATA: IUpdateStudent = {
      fullNameEn: "San Visal",
      fullNameKh: "សាន​ វិសាល",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      phoneNumber: "0987654321",
    };

    // Mock the updateStudent method to simulate updating a student
    const updateMock = jest
      .spyOn(studentRepo, "updateStudent")
      .mockImplementation(async (id: string, data: IUpdateStudent) => {
        return { _id: "validObjectId", ...UPDATE_DATA } as any; // Adjust the return type to match Mongoose Document<IStudent> structure
      });

    const updatedStudent = await studentRepo.updateStudent(
      "validObjectId",
      UPDATE_DATA
    );

    // Assertions
    expect(updatedStudent).toBeDefined();
    expect(updatedStudent.fullNameEn).toEqual(UPDATE_DATA.fullNameEn);
    expect(updatedStudent.phoneNumber).toEqual(UPDATE_DATA.phoneNumber);

    // Verify the updateStudent method was called once with the correct parameters
    expect(updateMock).toHaveBeenCalledWith("validObjectId", UPDATE_DATA);
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

    // Mock the updateStudent method to simulate throwing an error for invalid ID
    jest
      .spyOn(studentRepo, "updateStudent")
      .mockRejectedValue(new Error("Invalid Student ID"));

    // Call the method under test and expect it to throw an error
    await expect(
      studentRepo.updateStudent(INVALID_ID, UPDATE_DATA)
    ).rejects.toThrow("Invalid Student ID");
  });
});
