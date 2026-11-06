
// BINIBINI APPOINTMENT BOOKING
// DEMONSTRATION VERSION

const user = JSON.parse(sessionStorage.getItem("biniUser") || "null");

if (!user) {
    alert("Please log in first before booking.");
    window.location.href = "index.html";
}

const serviceList = [
    ["Classic Eyelashes",349],
    ["Hybrid Eyelashes",399],
    ["Volume Eyelashes",449],
    ["Brow Microblading",999],
    ["Brow Lamination & Tint",449],
    ["Gel Polish",349],
    ["Soft Gel Extension Plain",499],
    ["Soft Gel Extension with Design",699],
    ["Gel Removal",99],
    ["Basic Facial",399],
    ["Acne Facial Treatment",599],
    ["Anti-Aging Therapy",499],
    ["Hydrafacial Treatment",899],
    ["Warts Removal (Face & Neck)",999],
    ["Gluta Push",349],
    ["L-Carnitine Push",299],
    ["Vitamin C",149],
    ["Gluta Push 10+1 Promo",3000],
    ["Foot Spa",249],
    ["IPL Laser Underarm Hair Removal",149]
];

const serviceSelect = document.getElementById("appointment-service");

serviceList.forEach(([name,price]) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = `${name} — ₱${price}`;
    option.dataset.price = price;
    serviceSelect.appendChild(option);
});

// CUSTOMER INFORMATION
document.getElementById("customer-name").value = user?.name || "";
document.getElementById("customer-email").value = user?.email || "";
document.getElementById("customer-contact").value = user?.contact || "";

// CALENDAR CONFIGURATION
let currentDate = new Date(2026,10,1);
let selectedDate = "";
let selectedTime = "";
let pendingBooking = null;

const minMonth = new Date(2026,10,1);
const maxMonth = new Date(2027,4,1);

const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
];

// MOCK BOOKINGS
// These dates and times are examples only.
let bookedSlots = JSON.parse(
    localStorage.getItem("biniBookedSlots") || "null"
);

if (!bookedSlots) {
    bookedSlots = {
        "2026-11-10": ["10:00 AM","2:00 PM"],
        "2026-11-15": ["9:00 AM","1:00 PM"],
        "2026-11-20": ["11:00 AM","3:00 PM"],
        "2026-12-05": ["10:00 AM","4:00 PM"],
        "2026-12-12": ["9:00 AM","2:00 PM"],
        "2027-01-08": ["11:00 AM"],
        "2027-02-14": ["10:00 AM","1:00 PM"],
        "2027-03-08": ["9:00 AM","3:00 PM"],
        "2027-04-10": ["11:00 AM"],
        "2027-05-15": ["2:00 PM"]
    };

    localStorage.setItem(
        "biniBookedSlots",
        JSON.stringify(bookedSlots)
    );
}

// FORMAT DATE
function formatDate(year,month,day) {
    return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}

// CALENDAR
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById("month-year").textContent =
        currentDate.toLocaleString("en-US", {
            month:"long",
            year:"numeric"
        });

    const calendar = document.getElementById("calendar");

    calendar.innerHTML = "";

    ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(day => {
        const div = document.createElement("div");
        div.className = "calendar-day day-name";
        div.textContent = day;
        calendar.appendChild(div);
    });

    const firstDay = new Date(year,month,1).getDay();
    const daysInMonth = new Date(year,month+1,0).getDate();

    for(let i=0;i<firstDay;i++) {
        const blank = document.createElement("div");
        calendar.appendChild(blank);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    for(let day=1;day<=daysInMonth;day++) {
        const dateString = formatDate(year,month,day);
        const dateObject = new Date(year,month,day);
        const isPast = dateObject < today;

        const isClosed = dateObject.getDay() === 0;

        const booked = bookedSlots[dateString] || [];

        const allBooked = timeSlots.every(t => booked.includes(t));

        const button = document.createElement("button");

        button.textContent = day;
        button.className = "calendar-day date-button";

        if (isPast || isClosed || allBooked) {
            button.disabled = true;
            button.classList.add("booked");
        } else {
            button.classList.add("available");
            button.onclick = () => selectDate(dateString);
        }

        if (selectedDate === dateString) {
            button.classList.add("selected");
        }

        calendar.appendChild(button);
    }

    document.getElementById("previous-month").disabled =
        currentDate.getTime() <= minMonth.getTime();

    document.getElementById("next-month").disabled =
        currentDate.getTime() >= maxMonth.getTime();
}

