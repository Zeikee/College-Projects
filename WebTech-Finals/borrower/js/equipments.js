document.addEventListener("DOMContentLoaded", () => {
    function renderTable(data) {
        const tbody = document.querySelector('.equipment-available-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.equipmentName}</td>
            <td>${item.equipmentID}</td>
            <td>${item.equipmentTotalQuantity}</td>
            `;
            tbody.appendChild(row);
        });
    }
    function populateTable(sortBy = "default") {
        fetch('../php/fetch/equipmentContent.php')
            .then(response => response.json())
            .then(equipmentData => {
                let sortedData;
                switch(sortBy){
                    case "id":
                        sortedData = equipmentData.sort((a, b) => a.ID.localeCompare(b.ID));
                        break;
                    case "name":
                        sortedData = data.sort((a, b) => {
                            const equipmentA = equipmentData.find(equipment => equipment.equipmentID === a.equipmentID).equipmentName;
                            const equipmentB = equipmentData.find(equipment => equipment.equipmentID === b.equipmentID).equipmentName;
                            return equipmentA.localeCompare(equipmentB);
                        });
                        break;
                    default:
                        sortedData = equipmentData;
                        break;
                }
                // Render the table with sorted data
                renderTable(sortedData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
  populateTable();
  const searchBar = document.getElementById("searchInput");
  searchBar.addEventListener("input", () => {
      const searchValue = searchBar.value.toLowerCase();
      const equipmentRows = document.querySelectorAll(".equipment-available-table tbody tr");

      equipmentRows.forEach((row) => {
          const equipmentName = row.cells[0].textContent.toLowerCase();
          const EquipmentID = row.cells[1].textContent.toLowerCase();
          // Show row if either name or ID matches the search value
          if (equipmentName.includes(searchValue) || EquipmentID.includes(searchValue)) {
              row.style.display = ""; // Show row
          } else {
              row.style.display = "none"; // Hide row
          }
      });
  });

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
  window.location.href = 'equipmentDashboard.php'; // Change to the actual dashboard URL
}

});