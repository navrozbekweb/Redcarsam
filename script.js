/* ==========================================================
   RED CAR — JavaScript
   Bootstrap'ning o'zi ishlaydigan qismlari (dropdown, carousel,
   accordion, navbar) uchun kod yozish shart emas.
   Bu yerda faqat quyidagilar bor:
     1. Tooltip va popover'larni yoqish
     2. Avtomobillarni qidirish, filtrlash, saralash
     3. "Bron qilish" tugmasi -> formaga o'tish
     4. Bron formasini tekshirish (Bootstrap validation)
     5. Yo'lovchilar soni (range) qiymatini ko'rsatish
     6. Mobil menyuni havola bosilganda yopish
   ========================================================== */

// ---------- 1. TOOLTIP va POPOVER'larni yoqish ----------
// Bootstrap 5'da ular o'zi yoqilmaydi, JS bilan yoqish kerak.
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));


// ---------- 2. QIDIRISH, FILTR va SARALASH ----------
const grid        = document.getElementById("carGrid");
const searchInput = document.getElementById("searchInput");
const typeFilter  = document.getElementById("typeFilter");
const sortLabel   = document.getElementById("sortLabel");
const noResults   = document.getElementById("noResults");

let currentSort = "default";            // hozirgi saralash turi
const originalOrder = [...grid.children]; // kartochkalarning asl tartibi

function filterCars() {
    const query = searchInput.value.trim().toLowerCase();
    const type  = typeFilter.value;

    // Har bir kartochkani ko'rsatish yoki yashirish (d-none = display:none)
    originalOrder.forEach(col => {
        const nameOk = col.dataset.name.includes(query);
        const typeOk = type === "all" || col.dataset.type === type;
        col.classList.toggle("d-none", !(nameOk && typeOk));
    });

    // Ko'rinib turganlarni saralash
    let list = [...originalOrder];
    if (currentSort === "low")  list.sort((a, b) => a.dataset.price - b.dataset.price);
    if (currentSort === "high") list.sort((a, b) => b.dataset.price - a.dataset.price);
    list.forEach(col => grid.appendChild(col));

    // Hech narsa topilmasa xabar chiqarish
    const visibleCount = list.filter(col => !col.classList.contains("d-none")).length;
    noResults.classList.toggle("d-none", visibleCount > 0);
}

searchInput.addEventListener("input", filterCars);
typeFilter.addEventListener("change", filterCars);

// Dropdown'dagi saralash variantlari
document.querySelectorAll(".sort-item").forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();
        currentSort = item.dataset.sort;
        sortLabel.innerHTML = '<i class="bi bi-sort-down"></i> ' + item.textContent;
        filterCars();
    });
});


// ---------- 3. KARTOCHKADAN BRON FORMASIGA O'TISH ----------
const bookingCar = document.getElementById("bookingCar");

document.querySelectorAll(".car-book").forEach(button => {
    button.addEventListener("click", () => {
        bookingCar.value = button.dataset.car;   // avtomobil nomini formaga qo'yadi
        document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    });
});


// ---------- 4. BRON FORMASINI TEKSHIRISH ----------
const form      = document.getElementById("bookingForm");
const dateInput = document.getElementById("bookingDate");
const message   = document.getElementById("formMessage");

// Bugungi kundan oldingi sanani tanlab bo'lmasin
function setMinDate() {
    const now = new Date();
    dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 10);
}
setMinDate();

form.addEventListener("submit", event => {
    event.preventDefault();

    // Bootstrap: .was-validated klassi qizil/yashil belgilarni ko'rsatadi
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const data = new FormData(form);
    message.textContent =
        `Rahmat, ${data.get("name").trim()}! ${data.get("car")} uchun ` +
        `${data.get("date")} sanasiga ${data.get("days")} kunlik so‘rovingiz qabul qilindi. ` +
        `Operator siz bilan bog‘lanadi.`;
    message.classList.remove("d-none");

    form.reset();
    form.classList.remove("was-validated");
    passengersValue.textContent = passengers.value;
    setMinDate();
});


// ---------- 5. YO'LOVCHILAR SONI (form-range) ----------
const passengers      = document.getElementById("passengers");
const passengersValue = document.getElementById("passengersValue");

passengers.addEventListener("input", () => {
    passengersValue.textContent = passengers.value;
});


// ---------- 6. MOBIL MENYUNI HAVOLA BOSILGANDA YOPISH ----------
const navMenu = document.getElementById("navMenu");

navMenu.querySelectorAll("a.nav-link:not(.dropdown-toggle), a.dropdown-item").forEach(link => {
    link.addEventListener("click", () => {
        const instance = bootstrap.Collapse.getInstance(navMenu);
        if (instance && navMenu.classList.contains("show")) instance.hide();
    });
});
