let students = [];
let chartInstance;

function addStudent() {
  const name = document.getElementById("name").value;
  const attendance = parseFloat(document.getElementById("attendance").value);
  const internal = parseFloat(document.getElementById("internal").value);
  const external = parseFloat(document.getElementById("external").value);
  const studyHours = parseFloat(document.getElementById("studyHours").value);
  const behavior = parseFloat(document.getElementById("behavior").value);

  if (!name) return alert("Please enter a student name.");

  // Calculate predicted grade
  let predictedGrade = (attendance * 0.2) + (internal * 1.3) + (external * 1.1) + (studyHours * 1.2) + (behavior * 3);
  predictedGrade = Math.min(100, Math.round(predictedGrade));

  const pass = predictedGrade >= 50;
  const risk = predictedGrade < 50 ? "🚨 High" : predictedGrade < 65 ? "⚠️ Moderate" : "✅ Low";

  let recommendation = "";
  if (predictedGrade < 50)
    recommendation = "Needs urgent help — focus on attendance and study consistency.";
  else if (predictedGrade < 65)
    recommendation = "Can improve with mentoring and practice sessions.";
  else if (predictedGrade < 80)
    recommendation = "Doing well — maintain study habits.";
  else
    recommendation = "Excellent — explore leadership and advanced learning.";

  students.push({ name, predictedGrade, pass, risk, recommendation });
  document.getElementById("studentForm").reset();
  updateDashboard();
}

function updateDashboard() {
  const dashboard = document.getElementById("dashboard");
  dashboard.classList.remove("hidden");

  // Populate table
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    const row = `<tr>
      <td>${s.name}</td>
      <td>${s.predictedGrade}</td>
      <td>${s.pass ? "✅ Pass" : "❌ Fail"}</td>
      <td>${s.risk}</td>
      <td>${s.recommendation}</td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });

  // Class summary
  const avgGrade = (students.reduce((sum, s) => sum + s.predictedGrade, 0) / students.length).toFixed(1);
  const passRate = ((students.filter(s => s.pass).length / students.length) * 100).toFixed(1);
  const highRisk = students.filter(s => s.risk.includes("High")).length;

  document.getElementById("summaryText").innerHTML = `
    Average Grade: <b>${avgGrade}</b><br>
    Pass Rate: <b>${passRate}%</b><br>
    High-Risk Students: <b>${highRisk}</b>
  `;

  // Chart visualization
  const ctx = document.getElementById("chart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: students.map(s => s.name),
      datasets: [
        {
          label: "Predicted Grades",
          data: students.map(s => s.predictedGrade),
          backgroundColor: students.map(s =>
            s.predictedGrade < 50 ? "#e74c3c" : s.predictedGrade < 65 ? "#f1c40f" : "#2ecc71"
          ),
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Class Performance Overview", color: "#fff" },
      },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { beginAtZero: true, max: 100, ticks: { color: "#fff" } },
      },
    },
  });

  // Save data in localStorage
  localStorage.setItem("studentsData", JSON.stringify(students));
}

// Load existing data if available
window.onload = function () {
  const stored = localStorage.getItem("studentsData");
  if (stored) {
    students = JSON.parse(stored);
    updateDashboard();
  }
};
