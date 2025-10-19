document.addEventListener("DOMContentLoaded", () => {
    function renderTable(data) {
        const tbody = document.querySelector('.facility-available-table tbody');
        tbody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.facilityName}</td>
            <td>${item.roomNumber}</td>
            <td>${item.TotalSeats}</td>
            `;
            tbody.appendChild(row);
        });
    }
    function populateTable(sortBy = "default") {
        fetch('../php/fetch/facilityContent.php')
            .then(response => response.json())
            .then(facilityData => {
                let sortedData;
                switch(sortBy){
                    case "id":
                        sortedData = facilityData.sort((a, b) => a.ID.localeCompare(b.ID));
                        break;
                    case "name":
                        sortedData = data.sort((a, b) => {
                            const facilityA = facilityData.find(facility => facility.facilityID === a.facilityID).facilityName;
                            const facilityB = facilityData.find(facility => facility.facilityID === b.facilityID).facilityName;
                            return facilityA.localeCompare(facilityB);
                        });
                        break;
                    default:
                        sortedData = facilityData;
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
      const facilityRows = document.querySelectorAll(".facility-available-table tbody tr");

      facilityRows.forEach((row) => {
          const facilityName = row.cells[0].textContent.toLowerCase();
          const facilityId = row.cells[1].textContent.toLowerCase();
          // Show row if either name or ID matches the search value
          if (facilityName.includes(searchValue) || facilityId.includes(searchValue)) {
              row.style.display = ""; // Show row
          } else {
              row.style.display = "none"; // Hide row
          }
      });
  });
  
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
    window.location.href = 'facilitiesDashboard.php'; // Change to the actual dashboard URL
  }
  
});