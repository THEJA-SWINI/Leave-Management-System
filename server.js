const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.send("Leave Management Backend is running");
});


// CREATE - Add Leave
app.post("/leaves", (req, res) => {

    const {
        employee_id,
        employee_name,
        leave_type,
        from_date,
        to_date,
        reason
    } = req.body;

    if (
        !employee_id ||
        !employee_name ||
        !leave_type ||
        !from_date ||
        !to_date ||
        !reason
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (to_date < from_date) {
        return res.status(400).json({
            message: "To date cannot be before From date"
        });
    }

    const sql = `
        INSERT INTO leave_requests
        (
            employee_id,
            employee_name,
            leave_type,
            from_date,
            to_date,
            reason
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        employee_id,
        employee_name,
        leave_type,
        from_date,
        to_date,
        reason
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to add leave request",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Leave request added successfully",
            leave_id: result.insertId
        });
    });
});


// READ - Get All Leaves
app.get("/leaves", (req, res) => {

    const sql = `
        SELECT *
        FROM leave_requests
        ORDER BY leave_id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch leave requests",
                error: err.message
            });
        }

        res.status(200).json(results);
    });
});


// READ - Get One Leave
app.get("/leaves/:id", (req, res) => {

    const leaveId = req.params.id;

    const sql = `
        SELECT *
        FROM leave_requests
        WHERE leave_id = ?
    `;

    db.query(sql, [leaveId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch leave request",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json(results[0]);
    });
});


// UPDATE - Edit Leave
app.put("/leaves/:id", (req, res) => {

    const leaveId = req.params.id;

    const {
        employee_id,
        employee_name,
        leave_type,
        from_date,
        to_date,
        reason
    } = req.body;

    if (
        !employee_id ||
        !employee_name ||
        !leave_type ||
        !from_date ||
        !to_date ||
        !reason
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (to_date < from_date) {
        return res.status(400).json({
            message: "To date cannot be before From date"
        });
    }

    const sql = `
        UPDATE leave_requests
        SET
            employee_id = ?,
            employee_name = ?,
            leave_type = ?,
            from_date = ?,
            to_date = ?,
            reason = ?
        WHERE leave_id = ?
    `;

    const values = [
        employee_id,
        employee_name,
        leave_type,
        from_date,
        to_date,
        reason,
        leaveId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to update leave request",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave request updated successfully"
        });
    });
});


// DELETE - Delete Leave
app.delete("/leaves/:id", (req, res) => {

    const leaveId = req.params.id;

    const sql = `
        DELETE FROM leave_requests
        WHERE leave_id = ?
    `;

    db.query(sql, [leaveId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to delete leave request",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave request deleted successfully"
        });
    });
});


// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});