// DATE SELECTION
function selectDate(date) {
    selectedDate = date;
    selectedTime = "";

    document.getElementById("selected-date").value = date;
    document.getElementById("selected-time").value = "";

    renderCalendar();
    renderTimeSlots();
}

// TIME SELECTION
function renderTimeSlots() {
    const container = document.getElementById("time-slots");

    container.innerHTML = "";

    if (!selectedDate) {
        container.textContent = "Select a date first.";
        return;
    }

    const booked = bookedSlots[selectedDate] || [];

    timeSlots.forEach(time => {
        const button = document.createElement("button");

        button.textContent = time;
        button.className = "time-slot";

        if (booked.includes(time)) {
            button.classList.add("booked");
            button.disabled = true;
            button.textContent += " - Booked";
        } else {
            button.onclick = () => {
                selectedTime = time;
                document.getElementById("selected-time").value = time;

                document.querySelectorAll(".time-slot").forEach(b => {
                    b.classList.remove("selected");
                });

                button.classList.add("selected");
            };
        }

        container.appendChild(button);
    });
}

// MONTH NAVIGATION
document.getElementById("previous-month").onclick = () => {
    if (currentDate.getTime() > minMonth.getTime()) {
        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth()-1,
            1
        );
        renderCalendar();
    }
};

document.getElementById("next-month").onclick = () => {
    if (currentDate.getTime() < maxMonth.getTime()) {
        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth()+1,
            1
        );
        renderCalendar();
    }
};

// RESERVATION FEE
function updateReservation() {
    const option = serviceSelect.selectedOptions[0];
    const price = Number(option?.dataset.price || 0);
    const fee = price * 0.5;

    document.getElementById("reservation-price").textContent =
        "₱" + fee.toLocaleString("en-PH", {
            minimumFractionDigits:2
        });
}

serviceSelect.addEventListener("change", updateReservation);

// BOOKING FORM
document.getElementById("appointment-form").addEventListener("submit", e => {
    e.preventDefault();

    if (!user) {
        alert("Please log in first.");
        window.location.href = "index.html";
        return;
    }

    if (!selectedDate || !selectedTime) {
        alert("Please select an available date and time.");
        return;
    }

    if ((bookedSlots[selectedDate] || []).includes(selectedTime)) {
        alert("Sorry, this time has already been booked.");
        return;
    }

    const option = serviceSelect.selectedOptions[0];
    const price = Number(option.dataset.price);

    pendingBooking = {
        customer: user.name,
        email: user.email,
        contact: user.contact,
        service: option.value,
        date: selectedDate,
        time: selectedTime,
        price: price,
        fee: price * 0.5
    };

    document.getElementById("payment-description").innerHTML =
        `<strong>Customer:</strong> ${pendingBooking.customer}<br>
         <strong>Service:</strong> ${pendingBooking.service}<br>
         <strong>Date:</strong> ${pendingBooking.date}<br>
         <strong>Time:</strong> ${pendingBooking.time}<br>
         <strong>Reservation Fee:</strong> ₱${pendingBooking.fee.toFixed(2)}`;

    document.getElementById("payment-modal").classList.add("show");

    updateBookingPayment();
});

// PAYMENT OPTIONS
const bookingMethod = document.getElementById("booking-payment-method");

function updateBookingPayment() {
    const qr = document.getElementById("booking-qr");
    const reference = document.getElementById("booking-reference");

    const isQR = bookingMethod.value === "qr";

    qr.style.display = isQR ? "block" : "none";
    reference.required = isQR;
    reference.placeholder = isQR
        ? "Enter demo payment reference"
        : "Cash payment at salon";
}

bookingMethod.addEventListener("change", updateBookingPayment);
updateBookingPayment();

function closePayment() {
    document.getElementById("payment-modal").classList.remove("show");
}

