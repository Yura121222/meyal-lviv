document.getElementById("y")?.append(new Date().getFullYear());

const points = [
  {
    name: "Прийомка #1",
    address: "Львів, Гніздовського 1",
    phone: "+380501764679",
    lat: 49.83986,
    lng: 23.96691
  },
  {
    name: "Прийомка #2",
    address: "Львів, Авіаційна 7",
    phone: "+380962983072",
    lat: 49.813648,
    lng: 23.930202
  }
];

// Рендер списку
const locEl = document.getElementById("locations");

locEl.innerHTML = points.map((p, i) => `
  <div>
    <b>${p.name}</b><br/>
    ${p.address}<br/>
    <a href="tel:${p.phone}">${p.phone}</a><br/>
    <a href="#map-block" onclick="focusPoint(${i})">Показати на карті</a>
    <hr/>
  </div>
`).join("");


// Карта
const map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

// Маркери
const markers = points.map(p => {
  return L.marker([p.lat, p.lng])
    .addTo(map)
    .bindPopup(`<b>${p.name}</b><br>${p.address}`);
});

// Автопозиціонування
const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
map.fitBounds(bounds);

// Фокус на точці
window.focusPoint = (i) => {
  map.setView([points[i].lat, points[i].lng], 16);
  markers[i].openPopup();
};

// Форма
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.onsubmit = async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    status.textContent = "Заявка надіслана!";
    form.reset();
  } else {
    status.textContent = "Помилка відправки";
  }
};