
// BINIBINI BEAUTY LOUNGE
// SCHOOL PROJECT DEMONSTRATION

const services = [
    {
        category: "EYES",
        items: [
            ["Classic Eyelashes",349],
            ["Hybrid Eyelashes",399],
            ["Volume Eyelashes",449],
            ["Brow Microblading",999],
            ["Brow Lamination & Tint",449]
        ]
    },
    {
        category: "NAILS",
        items: [
            ["Gel Polish",349],
            ["Soft Gel Extension Plain",499],
            ["Soft Gel Extension with Design",699],
            ["Gel Removal",99]
        ]
    },
    {
        category: "FACE",
        items: [
            ["Basic Facial",399],
            ["Acne Facial Treatment",599],
            ["Anti-Aging Therapy",499],
            ["Hydrafacial Treatment",899],
            ["Warts Removal (Face & Neck)",999]
        ]
    },
    {
        category: "SKIN AND OTHERS",
        items: [
            ["Gluta Push",349],
            ["L-Carnitine Push",299],
            ["Vitamin C",149],
            ["Gluta Push 10+1 Promo",3000],
            ["Foot Spa",249],
            ["IPL Laser Underarm Hair Removal",149]
        ]
    }
];

// RENDER SERVICES
const serviceContainer = document.getElementById("services-container");

services.forEach(group => {
    const card = document.createElement("article");
    card.className = "service-card";

    card.innerHTML = `<h3>${group.category}</h3>` +
        group.items.map(item => `
            <div class="service-item">
                <span>${item[0]}</span>
                <strong>₱${item[1].toLocaleString("en-PH")}</strong>
            </div>
        `).join("");

    serviceContainer.appendChild(card);
});

// GALLERY
const gallery = document.getElementById("gallery-grid");

if (gallery) {
    for (let i = 1; i <= 20; i++) {
        const img = document.createElement("img");

        img.src = `salon-${i}.jpg`;
        img.alt = `BINIBINI Beauty Lounge Gallery ${i}`;
        img.loading = "lazy";

        gallery.appendChild(img);
    }
}

// SAMPLE REVIEWS - NOT REAL CUSTOMER TESTIMONIALS
const reviews = [
    ["Maria Santos","Classic Eyelashes","Ang ganda ng result! Natural looking yung lashes ko. Super accommodating din ng staff. ❤️"],
    ["Angela Reyes","Basic Facial","Very relaxing yung facial! Fresh na fresh ang skin ko after. Will definitely come back!"],
    ["Kristine Cruz","Soft Gel Extension","Ang linis ng gawa nila! Worth it yung price and super pretty ng nails ko."],
    ["Jasmine Garcia","Hydrafacial","Loved my experience! Very comfortable and mabait ang technician."],
    ["Nicole Mendoza","Brow Lamination & Tint","Perfect yung shape ng brows ko. Hindi overdone, just the way I like it!"],
    ["Patricia Flores","Foot Spa","Sobrang relaxing! Perfect after a long and tiring week."]
];

document.getElementById("reviews-container").innerHTML =
    reviews.map(r => `
        <article class="review-card">
            <div class="stars">★★★★★</div>
            <p>"${r[2]}"</p>
            <h4>${r[0]}</h4>
            <small>${r[1]}</small>
        </article>
    `).join("");

// MEMBER DROPDOWN
function toggleMember() {
    document.getElementById("member-dropdown").classList.toggle("show");
}

function toggleMenu() {
    document.getElementById("navbar").classList.toggle("active");
}

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navbar").classList.remove("active");
    });
});

document.addEventListener("click", e => {
    if (!e.target.closest(".member-menu")) {
        document.getElementById("member-dropdown").classList.remove("show");
    }
});

// MODALS
function openModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

function openLogin() {
    closeModal("signup-modal");
    openModal("login-modal");
}

function openSignup() {
    closeModal("login-modal");
    openModal("signup-modal");
}

// MOCK CUSTOMER ACCOUNTS
let accounts = JSON.parse(localStorage.getItem("biniAccounts") || "[]");

if (!accounts.some(a => a.email === "client@binibini.com")) {
    accounts.push({
        name: "Demo Client",
        contact: "09123456789",
        address: "Demo Address",
        email: "client@binibini.com",
        password: "Bini123!"
    });
    localStorage.setItem("biniAccounts", JSON.stringify(accounts));
}

let currentUser = JSON.parse(sessionStorage.getItem("biniUser") || "null");

