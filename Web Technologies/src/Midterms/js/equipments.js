document.addEventListener("DOMContentLoaded", () => {
  const equipments = [
      { name: "Camera", id: "1001", quantity: 5, status: "Available" },
      { name: "Tripod", id: "1002", quantity: 0, status: "Unavailable" },
      { name: "Lens", id: "1003", quantity: 10, status: "Available" },
      { name: "Lighting Kit", id: "1004", quantity: 0, status: "Unavailable" }
  ];

  generateTable(equipments);
});

function generateTable(equipments) {
  const tbody = document.querySelector("#equipmentTable tbody");
  tbody.innerHTML = ""; // Clear any existing rows

  equipments.forEach(equipment => {
      const row = document.createElement("tr");
      row.classList.add(equipment.status.toLowerCase());

      row.innerHTML = `
          <td>${equipment.name}</td>
          <td>${equipment.id}</td>
          <td>${equipment.quantity}</td>
          <td>${equipment.status}</td>
      `;

      tbody.appendChild(row);
  });
}

function searchEquipment() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const table = document.getElementById("equipmentTable");
  const tr = table.getElementsByTagName("tr");

  for (let i = 1; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName("td")[0];
      if (td) {
          const textValue = td.textContent || td.innerText;
          tr[i].style.display = textValue.toLowerCase().indexOf(input) > -1 ? "" : "none";
      }
  }
}

function filterEquipment() {
  const filter = document.getElementById("statusFilter").value;
    const table = document.getElementById("equipmentTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        if (filter === "all") {
            tr[i].style.display = "";
        } else if (filter === "available" && tr[i].classList.contains("available")) {
            tr[i].style.display = "";
        } else if (filter === "unavailable" && tr[i].classList.contains("unavailable")) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function goToDashboard() {
  window.location.href = 'equipmentLendingDashboard.php'; // Change to the actual dashboard URL
}