// CONFIRM APPOINTMENT
function confirmAppointment() {
    if (!pendingBooking) return;

    const method = bookingMethod.value;
    const reference = document.getElementById("booking-reference").value.trim();

    if (method === "qr" && reference.length < 4) {
        alert("Please enter a demo payment reference number.");
        return;
    }

    // Check the time again before confirming.
    bookedSlots = JSON.parse(
        localStorage.getItem("biniBookedSlots") || "{}"
    );

    if ((bookedSlots[pendingBooking.date] || [])
        .includes(pendingBooking.time)) {
        alert("Sorry, this slot was just booked. Please select another time.");
        closePayment();
        renderCalendar();
        renderTimeSlots();
        return;
    }

    const bookingNumber = "BINI-BOOK-" + Date.now();

const booking = {
    id: Date.now(),
    bookingNumber,
    name: pendingBooking.customer,
    customer: pendingBooking.customer,
    email: pendingBooking.email,
    contact: pendingBooking.contact,
    service: pendingBooking.service,
    date: pendingBooking.date,
    time: pendingBooking.time,
    price: pendingBooking.price,
    fee: pendingBooking.fee,
    paymentMethod: method,
    reference: method === "qr" ? reference : "Cash at salon",
    status: "Pending"
};

// Save appointment for the customer booking history
let allBookings = JSON.parse(
    localStorage.getItem("biniAppointments") || "[]"
);

allBookings.push(booking);

localStorage.setItem(
    "biniAppointments",
    JSON.stringify(allBookings)
);

// Save the same booking for the ADMIN DASHBOARD
let adminBookings = JSON.parse(
    localStorage.getItem("binibiniBookings") || "[]"
);

adminBookings.push({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    name: booking.name,
    email: booking.email,
    contact: booking.contact,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    price: booking.price,
    fee: booking.fee,
    paymentMethod: booking.paymentMethod,
    reference: booking.reference,
    status: "Pending"
});

localStorage.setItem(
    "binibiniBookings",
    JSON.stringify(adminBookings)
);

    // Mark the time slot as booked.
    if (!bookedSlots[booking.date]) {
        bookedSlots[booking.date] = [];
    }

    bookedSlots[booking.date].push(booking.time);

    localStorage.setItem(
        "biniBookedSlots",
        JSON.stringify(bookedSlots)
    );

    const confirmationText =
        "BINIBINI BEAUTY LOUNGE\n\n" +
        "APPOINTMENT CONFIRMATION (DEMO)\n" +
        "Booking Number: " + bookingNumber + "\n" +
        "Customer: " + booking.customer + "\n" +
        "Email: " + booking.email + "\n" +
        "Service: " + booking.service + "\n" +
        "Date: " + booking.date + "\n" +
        "Time: " + booking.time + "\n" +
        "Reservation Fee: ₱" + booking.fee.toFixed(2) + "\n" +
        "Payment Method: " + method.toUpperCase() + "\n" +
        "Reference: " + booking.reference + "\n\n" +
        "Please arrive on time for your appointment.\n" +
        "Your reservation fee will be deducted from your final bill if you attend. No-shows forfeit the reservation fee.\n\n" +
        "This is a simulated confirmation. No real payment or email was processed.";

    alert(confirmationText);

    // Simulated email preview.
    const subject = encodeURIComponent("BINIBINI Appointment Confirmation (Demo)");
    const body = encodeURIComponent(confirmationText);

    // Open the customer's email application with a prepared draft.
    const sendEmail = confirm(
        "Your demo appointment is saved. Would you like to open your email application with the confirmation draft addressed to " +
        booking.email + "?"
    );

    if (sendEmail) {
        window.location.href =
            `mailto:${encodeURIComponent(booking.email)}?subject=${subject}&body=${body}`;
    }

    pendingBooking = null;
    closePayment();

    selectedDate = "";
    selectedTime = "";

    document.getElementById("appointment-form").reset();
    document.getElementById("selected-date").value = "";
    document.getElementById("selected-time").value = "";

    updateReservation();
    renderCalendar();
    renderTimeSlots();
}

// INITIAL DISPLAY
renderCalendar();
renderTimeSlots();
updateReservation();
