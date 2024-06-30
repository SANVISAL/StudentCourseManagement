# 🎓 Student Course Management System

This project implements a **Student Course Management system** using **Express**, **Node.js**, **MongoDB**, and **Jest**. It provides APIs for managing students and courses, with features like search, registration, and reporting.

---

## 🚀 Tech Stack

- **Express**: Node.js web application framework
- **Node.js**: JavaScript runtime
- **MongoDB**: NoSQL database for storing student and course data
- **Jest**: JavaScript testing framework

---

## 📚 Database Design

### Collections

1. **Students**

   - Full name (both English and Khmer)
   - Date of birth
   - Gender
   - Phone number
   - Soft delete functionality

2. **Courses**
   - Name
   - Professor name
   - Number of students enrolled
   - Start date
   - End date
   - Soft delete functionality

### Relationships

- Students can register for multiple courses.
- Courses can have multiple registered students.

---

## ✨ Features

### Student API

- CRUD operations with soft delete
- Free-text search by Full name or phone number
- **Endpoints:**
  - Create a Student: [POST /v1/students](http://localhost:4000/v1/students)
    ```json
    {
      "fullNameEn": "John Doe",
      "fullNameKh": "ជួន ដេត",
      "dateOfBirth": "1995-08-15",
      "gender": "Male",
      "phoneNumber": "1234567890"
    }
    ```
  - Get All Students: [GET /v1/students](http://localhost:4000/v1/students)
    ```json
    [
      {
        "_id": "607f1f77bcf86cd799439011",
        "fullNameEn": "John Doe",
        "fullNameKh": "ជួន ដេត",
        "dateOfBirth": "1995-08-15",
        "gender": "Male",
        "phoneNumber": "1234567890",
        "isDeleted": false,
        "courses": []
      },
      {
        "_id": "607f1f77bcf86cd799439012",
        "fullNameEn": "Jane Smith",
        "fullNameKh": "ចិន ស្មុទ្រី",
        "dateOfBirth": "1998-05-20",
        "gender": "Female",
        "phoneNumber": "9876543210",
        "isDeleted": false,
        "courses": ["607f1f77bcf86cd799439021"]
      }
    ]
    ```
  - Update a Student: [PUT /v1/students/{studentId}](http://localhost:4000/v1/students/607f1f77bcf86cd799439011)
    ```json
    {
      "fullNameEn": "Updated John Doe",
      "phoneNumber": "1112223333"
    }
    ```
  - Delete a Student: [DELETE /v1/students/{studentId}](http://localhost:4000/v1/students/607f1f77bcf86cd799439011)

### Course API

- CRUD operations with soft delete
- Free-text search by Name
- Advanced search filter by start date and end date
- **Endpoints:**
  - Create a Course: [POST /v1/courses](http://localhost:4000/v1/courses)
    ```json
    {
      "Name": "Support Engineering",
      "professorName": "Dr. Smith",
      "numberOfStudents": 30,
      "startDate": "2024-09-01",
      "endDate": "2025-04-15"
    }
    ```
  - Get All Courses: [GET /v1/courses](http://localhost:4000/v1/courses)
    ```json
    [
      {
        "_id": "607f1f77bcf86cd799439021",
        "Name": "Support Engineering",
        "professorName": "Dr. Smith",
        "numberOfStudents": 30,
        "startDate": "2024-09-01",
        "endDate": "2025-04-15",
        "isDeleted": false
      },
      {
        "_id": "607f1f77bcf86cd799439022",
        "Name": "Database Management",
        "professorName": "Prof. Johnson",
        "numberOfStudents": 25,
        "startDate": "2024-10-01",
        "endDate": "2025-03-15",
        "isDeleted": false
      }
    ]
    ```
  - Update a Course: [PUT /v1/courses/{courseId}](http://localhost:4000/v1/courses/607f1f77bcf86cd799439021)
    ```json
    {
      "Name": "Updated Support Engineering",
      "endDate": "2025-04-30"
    }
    ```
  - Delete a Course: [DELETE /v1/courses/{courseId}](http://localhost:4000/v1/courses/607f1f77bcf86cd799439021)
  - Search by Name: [GET /v1/courses/search?name=Support](http://localhost:4000/v1/courses/search?name=Support)
  - Advanced search by dates: [GET /v1/courses/dates?startDate=2024-09-01&endDate=2025-04-15](http://localhost:4000/v1/courses/dates?startDate=2024-09-01&endDate=2025-04-15)

### Registration

- Register and remove courses for students
- **Endpoints:**
  - Register for a course: [POST /v1/students/{studentId}/courses/{courseId}](http://localhost:4000/v1/students/607f1f77bcf86cd799439011/courses/607f1f77bcf86cd799439021)
  - Remove from a course: [DELETE /v1/students/{studentId}/courses/{courseId}](http://localhost:4000/v1/students/607f1f77bcf86cd799439011/courses/607f1f77bcf86cd799439021)

### Reporting

- API endpoints to generate reports:
  - Course report: [GET /v1/courses/{courseId}/report](http://localhost:4000/v1/courses/607f1f77bcf86cd799439021/report)
    ```json
    {
      "courseName": "Support Engineering",
      "professorName": "Dr. Smith",
      "startDate": "2024-09-01",
      "endDate": "2025-04-15",
      "limitNumberOfStudents": 50,
      "registeredStudentsCount": 30
    }
    ```
  - Student report: [GET /v1/students/{studentId}/report](http://localhost:4000/v1/students/607f1f77bcf86cd799439011/report)
    ```json
    {
      "fullNameEn": "John Doe",
      "dateOfBirth": "1995-08-15",
      "gender": "Male",
      "phoneNumber": "1234567890",
      "numberOfCoursesRegistered": 1
    }
    ```

---

## 🛠️ Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <https://github.com/SANVISAL/StudentCourseManagement.git>
   cd student-course-management
   ```
2. **Unit testing and Intergration testing**:
   ```bash
   yarn test
   ```
