const cars = [
  {
    id: 1,
    brand: "BMW",
    price: 250980,
    image: "images/bmw.png",
    year: 2018,
    power: 280,
    mileage: 25050,
  },
  {
    id: 2,
    brand: "Audi",
    price: 130000,
    image: "images/audi.png",
    year: 2020,
    power: 200,
    mileage: 75000,
  },
  {
    id: 3,
    brand: "Mercedes",
    price: 145000,
    image: "images/mercedes.png",
    year: 2019,
    power: 220,
    mileage: 115000,
  },
  {
    id: 4,
    brand: "Land Lover",
    price: 215000,
    image: "images/land.png",
    year: 2021,
    power: 270,
    mileage: 15000,
  },
  {
    id: 5,
    brand: "Mini Cooper",
    price: 95000,
    image: "images/mini.png",
    year: 2024,
    power: 160,
    mileage: 55000,
  },
  {
    id: 6,
    brand: "Lexus",
    price: 230000,
    image: "images/lexus.png",
    year: 2022,
    power: 260,
    mileage: 115000,
  },
];

function renderCars(carList) {
  const container = document.getElementById("car-list");
  container.innerHTML = "";

  carList.forEach((car) => {
    const card = document.createElement("div");
    card.classList.add("car-card");

    card.innerHTML = `
      <img src="${car.image}" alt="${car.brand}" class="car-image" />
      <div class="car-content">
        <div class="car-title-row">
          <div>
            <h3 class="car-title">${car.brand}</h3>
            <p class="car-price price">$${car.price.toLocaleString()}</p>
          </div>
          <button class="btn-primary">Zobacz ofertę</button>
        </div>
        <hr class="divider" />
        <div class="car-details">
          <div class="detail-item">
            <img src="icons/calendar.png" alt="Rocznik" />
            <span>${car.year}</span>
          </div>
          <div class="detail-item">
            <img src="icons/power.png" alt="Moc silnika" />
            <span>${car.power} KM</span>
          </div>
          <div class="detail-item">
            <img src="icons/meter.png" alt="Przebieg" />
            <span>${car.mileage.toLocaleString()} km</span>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCars(cars);
});

const accessories = [
  { id: 1, name: "Dywaniki gumowe", price: 300 },
  { id: 2, name: "Bagażnik dachowy", price: 800 },
  { id: 3, name: "Kamera cofania", price: 1000 },
];

let selectedCar = null;
let selectedAccessories = [];

document.addEventListener("DOMContentLoaded", () => {
  const carList = document.getElementById("car-list");
  const formSection = document.getElementById("form-section");
  const carListSection = document.getElementById("car-list-section");
  const summarySection = document.getElementById("summary-section");
  const accessoryList = document.getElementById("accessory-list");

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", renderCarList);

  function renderCarList() {
    const filter = searchInput.value.toLowerCase();
    carList.innerHTML = "";
    cars
      .filter((car) => car.brand.toLowerCase().includes(filter))
      .forEach((car) => {
        const card = document.createElement("div");
        card.className = "car-card";
        card.innerHTML = `
            <img src="${car.image}" />
            <div class="car-info">
              <h1>${car.brand}</h1>
              <h2>${car.price} zł</h2>
              <button class="btn-primary" data-id="${
                car.id
              }">Zobacz ofertę</button>
              <hr />
      <div class="detail-item">
            <img src="icons/calendar.png" alt="Rocznik" />
            <span>${car.year}</span>
          <div class="detail-item">
            <img src="icons/power.png" alt="Moc silnika" />
            <span>${car.power} KM</span>
          <div class="detail-item">
            <img src="icons/meter.png" alt="Przebieg" />
            <span>${car.mileage.toLocaleString()} km</span>
          </div>
          `;
        card
          .querySelector("button")
          .addEventListener("click", () => showForm(car));
        carList.appendChild(card);
      });
  }

  function showForm(car) {
    selectedCar = car;
    localStorage.setItem("selectedCar", JSON.stringify(car));
    carListSection.classList.add("hidden");
    formSection.classList.remove("hidden");
    document.getElementById("selected-car-name").textContent = `${car.brand}`;
    const imageEl = document.getElementById("selected-car-image");
    imageEl.src = car.image;
    imageEl.alt = car.brand;
    populateDeliveryDate();
    renderAccessories();
    calculateTotal();
  }

  function populateDeliveryDate() {
    const select = document.getElementById("delivery-date");
    select.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + 14 + i);
      const option = document.createElement("option");
      option.value = date.toISOString().split("T")[0];
      option.textContent = option.value;
      select.appendChild(option);
    }
  }

  function renderAccessories() {
    accessoryList.innerHTML = "";
    accessories.forEach((acc) => {
      const item = document.createElement("div");
      const checked = selectedAccessories.includes(acc.id) ? "checked" : "";
      item.innerHTML = `
          <label>
            <input type="checkbox" value="${acc.id}" ${checked}/> ${acc.name} (+${acc.price} zł)
          </label>
        `;
      item.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          selectedAccessories.push(acc.id);
        } else {
          selectedAccessories = selectedAccessories.filter(
            (id) => id !== acc.id
          );
        }
        calculateTotal();
      });
      accessoryList.appendChild(item);
    });
  }

  function calculateTotal() {
    const accPrice = accessories
      .filter((acc) => selectedAccessories.includes(acc.id))
      .reduce((sum, acc) => sum + acc.price, 0);
    const total = selectedCar.price + accPrice;
    document.getElementById("total-price").textContent = total;
    document.getElementById("nav-total-price").textContent = total;
    localStorage.setItem("totalPrice", total);
  }

  document.getElementById("purchase-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("owner-name").value.trim();
    const payment = document.querySelector("input[name='payment']:checked");
    const errorField = document.getElementById("form-error");

    if (!name || !payment) {
      errorField.textContent = "Wszystkie pola są wymagane.";
      return;
    }

    if (!/^\w+\s+\w+$/.test(name)) {
      errorField.textContent = "Imię i nazwisko powinny zawierać dwa wyrazy.";
      return;
    }

    errorField.textContent = "";
    showSummary(name, payment.value);
    localStorage.clear();
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    formSection.classList.add("hidden");
    carListSection.classList.remove("hidden");
  });

  function showSummary(name, payment) {
    formSection.classList.add("hidden");
    summarySection.classList.remove("hidden");
    document.getElementById(
      "summary-text"
    ).textContent = `${name}, kupiłeś auto ${selectedCar.brand}, płatność: ${payment}.`;
    document.getElementById("summary-img").src = selectedCar.image;
    document.getElementById(
      "summary-price"
    ).textContent = `Łączna cena: ${localStorage.getItem("totalPrice")} zł`;
  }

  renderCarList();
});
