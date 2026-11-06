/* ==========================================
   BINIBINI ADMIN SYSTEM
========================================== */


/* ==========================================
   ADMIN LOGIN
========================================== */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "binibini123";


if (document.getElementById("admin-login-form")) {

    document
        .getElementById("admin-login-form")
        .addEventListener("submit", function (e) {

            e.preventDefault();

            const username =
                document
                .getElementById("admin-username")
                .value
                .trim();

            const password =
                document
                .getElementById("admin-password")
                .value;

            const error =
                document.getElementById("login-error");


            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {

                sessionStorage.setItem(
                    "binibiniAdmin",
                    "true"
                );

                window.location.href = "admin.html";

            } else {

                error.textContent =
                    "Incorrect username or password.";

            }

        });

}


/* ==========================================
   PROTECT ADMIN DASHBOARD
========================================== */

if (
    window.location.pathname.includes("admin.html")
) {

    const loggedIn =
        sessionStorage.getItem("binibiniAdmin");

    if (loggedIn !== "true") {

        window.location.href =
            "admin-login.html";

    }

}


/* ==========================================
   LOGOUT
========================================== */

function adminLogout() {

    sessionStorage.removeItem(
        "binibiniAdmin"
    );

    window.location.href =
        "admin-login.html";
}


/* ==========================================
   GET BOOKINGS
========================================== */

function getBookings() {

    return JSON.parse(
        localStorage.getItem("binibiniBookings")
        || "[]"
    );

}


/* ==========================================
   SAVE BOOKINGS
========================================== */

function saveBookings(bookings) {

    localStorage.setItem(
        "binibiniBookings",
        JSON.stringify(bookings)
    );

}


/* ==========================================
   UPDATE STATISTICS
========================================== */

function updateStatistics() {

    const bookings =
        getBookings();

    const total =
        bookings.length;

    const pending =
        bookings.filter(
            b => b.status === "Pending"
        ).length;

    const confirmed =
        bookings.filter(
            b => b.status === "Confirmed"
        ).length;

    const cancelled =
        bookings.filter(
            b => b.status === "Cancelled"
        ).length;


    document.getElementById(
        "total-bookings"
    ).textContent = total;


    document.getElementById(
        "pending-bookings"
    ).textContent = pending;


    document.getElementById(
        "confirmed-bookings"
    ).textContent = confirmed;


    document.getElementById(
        "cancelled-bookings"
    ).textContent = cancelled;

}


/* ==========================================
   RENDER BOOKINGS
========================================== */

