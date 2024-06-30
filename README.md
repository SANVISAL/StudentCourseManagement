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
   - Limit number of students
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
  - Get All Students: [GET /v1/students](http://localhost:4000/v1/students)
  - Update a Student: [PUT /v1/students/{studentId}](http://localhost:4000/v1/students/667c4afc47df851a4411a633)
  - Delete a Student: [DELETE /v1/students/{studentId}](http://localhost:4000/v1/students/667d437e9504256c9369b0e0)

### Course API

- CRUD operations with soft delete
- Free-text search by Name
- Advanced search filter by start date and end date
- **Endpoint:** [GET /api/courses](#)

### Registration

- Register and remove courses for students
- **Endpoint:** [POST /api/students/{studentId}/courses/{courseId}](#)

### Reporting

- API endpoints to generate reports:
  - Course report: Course name, professor, start date, end date, limit number of students, number of registered students
  - Student report: Student full name, date of birth, gender, phone number, number of courses registered

---

## 🛠️ Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <https://github.com/SANVISAL/StudentCourseManagement.git>
   cd student-course-management
