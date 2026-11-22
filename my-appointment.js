// BINIBINI CUSTOMER APPOINTMENT STATUS

const user = JSON.parse(
    sessionStorage.getItem("biniUser") || "null"
);

const content = document.getElementById("appointment-content");


// ===============================
// CANCEL APPOINTMENT
// ===============================

function cancelAppointment(bookingNumber) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel your appointment?\n\n" +
        "This action will mark your appointment as Cancelled."
    );

    if (!confirmCancel) {
        return;
    }

    // Get appointments
    const bookings = JSON.parse(
        localStorage.getItem("biniAppointments") || "[]"
    );

    // Find appointment
    const index = bookings.findIndex(
        booking =>
            booking.bookingNumber === bookingNumber &&
            booking.email === user.email
    );

    if (index === -1) {
        alert("Appointment could not be found.");
        return;
    }

    // Change status instead of deleting appointment
    bookings[index].status = "Cancelled";

    // Save updated appointments
    localStorage.setItem(
        "biniAppointments",
        JSON.stringify(bookings)
    );

    alert("Your appointment has been cancelled successfully.");

    // Reload appointment page
    location.reload();
}


// ===============================
// CHECK LOGIN
// ===============================

if (!user) {

    content.innerHTML = `
        <div class="status-card no-booking">

            <h2>Please Log In</h2>

            <p>
                Please log in to view your appointment status.
            </p>

            <a href="index.html" class="back-button">
                Back to Website
            </a>

        </div>
    `;

} else {

    // ===============================
    // GET SAVED APPOINTMENTS
    // ===============================

    const bookings = JSON.parse(
        localStorage.getItem("biniAppointments") || "[]"
    );

    // ===============================
    // FIND THIS CUSTOMER'S BOOKINGS
    // ===============================

    const customerBookings = bookings.filter(
        booking => booking.email === user.email
    );

    // ===============================
    // GET MOST RECENT BOOKING
    // ===============================

    const booking =
        customerBookings[customerBookings.length - 1];


    // ===============================
    // NO BOOKING
    // ===============================

    if (!booking) {

        content.innerHTML = `
            <div class="status-card no-booking">

                <h2>No Appointment Found</h2>

                <p>
                    You currently don't have an appointment.
                </p>

                <a href="booking.html" class="back-button">
                    Book an Appointment
                </a>

            </div>
        `;

    } else {

        const status = booking.status || "Pending";

        let statusClass = "status-pending";

        let message =
            "Your appointment is waiting for confirmation from BINIBINI.";


        // ===============================
        // CONFIRMED
        // ===============================

        if (status === "Confirmed") {

            statusClass = "status-confirmed";

            message =
                "Your appointment has been confirmed by BINIBINI. We look forward to seeing you!";

        }

        // ===============================
        // CANCELLED
        // ===============================

        else if (status === "Cancelled") {

            statusClass = "status-cancelled";

            message =
                "Your appointment has been cancelled. You may book a new appointment below.";

        }


        // ===============================
        // APPOINTMENT ACTION BUTTONS
        // ===============================

        let actionButtons = "";

        // Only show buttons if appointment
        // has NOT been cancelled
        if (status !== "Cancelled") {

            actionButtons = `

                <div class="appointment-actions">

                    <a href="booking.html"
                       class="rebook-button">

                        Rebook Appointment

                    </a>


                    <button
                        type="button"
                        class="cancel-button"
                        onclick="cancelAppointment('${booking.bookingNumber}')">

                        Cancel Appointment

                    </button>

                </div>

            `;
        }

        // If appointment is cancelled,
        // only show a booking button
        else {

            actionButtons = `

                <div class="appointment-actions">

                    <a href="booking.html"
                       class="rebook-button">

                        Book New Appointment

                    </a>

                </div>

            `;
        }


        // ===============================
        // DISPLAY APPOINTMENT
        // ===============================

        content.innerHTML = `

            <div class="status-card">

                <div class="status-header">

                    <p class="eyebrow">
                        BINIBINI BEAUTY LOUNGE
                    </p>

                    <h1>My Appointment</h1>

                    <p>
                        Check the current status of your booking.
                    </p>

                    <span class="status-badge ${statusClass}">
                        ${status.toUpperCase()}
                    </span>

                </div>


                <div class="appointment-details">

                    <div class="detail">
                        <label>Booking Number</label>

                        <span>
                            ${booking.bookingNumber || "N/A"}
                        </span>
                    </div>


                    <div class="detail">
                        <label>Customer</label>

                        <span>
                            ${booking.customer || booking.name || "N/A"}
                        </span>
                    </div>


                    <div class="detail">
                        <label>Service</label>

                        <span>
                            ${booking.service || "N/A"}
                        </span>
                    </div>


                    <div class="detail">
                        <label>Date</label>

                        <span>
                            ${booking.date || "N/A"}
                        </span>
                    </div>


                    <div class="detail">
                        <label>Time</label>

                        <span>
                            ${booking.time || "N/A"}
                        </span>
                    </div>


                    <div class="detail">
                        <label>Reservation Fee</label>

                        <span>
                            ₱${Number(booking.fee || 0).toFixed(2)}
                        </span>
                    </div>

                </div>


                <div class="message-box">
                    ${message}
                </div>


                ${actionButtons}

            </div>
        `;
    }
}