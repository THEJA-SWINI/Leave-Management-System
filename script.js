
const API_URL = "http://localhost:5000/leaves";

const leaveForm = document.getElementById("leaveForm");
const leaveTableBody = document.getElementById("leaveTableBody");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submitBtn");
const leaveIdInput = document.getElementById("leaveId");
const messageDiv = document.getElementById("message");


// Load leave requests when page opens
document.addEventListener("DOMContentLoaded", () => {
    getLeaves();
});


// Get all leave requests
async function getLeaves() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch leave requests");
        }

        const leaves = await response.json();

        displayLeaves(leaves);

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to load leave requests. Make sure the backend is running.",
            "error"
        );
    }
}


// Display leave requests in table
function displayLeaves(leaves) {

    leaveTableBody.innerHTML = "";

    if (leaves.length === 0) {

        leaveTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No leave requests found
                </td>
            </tr>
        `;

        return;
    }

    leaves.forEach((leave) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${leave.leave_id}</td>

            <td>${leave.employee_id}</td>

            <td>${leave.employee_name}</td>

            <td>${leave.leave_type}</td>

            <td>${formatDate(leave.from_date)}</td>

            <td>${formatDate(leave.to_date)}</td>

            <td>${leave.reason}</td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editLeave(${leave.leave_id})"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteLeave(${leave.leave_id})"
                >
                    Delete
                </button>

            </td>
        `;

        leaveTableBody.appendChild(row);
    });
}


// Add or update leave request
leaveForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const leaveId = leaveIdInput.value;

    const leaveData = {

        employee_id:
            document.getElementById("employeeId").value,

        employee_name:
            document.getElementById("employeeName").value,

        leave_type:
            document.getElementById("leaveType").value,

        from_date:
            document.getElementById("fromDate").value,

        to_date:
            document.getElementById("toDate").value,

        reason:
            document.getElementById("reason").value
    };


    // Validate dates
    if (leaveData.to_date < leaveData.from_date) {

        showMessage(
            "To date cannot be before From date",
            "error"
        );

        return;
    }


    try {

        let response;


        // Update existing leave
        if (leaveId) {

            response = await fetch(
                `${API_URL}/${leaveId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(leaveData)
                }
            );

        }


        // Add new leave
        else {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(leaveData)
                }
            );

        }


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Operation failed"
            );
        }


        showMessage(
            result.message,
            "success"
        );


        resetForm();

        getLeaves();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );
    }

});


// Edit leave request
async function editLeave(id) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`
        );


        const leave = await response.json();


        if (!response.ok) {

            throw new Error(
                leave.message || "Failed to get leave"
            );
        }


        leaveIdInput.value =
            leave.leave_id;


        document.getElementById("employeeId").value =
            leave.employee_id;


        document.getElementById("employeeName").value =
            leave.employee_name;


        document.getElementById("leaveType").value =
            leave.leave_type;


        document.getElementById("fromDate").value =
            formatDateForInput(leave.from_date);


        document.getElementById("toDate").value =
            formatDateForInput(leave.to_date);


        document.getElementById("reason").value =
            leave.reason;


        formTitle.textContent =
            "Edit Leave Request";


        submitBtn.textContent =
            "Update Leave";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );
    }
}


// Delete leave request
async function deleteLeave(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this leave request?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const result = await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Failed to delete leave"
            );
        }


        showMessage(
            result.message,
            "success"
        );


        getLeaves();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );
    }
}


// Reset form
function resetForm() {

    leaveForm.reset();

    leaveIdInput.value = "";

    formTitle.textContent =
        "Add Leave Request";

    submitBtn.textContent =
        "Add Leave";
}


// Format date for display
function formatDate(date) {

    if (!date) {
        return "";
    }

    const dateString = date.toString();

    // MySQL DATE values normally arrive as YYYY-MM-DD
    // or sometimes as YYYY-MM-DDTHH:mm:ss...
    if (dateString.includes("T")) {
        return dateString.split("T")[0];
    }

    return dateString;
}


// Format date for input
function formatDateForInput(date) {

    if (!date) {
        return "";
    }

    const dateString = date.toString();

    if (dateString.includes("T")) {
        return dateString.split("T")[0];
    }

    return dateString;
}


// Show success/error message
function showMessage(message, type) {

    messageDiv.textContent = message;

    messageDiv.className =
        type === "success"
            ? "success-message"
            : "error-message";


    setTimeout(() => {

        messageDiv.textContent = "";

        messageDiv.className = "";

    }, 3000);
}

