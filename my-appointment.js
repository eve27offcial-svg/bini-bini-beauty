// BINIBINI CUSTOMER APPOINTMENT STATUS

const user = JSON.parse(
    sessionStorage.getItem("biniUser") || "null"
);

const content = document.getElementById("appointment-content");


// ===============================
// CANCEL APPOINTMENT
// ===============================

function cancelAppointment(bookingNumber) {

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

    const booking = bookings[index];


    // ==========================================
    // 48-HOUR CANCELLATION RULE
    // ==========================================

    /*
        Convert the appointment date + time
        into a JavaScript Date.
    */

    const appointmentDateTime =
        parseAppointmentDateTime(
            booking.date,
            booking.time
        );

    if (!appointmentDateTime) {

        alert(
            "We could not determine your appointment date and time."
        );

        return;
    }


    const currentDateTime = new Date();

    const timeDifference =
        appointmentDateTime.getTime() -
        currentDateTime.getTime();

    const hoursRemaining =
        timeDifference / (1000 * 60 * 60);


    // Cancellation is NOT allowed
    // when less than 48 hours remain.

    if (hoursRemaining < 48) {

        alert(
            "Cancellation is no longer available.\n\n" +
            "Appointments can only be cancelled at least " +
            "48 hours before the scheduled appointment time."
        );

        return;
    }


    // ==========================================
    // CONFIRM CANCELLATION
    // ==========================================

    const confirmCancel = confirm(
        "Are you sure you want to cancel your appointment?\n\n" +
        "Your appointment will be marked as Cancelled."
    );

    if (!confirmCancel) {
        return;
    }


    // ==========================================
    // UPDATE CUSTOMER APPOINTMENT
    // ==========================================

    bookings[index].status = "Cancelled";

    bookings[index].cancelledAt =
        new Date().toISOString();

    bookings[index].cancelledBy = "Customer";


    localStorage.setItem(
        "biniAppointments",
        JSON.stringify(bookings)
    );


    // ==========================================
    // UPDATE ADMIN BOOKING
    // ==========================================

    const adminBookings = JSON.parse(
        localStorage.getItem("binibiniBookings") || "[]"
    );


    const adminIndex = adminBookings.findIndex(
        booking =>
            booking.bookingNumber === bookingNumber
    );


    if (adminIndex !== -1) {

        adminBookings[adminIndex].status =
            "Cancelled";

        adminBookings[adminIndex].cancelledAt =
            new Date().toISOString();

        adminBookings[adminIndex].cancelledBy =
            "Customer";

        adminBookings[adminIndex].notification =
            "Customer cancelled this appointment.";

        adminBookings[adminIndex].notificationRead =
            false;
    }


    localStorage.setItem(
        "binibiniBookings",
        JSON.stringify(adminBookings)
    );


    alert(
        "Your appointment has been cancelled successfully.\n\n" +
        "BINIBINI has been notified of the cancellation."
    );


    // Reload appointment page
    location.reload();
}


// ==========================================
// CONVERT APPOINTMENT DATE + TIME
// ==========================================

function parseAppointmentDateTime(dateString, timeString) {

    if (!dateString || !timeString) {
        return null;
    }


    /*
        Handles dates such as:
        2026-11-25

        and times such as:
        2:00 PM
        02:00 PM
        14:00
    */

    let datePart = dateString.trim();
    let timePart = timeString.trim();


    // If date is already YYYY-MM-DD
    // use it directly.

    let date = new Date(`${datePart} ${timePart}`);


    // Try YYYY-MM-DD explicitly if needed
    if (isNaN(date.getTime())) {

        const parts = datePart.split("-");

        if (parts.length === 3) {

            const year = Number(parts[0]);
            const month = Number(parts[1]) - 1;
            const day = Number(parts[2]);

            date = new Date(
                year,
                month,
                day
            );

            const convertedTime =
                convertTimeTo24Hour(timePart);

            if (convertedTime) {

                date.setHours(
                    convertedTime.hours,
                    convertedTime.minutes,
                    0,
                    0
                );
            }
        }
    }


    return isNaN(date.getTime())
        ? null
        : date;
}


// ==========================================
// CONVERT TIME TO 24-HOUR FORMAT
// ==========================================

function convertTimeTo24Hour(timeString) {

    const match = timeString.match(
        /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (!match) {
        return null;
    }


    let hours =
        Number(match[1]);

    const minutes =
        Number(match[2]);

    const period =
        match[3].toUpperCase();


    if (period === "PM" && hours !== 12) {
        hours += 12;
    }

    if (period === "AM" && hours === 12) {
        hours = 0;
    }


    return {
        hours: hours,
        minutes: minutes
    };
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

        const status =
            booking.status || "Pending";


        let statusClass =
            "status-pending";


        let message =
            "Your appointment is waiting for confirmation from BINIBINI.";


        // ===============================
        // CONFIRMED
        // ===============================

        if (status === "Confirmed") {

            statusClass =
                "status-confirmed";

            message =
                "Your appointment has been confirmed by BINIBINI. We look forward to seeing you!";
        }


        // ===============================
        // CANCELLED
        // ===============================

        else if (status === "Cancelled") {

            statusClass =
                "status-cancelled";

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