function updateMember() {
    const loggedIn = !!currentUser;
    document.getElementById("login-option").textContent =
        loggedIn ? "My Account: " + currentUser.name : "Log In";

    document.getElementById("login-option").onclick =
        loggedIn ? () => alert("Logged in as " + currentUser.email) : openLogin;

    document.getElementById("logout-option").style.display =
        loggedIn ? "block" : "none";
}

updateMember();

document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    accounts = JSON.parse(localStorage.getItem("biniAccounts") || "[]");

    const user = accounts.find(a =>
        a.email.toLowerCase() === email && a.password === password
    );

    if (!user) {
        alert("Incorrect email or password.");
        return;
    }

    currentUser = user;
    sessionStorage.setItem("biniUser", JSON.stringify(user));

    closeModal("login-modal");
    updateMember();
    alert("Welcome to BINIBINI, " + user.name + "!");
});

document.getElementById("signup-form").addEventListener("submit", e => {
    e.preventDefault();

    const user = {
        name: document.getElementById("signup-name").value.trim(),
        contact: document.getElementById("signup-contact").value.trim(),
        address: document.getElementById("signup-address").value.trim(),
        email: document.getElementById("signup-email").value.trim().toLowerCase(),
        password: document.getElementById("signup-password").value
    };

    accounts = JSON.parse(localStorage.getItem("biniAccounts") || "[]");

    if (accounts.some(a => a.email === user.email)) {
        alert("This email is already registered.");
        return;
    }

    accounts.push(user);
    localStorage.setItem("biniAccounts", JSON.stringify(accounts));

    currentUser = user;
    sessionStorage.setItem("biniUser", JSON.stringify(user));

    closeModal("signup-modal");
    updateMember();
    alert("Your demo account has been created!");
});

function logout() {
    currentUser = null;
    sessionStorage.removeItem("biniUser");
    updateMember();
    alert("You have been logged out.");
}

// SHOPPING CART AND MOCK INVENTORY
const products = {
    p1: {
        name: "BINIBINI Sunscreen Protection Cream",
        price: 450,
        stock: 10
    },
    p2: {
        name: "Bini-Bini Beauty Revitalizing Set",
        price: 350,
        stock: 8
    }
};

let inventory = JSON.parse(localStorage.getItem("biniStock") || "null") || {
    p1: 10,
    p2: 8
};

let cart = JSON.parse(localStorage.getItem("biniCart") || "{}");

function saveCart() {
    localStorage.setItem("biniCart", JSON.stringify(cart));
    updateCart();
}

function addToCart(id) {
    if (!currentUser) {
        alert("Please log in first before adding products to your basket.");
        openLogin();
        return;
    }

    const quantity = cart[id] || 0;

    if (quantity >= inventory[id]) {
        alert("Sorry, this product is out of stock.");
        return;
    }

    cart[id] = quantity + 1;
    saveCart();
    alert("Product added to your basket!");
}

function toggleCart() {
    document.getElementById("cart-overlay").classList.toggle("show");
    document.getElementById("cart-panel").classList.toggle("show");
}

function closeCart() {
    document.getElementById("cart-overlay").classList.remove("show");
    document.getElementById("cart-panel").classList.remove("show");
}

function changeQuantity(id, amount) {
    const next = (cart[id] || 0) + amount;

    if (next <= 0) {
        delete cart[id];
    } else if (next <= inventory[id]) {
        cart[id] = next;
    } else {
        alert("Available stock: " + inventory[id]);
    }

    saveCart();
}

function updateCart() {
    let count = 0;
    let total = 0;
    let html = "";

    Object.keys(cart).forEach(id => {
        const product = products[id];
        const quantity = cart[id];

        count += quantity;
        total += product.price * quantity;

        html += `
            <div class="cart-item">
                <strong>${product.name}</strong>
                <p>₱${product.price} each</p>
                <p>Stock available: ${inventory[id]}</p>
                <button onclick="changeQuantity('${id}',-1)">−</button>
                ${quantity}
                <button onclick="changeQuantity('${id}',1)">+</button>
                <p>Subtotal: ₱${product.price * quantity}</p>
            </div>
        `;
    });

    document.getElementById("cart-items").innerHTML =
        html || "<p>Your basket is empty.</p>";

    document.getElementById("cart-count").textContent = count;
    document.getElementById("cart-total").textContent =
        "Total: ₱" + total.toLocaleString("en-PH");
}

updateCart();