function renderBookings() {

    const table =
        document.getElementById(
            "booking-table-body"
        );

    if (!table) return;


    let bookings =
        getBookings();


    const search =
        document.getElementById(
            "search-bookings"
        ).value
        .toLowerCase();


    const filter =
        document.getElementById(
            "status-filter"
        ).value;


    bookings =
        bookings.filter(function (booking) {

            const matchesSearch =

                (booking.name || "")
                .toLowerCase()
                .includes(search)

                ||

                (booking.service || "")
                .toLowerCase()
                .includes(search)

                ||

                (booking.contact || "")
                .toLowerCase()
                .includes(search);


            const matchesStatus =

                filter === "all"
                ||
                booking.status === filter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    table.innerHTML = "";


    const noBookings =
        document.getElementById(
            "no-bookings"
        );


    if (bookings.length === 0) {

        noBookings.style.display =
            "block";

        updateStatistics();

        return;

    }


    noBookings.style.display =
        "none";


    bookings.forEach(function (booking) {

        const row =
            document.createElement("tr");


        let statusClass =
            "status-pending";


        if (booking.status === "Confirmed") {

            statusClass =
                "status-confirmed";

        }

        if (booking.status === "Cancelled") {

            statusClass =
                "status-cancelled";

        }


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(booking.name || "")}
                </strong>
            </td>

            <td>
                ${escapeHTML(booking.contact || "")}
            </td>

            <td>
                ${escapeHTML(booking.service || "")}
            </td>

            <td>
                ${escapeHTML(booking.date || "")}
            </td>

            <td>
                ${escapeHTML(booking.time || "")}
            </td>

            <td>

                <span class="status ${statusClass}">
                    ${escapeHTML(booking.status || "Pending")}
                </span>

            </td>

            <td>

                <div class="action-buttons">

                    ${
                        booking.status !== "Confirmed"
                        ?
                        `<button
                            class="confirm-btn"
                            onclick="updateBookingStatus('${booking.id}', 'Confirmed')">
                            Confirm
                        </button>`
                        :
                        ""
                    }


                    ${
                        booking.status !== "Cancelled"
                        ?
                        `<button
                            class="cancel-btn"
                            onclick="updateBookingStatus('${booking.id}', 'Cancelled')">
                            Cancel
                        </button>`
                        :
                        ""
                    }


                    <button
                        class="edit-btn"
                        onclick="openEditModal('${booking.id}')">
                        Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteBooking('${booking.id}')">
                        Delete
                    </button>

                </div>

            </td>

        `;


        table.appendChild(row);

    });


    updateStatistics();

}


/* ==========================================
   UPDATE STATUS
========================================== */

function updateBookingStatus(id, status) {

    let bookings = JSON.parse(
        localStorage.getItem("binibiniBookings") || "[]"
    );

    // Convert both IDs to strings so number/string differences
    // don't cause "Booking not found"
    const booking = bookings.find(
        b => String(b.id) === String(id)
    );

    if (!booking) {
        alert("Booking not found.");
        return;
    }

    // Update admin booking status
    booking.status = status;

    localStorage.setItem(
        "binibiniBookings",
        JSON.stringify(bookings)
    );

    // Update the customer's booking record too
    let customerBookings = JSON.parse(
        localStorage.getItem("biniAppointments") || "[]"
    );

    const customerBooking = customerBookings.find(b =>
        String(b.id) === String(booking.id) ||
        String(b.bookingNumber) === String(booking.bookingNumber)
    );

    if (customerBooking) {
        customerBooking.status = status;

        localStorage.setItem(
            "biniAppointments",
            JSON.stringify(customerBookings)
        );
    }

    renderBookings();

    alert(
        `Booking ${status.toLowerCase()} successfully.`
    );
}


/* ==========================================
   DELETE BOOKING
========================================== */

function deleteBooking(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this booking?"
        );


    if (!confirmDelete) return;


    let bookings =
        getBookings();


    bookings =
        bookings.filter(
            b => String(b.id) !== String(id)
        );


    saveBookings(bookings);

    renderBookings();

}


/* ==========================================
   EDIT BOOKING
========================================== */

function openEditModal(id) {

    const bookings =
        getBookings();


    const booking =
        bookings.find(
            b => String(b.id) === String(id)
        );


    if (!booking) return;


    document.getElementById(
        "edit-id"
    ).value =
        booking.id;


    document.getElementById(
        "edit-name"
    ).value =
        booking.name || "";


    document.getElementById(
        "edit-contact"
    ).value =
        booking.contact || "";


    document.getElementById(
        "edit-service"
    ).value =
        booking.service || "";


    document.getElementById(
        "edit-date"
    ).value =
        booking.date || "";


    document.getElementById(
        "edit-time"
    ).value =
        booking.time || "";


    document.getElementById(
        "edit-status"
    ).value =
        booking.status || "Pending";


    document.getElementById(
        "edit-modal"
    ).classList.add("show");

}


function closeEditModal() {

    document.getElementById(
        "edit-modal"
    ).classList.remove("show");

}


/* ==========================================
   SAVE EDITED BOOKING
========================================== */

if (
    document.getElementById(
        "edit-booking-form"
    )
) {

    document.getElementById(
        "edit-booking-form"
    ).addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const id =
                document.getElementById(
                    "edit-id"
                ).value;


            const bookings =
                getBookings();


            const booking =
                bookings.find(
                    b =>
                        String(b.id)
                        ===
                        String(id)
                );


            if (!booking) return;


            booking.name =
                document.getElementById(
                    "edit-name"
                ).value.trim();


            booking.contact =
                document.getElementById(
                    "edit-contact"
                ).value.trim();


            booking.service =
                document.getElementById(
                    "edit-service"
                ).value.trim();


            booking.date =
                document.getElementById(
                    "edit-date"
                ).value;


            booking.time =
                document.getElementById(
                    "edit-time"
                ).value;


            booking.status =
                document.getElementById(
                    "edit-status"
                ).value;


            saveBookings(bookings);

            closeEditModal();

            renderBookings();

            alert(
                "Booking successfully updated."
            );

        }
    );

}


/* ==========================================
   HTML SECURITY
========================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   LOAD DASHBOARD
========================================== */

if (
    window.location.pathname.includes(
        "admin.html"
    )
) {

    renderBookings();

}/* ==========================================
   ADMIN APPOINTMENT CALENDAR
========================================== */

let calendarDate = new Date(2026, 10, 1);
let selectedCalendarDate = "";

function getAdminBookings() {
    return JSON.parse(
        localStorage.getItem("binibiniBookings") || "[]"
    );
}

function normalizeStatus(status) {
    return String(status || "Pending").toLowerCase();
}

function renderAdminCalendar() {

    const calendar = document.getElementById("admin-calendar");
    const monthYear = document.getElementById("calendar-month-year");

    if (!calendar || !monthYear) return;

    calendar.innerHTML = "";

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthYear.textContent = calendarDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const bookings = getAdminBookings();

    // Empty spaces before first day
    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");

        empty.className = "calendar-day empty";

        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const dayBookings = bookings.filter(
            booking => booking.date === dateString
        );

        const dayBox = document.createElement("div");

        dayBox.className = "calendar-day";

        if (dateString === selectedCalendarDate) {
            dayBox.classList.add("selected");
        }

        const today = new Date();

        const todayString =
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        if (dateString === todayString) {
            dayBox.classList.add("today");
        }

        const number = document.createElement("div");

        number.className = "calendar-number";

        number.textContent = day;

        dayBox.appendChild(number);

        // Show appointments
        dayBookings.slice(0, 3).forEach(booking => {

            const appointment = document.createElement("div");

            appointment.className =
                `calendar-booking ${normalizeStatus(booking.status)}`;

            appointment.textContent =
                `${booking.time} • ${booking.name}`;

            appointment.title =
                `${booking.time} - ${booking.name} - ${booking.service}`;

            dayBox.appendChild(appointment);
        });

        if (dayBookings.length > 3) {

            const more = document.createElement("div");

            more.className = "calendar-more";

            more.textContent =
                `+${dayBookings.length - 3} more`;

            dayBox.appendChild(more);
        }

        dayBox.onclick = () => {

            selectedCalendarDate = dateString;

            renderAdminCalendar();

            showCalendarAppointments(
                dateString,
                dayBookings
            );
        };

        calendar.appendChild(dayBox);
    }

    // If no date selected, show current month's message
    if (!selectedCalendarDate) {
        document.getElementById("calendar-appointments").innerHTML =
            "<p>Select a date to view appointments.</p>";
    }
}


function showCalendarAppointments(date, bookings) {

    const container =
        document.getElementById("calendar-appointments");

    if (!container) return;

    const formattedDate =
        new Date(date + "T00:00:00").toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    if (!bookings.length) {

        container.innerHTML = `
            <h3>${formattedDate}</h3>
            <p>No appointments scheduled for this date.</p>
        `;

        return;
    }

    let html = `<h3>${formattedDate}</h3>`;

    bookings
        .sort((a, b) => a.time.localeCompare(b.time))
        .forEach(booking => {

            const status =
                normalizeStatus(booking.status);

            html += `
                <div class="calendar-appointment-item">

                    <strong>
                        ${booking.time} — ${booking.name}
                    </strong>

                    <small>
                        Service: ${booking.service}
                    </small>

                    <small>
                        Contact: ${booking.contact || "N/A"}
                    </small>

                    <span class="calendar-status ${status}">
                        ${booking.status}
                    </span>

                </div>
            `;
        });

    container.innerHTML = html;
}


// PREVIOUS MONTH
document.getElementById("calendar-prev")?.addEventListener(
    "click",
    function () {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        selectedCalendarDate = "";

        renderAdminCalendar();
    }
);


// NEXT MONTH
document.getElementById("calendar-next")?.addEventListener(
    "click",
    function () {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        selectedCalendarDate = "";

        renderAdminCalendar();
    }
);


// INITIAL CALENDAR
renderAdminCalendar();
/* ==========================================
   WEBSITE CONTENT MANAGEMENT
========================================== */

const defaultWebsiteContent = {
    heroTitle: "Feel Beautiful. Feel BINIBINI.",
    
    heroDescription:
        "Experience beauty, care, and confidence at BINIBINI Beauty Lounge.",

    about:
        "BINIBINI Beauty Lounge is dedicated to providing quality beauty and wellness services in a relaxing and welcoming environment.",

    phone:
        "0912 345 6789",

    email:
        "binibinibeautylounge@gmail.com",

    address:
        "Bacoor, Cavite, Philippines",

    promoTitle:
        "Special Beauty Offers",

    promoDescription:
        "Enjoy our latest beauty promotions and exclusive offers at BINIBINI Beauty Lounge."
};


/* LOAD CONTENT */

function loadWebsiteContent() {

    let savedContent =
        JSON.parse(
            localStorage.getItem("binibiniWebsiteContent")
        );

    if (!savedContent) {
        savedContent = defaultWebsiteContent;
    }


    const heroTitle =
        document.getElementById("content-hero-title");

    const heroDescription =
        document.getElementById("content-hero-description");

    const about =
        document.getElementById("content-about");

    const phone =
        document.getElementById("content-phone");

    const email =
        document.getElementById("content-email");

    const address =
        document.getElementById("content-address");

    const promoTitle =
        document.getElementById("content-promo-title");

    const promoDescription =
        document.getElementById("content-promo-description");


    if (heroTitle)
        heroTitle.value = savedContent.heroTitle || "";

    if (heroDescription)
        heroDescription.value =
            savedContent.heroDescription || "";

    if (about)
        about.value = savedContent.about || "";

    if (phone)
        phone.value = savedContent.phone || "";

    if (email)
        email.value = savedContent.email || "";

    if (address)
        address.value = savedContent.address || "";

    if (promoTitle)
        promoTitle.value =
            savedContent.promoTitle || "";

    if (promoDescription)
        promoDescription.value =
            savedContent.promoDescription || "";
}


/* SAVE CONTENT */

function saveWebsiteContent() {

    const websiteContent = {

        heroTitle:
            document.getElementById(
                "content-hero-title"
            ).value,

        heroDescription:
            document.getElementById(
                "content-hero-description"
            ).value,

        about:
            document.getElementById(
                "content-about"
            ).value,

        phone:
            document.getElementById(
                "content-phone"
            ).value,

        email:
            document.getElementById(
                "content-email"
            ).value,

        address:
            document.getElementById(
                "content-address"
            ).value,

        promoTitle:
            document.getElementById(
                "content-promo-title"
            ).value,

        promoDescription:
            document.getElementById(
                "content-promo-description"
            ).value

    };


    localStorage.setItem(
        "binibiniWebsiteContent",
        JSON.stringify(websiteContent)
    );


    const message =
        document.getElementById(
            "content-save-message"
        );

    if (message) {

        message.textContent =
            "✓ Website content saved successfully.";

        setTimeout(() => {

            message.textContent = "";

        }, 3000);

    }

}


/* LOAD CONTENT WHEN ADMIN PAGE OPENS */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadWebsiteContent();

    }
);