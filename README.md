# Leave-Management-System

Objective
Build a simple full-stack application by connecting: Frontend + Backend + SQL Database

The application should allow an employee to submit, view, update, and delete leave requests.Technology
Frontend: HTML, CSS, JavaScript
Backend: Use the backend technology covered in the bootcamp
Database: MySQL
Requirements
1. Frontend
Create a Leave Request form with:
Employee ID
Employee Name
Leave Type
From Date
To Date
Reason
Display all submitted leave requests in a table.
The table should contain:
Leave ID
Employee ID
Employee Name
Leave Type
From Date
To Date
Reason
Actions
Provide:
Add
Edit
Delete
2. Backend
Create REST APIs for the following operations:
Method API Purpose
POST /leaves --> Add a leave request
GET /leaves  --> Get all leave requests
GET/leaves/{id}  --> Get a leave request by ID
PUT /leaves/{id} --> Update a leave request
DELETE /leaves/{id} --> Delete a leave request

The backend should:
Receive data from the frontend
Validate the input
Execute SQL queries
Return an appropriate response to the frontend
3. SQL Database
Create a database and a leave_requests table.
Use appropriate:
Primary Key
NOT NULL
UNIQUE
CHECK constraints
Suitable data types
Insert some sample records for testing.
Implement SQL operations for:
INSERT
SELECT
UPDATE
DELETE
4. Integration
Connect all three layers:
Frontend → Backend → SQL Database