// CHECKOUT
function checkout() {
    if (!currentUser) {
        alert("Please log in before checkout.");
        closeCart();
        openLogin();
        return;
    }

    if (Object.keys(cart).length === 0) {
        alert("Your basket is empty.");
        return;
    }

    document.getElementById("checkout-summary").innerHTML =
        `<p>Customer: ${currentUser.name}</p>
         <p>Total: ₱${Object.keys(cart).reduce((sum,id) =>
             sum + products[id].price * cart[id], 0).toLocaleString("en-PH")}</p>`;

    closeCart();
    openModal("checkout-modal");
}

const deliveryType = document.getElementById("delivery-type");
const paymentMethod = document.getElementById("payment-method");
const qrArea = document.getElementById("qr-area");
const reference = document.getElementById("payment-reference");

function updatePayment() {
    if (deliveryType.value === "pickup") {
        paymentMethod.value = "cash";
        paymentMethod.querySelector('option[value="qr"]').disabled = true;
    } else {
        paymentMethod.value = "qr";
        paymentMethod.querySelector('option[value="qr"]').disabled = false;
        paymentMethod.querySelector('option[value="cash"]').disabled = true;
    }

    qrArea.classList.toggle("hidden", paymentMethod.value !== "qr");
    reference.required = paymentMethod.value === "qr";
}

deliveryType.addEventListener("change", updatePayment);
paymentMethod.addEventListener("change", updatePayment);
updatePayment();

document.getElementById("checkout-form").addEventListener("submit", e => {
    e.preventDefault();

    const method = paymentMethod.value;
    const ref = reference.value.trim();

    if (method === "qr" && ref.length < 4) {
        alert("Enter a valid demo payment reference number.");
        return;
    }

    if (method === "cash" && deliveryType.value !== "pickup") {
        alert("Cash is only available for salon pickup.");
        return;
    }

    for (const id in cart) {
        if (cart[id] > inventory[id]) {
            alert("Insufficient stock for " + products[id].name);
            return;
        }
    }

    for (const id in cart) {
        inventory[id] -= cart[id];
    }

    localStorage.setItem("biniStock", JSON.stringify(inventory));

    const orderNumber = "BINI-" + Date.now();

    alert(
    "DEMO ORDER SUCCESSFUL!\n" +
    "Order: " + orderNumber +
    "\nCustomer: " + currentUser.name +
    "\nPayment: " + method.toUpperCase() +
    "\nReference: " + (ref || "Cash on pickup")
);

    cart = {};
    saveCart();
    closeModal("checkout-modal");
    document.getElementById("checkout-form").reset();
    updatePayment();
});

// BOOKING NAVIGATION
function goToBooking() {
    if (!currentUser) {
        alert("Please log in before booking an appointment.");
        openLogin();
        return;
    }

    window.location.href = "booking.html";
}

// FOOTER INFORMATION
function showPrivacy() {
    document.getElementById("info-title").textContent =
        "Data Privacy Policy";

    document.getElementById("info-content").innerHTML = `
        <h3>1. Introduction</h3>
        <p>BINIBINI BEAUTY LOUNGE values your privacy and is committed to protecting your personal information.</p>

        <h3>2. Information We Collect</h3>
        <p>We may collect your name, contact number, email, delivery address, appointment details and transaction references.</p>

        <h3>3. Use of Information</h3>
        <p>Your information may be used to manage customer accounts, bookings, orders and inquiries.</p>

        <h3>4. Data Protection</h3>
        <p>Appropriate security measures should be implemented to protect customer information from unauthorized access and disclosure.</p>

        <h3>5. Sharing of Information</h3>
        <p>Customer information should not be sold or shared with unauthorized parties.</p>

        <h3>6. Customer Rights</h3>
        <p>Customers have rights under the Philippine Data Privacy Act of 2012 (RA 10173), including the right to be informed, access, correct and request deletion of personal information when applicable.</p>

        <h3>7. Cookies and Browser Storage</h3>
        <p>Our demonstration website uses browser storage for login, shopping basket and booking features.</p>

        <h3>8. Contact Us</h3>
        <p>Mobile: 0962 639 0230</p>
        <p>Email: owenjay1003@gmail.com</p>
        <p>Messenger: Bini - Bini Beauty Lounge</p>
    `;

    openModal("info-modal");
}

function showPolicy() {
    document.getElementById("info-title").textContent = "Booking Policy";
    document.getElementById("info-content").textContent =
        "A 50% reservation fee is required. If a customer does not attend the appointment, the reservation fee is forfeited. If the customer attends, the fee is deducted from the final bill. If the customer wish to rebook the appointment,they may do so providing the choosen appointment date is available. This only applies 24hrs before the scheduled booking date.";
    openModal("info-modal");
}
