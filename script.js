// -------------------- STORAGE --------------------
function getMedicines() {
  return JSON.parse(localStorage.getItem("medicines")) || [];
}

function saveMedicines(data) {
  localStorage.setItem("medicines", JSON.stringify(data));
}

// -------------------- ADMIN --------------------

// Add Medicine
function addMedicine() {
  let name = document.getElementById("name").value;
  let price = document.getElementById("price").value;
  let expiry = document.getElementById("expiry").value;

  if (!name || !price || !expiry) {
    alert("Please fill all fields");
    return;
  }

  let medicines = getMedicines();
  medicines.push({ name, price, expiry, gst: 0, discount: 0 });

  saveMedicines(medicines);
  displayMedicines();
}

// Display Medicines (Admin)
function displayMedicines() {
  let table = document.getElementById("medicineTable");
  if (!table) return;

  let medicines = getMedicines();

  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Price</th>
      <th>Expiry</th>
      <th>GST%</th>
      <th>Discount%</th>
      <th>Actions</th>
    </tr>
  `;

  medicines.forEach((med, index) => {
    table.innerHTML += `
      <tr>
        <td>${med.name}</td>
        <td>${med.price}</td>
        <td>${med.expiry}</td>
        <td>${med.gst || 0}</td>
        <td>${med.discount || 0}</td>
        <td>
          <button onclick="editMedicine(${index})">Edit</button>
          <button onclick="deleteMedicine(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Edit Medicine (GST + Discount)
function editMedicine(index) {
  let medicines = getMedicines();

  let gst = prompt("Enter GST %:", medicines[index].gst || 0);
  let discount = prompt("Enter Discount %:", medicines[index].discount || 0);

  medicines[index].gst = Number(gst);
  medicines[index].discount = Number(discount);

  saveMedicines(medicines);
  displayMedicines();
}

// Delete Medicine
function deleteMedicine(index) {
  let medicines = getMedicines();
  medicines.splice(index, 1);
  saveMedicines(medicines);
  displayMedicines();
}

// Remove Expired Medicines
function removeExpired() {
  let medicines = getMedicines();
  let today = new Date().toISOString().split("T")[0];

  medicines = medicines.filter(med => med.expiry >= today);
  saveMedicines(medicines);
}

// -------------------- OPERATOR --------------------

// Display Medicines (Operator)
function displayOperator() {
  let div = document.getElementById("medicineList");
  if (!div) return;

  let medicines = getMedicines();
  div.innerHTML = "<h3>Available Medicines</h3>";

  if (medicines.length === 0) {
    div.innerHTML += "<p>No medicines available</p>";
    return;
  }

  medicines.forEach((med) => {
    div.innerHTML += `
      <p>
        ${med.name} - ₹${med.price}
        <button onclick="addSale('${med.name}')">Sell</button>
      </p>
    `;
  });
}

// Add Sale
function addSale(name) {
  let qty = prompt("Enter quantity:");
  if (!qty) return;

  let medicines = getMedicines();
  let med = medicines.find(m => m.name === name);

  let price = Number(med.price);
  let gst = med.gst || 0;
  let discount = med.discount || 0;

  let finalPrice = price + (price * gst / 100) - (price * discount / 100);
  finalPrice = finalPrice * qty;

  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  let today = new Date().toISOString().split("T")[0];

  sales.push({ name, qty, total: finalPrice, date: today });

  localStorage.setItem("sales", JSON.stringify(sales));
  displaySales();
}

// Display Sales (Reports)
function displaySales() {
  let div = document.getElementById("salesList");
  if (!div) return;

  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  let today = new Date().toISOString().split("T")[0];
  let month = today.slice(0, 7);

  let dailyTotal = 0;
  let monthlyTotal = 0;

  div.innerHTML = "<h3>Sales Report</h3>";

  sales.forEach((s) => {
    if (s.date === today) dailyTotal += s.total;
    if (s.date.startsWith(month)) monthlyTotal += s.total;

    div.innerHTML += `
      <p>${s.name} | Qty: ${s.qty} | ₹${s.total} | ${s.date}</p>
    `;
  });

  div.innerHTML += `
    <h4>Today's Total: ₹${dailyTotal}</h4>
    <h4>Monthly Total: ₹${monthlyTotal}</h4>
  `;
}

// -------------------- AUTO LOAD --------------------
removeExpired();

window.onload = function () {
  displayMedicines();
  displayOperator();
  displaySales();
};