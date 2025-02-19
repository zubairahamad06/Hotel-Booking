import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwm0pEHAGw_E-0Vtu2Rp-n5ARYJQGbJEU",
  authDomain: "hotel-booking-fc678.firebaseapp.com",
  projectId: "hotel-booking-fc678",
  storageBucket: "hotel-booking-fc678.firebasestorage.app",
  messagingSenderId: "910982654099",
  appId: "1:910982654099:web:2365b15470bf9276f78566"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const collectionRef = ref(db, "zubair");

const name = document.getElementById("fullname");
const phonenumber = document.getElementById("phonenumber");
const email = document.getElementById("email");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const rooms = document.getElementById("rooms");
const button = document.getElementById("button");
const tablecontent = document.getElementById("table-content");
const thead = document.querySelector("thead");

let editMode = false; 
let editId = null;

button.addEventListener("click", (e) => {
  e.preventDefault(); 

  const nameValue = name.value.trim();
  const phoneValue = phonenumber.value.trim();
  const emailValue = email.value.trim();
  const checkinValue = checkin.value.trim();
  const checkoutValue = checkout.value.trim();
  const roomsValue = rooms.value.trim();

  if (!nameValue || !phoneValue || !emailValue || !checkinValue || !checkoutValue || !roomsValue) {
    alert("All fields are required!");
    return;
  }

  const bookingData = {
    name: nameValue,
    mobile: phoneValue,
    email: emailValue,
    checkin: checkinValue,
    checkout: checkoutValue,
    rooms: roomsValue,
  };

  if (editMode) {
    update(ref(db, `zubair/${editId}`), bookingData)
      .then(() => {
        alert("Booking updated successfully!");
        button.innerText = "Submit"; 
        editMode = false;
        editId = null;
      });
  } else {
    push(collectionRef, bookingData);
  }


  name.value = "";
  phonenumber.value = "";
  email.value = "";
  checkin.value = "";
  checkout.value = "";
  rooms.value = "";
});


onValue(collectionRef, (snapshot) => {
  tablecontent.innerHTML = ""; 

  if (snapshot.exists()) {
    let bookings = Object.entries(snapshot.val());
    thead.style.display = "table-header-group"; 

    bookings.forEach(([id, booking]) => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${booking.name}</td>
        <td>${booking.mobile}</td>
        <td>${booking.email}</td>
        <td>${booking.checkin}</td>
        <td>${booking.checkout}</td>
        <td>${booking.rooms}</td>
        <td>
          <button class="edit" data-id="${id}">Edit</button>
          <button class="delete" data-id="${id}">Delete</button>
        </td>
      `;
      tablecontent.appendChild(row);
    });


    document.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let id = e.target.getAttribute("data-id");

        if (confirm("Are you sure you want to delete this booking?")) {
          remove(ref(db, `zubair/${id}`))
            .then(() => alert("Booking deleted successfully!"));
        }
      });
    });


    document.querySelectorAll(".edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let id = e.target.getAttribute("data-id");
        let booking = bookings.find(([key]) => key === id)[1];

        name.value = booking.name;
        phonenumber.value = booking.mobile;
        email.value = booking.email;
        checkin.value = booking.checkin;
        checkout.value = booking.checkout;
        rooms.value = booking.rooms;

        editMode = true;
        editId = id;
        button.innerText = "Update";
      });
    });

  } else {
    tablecontent.innerHTML = "<tr><td colspan='7'>No Bookings</td></tr>";
    thead.style.display = "none"; 
  }
});



const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  let searchValue = searchInput.value.toLowerCase();
  let rows = document.querySelectorAll("#table-content tr");

  rows.forEach(row => {
    let name = row.cells[0].textContent.toLowerCase();
    let phone = row.cells[1].textContent.toLowerCase();
    let email = row.cells[2].textContent.toLowerCase();

    if (
      name.startsWith(searchValue) || 
      phone.startsWith(searchValue) || 
      email.startsWith(searchValue)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});


