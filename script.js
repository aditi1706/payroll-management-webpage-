const employeeForm = document.getElementById('employeeForm');
const payrollTableBody = document.getElementById('payrollTableBody');

// Event Listener for Form Submission
employeeForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get Input Values
  const name = document.getElementById('name').value;
  const salary = parseFloat(document.getElementById('salary').value);
  const tax = parseFloat(document.getElementById('tax').value);
  const deductions = parseFloat(document.getElementById('deductions').value);

  // Validate Input Values
  if (name === '' || isNaN(salary) || isNaN(tax) || isNaN(deductions)) {
    alert('Please fill in all fields with valid numbers.');
    return;
  }

  // Calculate Net Salary
  const taxAmount = (salary * tax) / 100;
  const netSalary = salary - taxAmount - deductions;

  // Add Employee to Payroll Table
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${name}</td>
    <td>${salary.toFixed(2)}</td>
    <td>${taxAmount.toFixed(2)}</td>
    <td>${deductions.toFixed(2)}</td>
    <td>${netSalary.toFixed(2)}</td>
    <td><button class="btn btn-danger" onclick="deleteRow(this)">Delete</button></td>
  `;
  payrollTableBody.appendChild(newRow);

  // Clear the form
  employeeForm.reset();

  // Save data to localStorage
  saveEmployeeData(name, salary, tax, deductions, netSalary);
});

// Function to Save Employee Data to localStorage
function saveEmployeeData(name, salary, tax, deductions, netSalary) {
  const employee = {
    name: name,
    salary: salary,
    tax: tax,
    deductions: deductions,
    netSalary: netSalary
  };

  let employees = JSON.parse(localStorage.getItem('employees')) || [];
  employees.push(employee);
  localStorage.setItem('employees', JSON.stringify(employees));
}

// Function to Display Payroll Data from localStorage
function displayPayroll() {
  let employees = JSON.parse(localStorage.getItem('employees')) || [];
  payrollTableBody.innerHTML = ''; // Clear existing table rows

  employees.forEach(employee => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.salary.toFixed(2)}</td>
      <td>${((employee.salary * employee.tax) / 100).toFixed(2)}</td>
      <td>${employee.deductions.toFixed(2)}</td>
      <td>${employee.netSalary.toFixed(2)}</td>
      <td><button class="btn btn-danger" onclick="deleteRow(this)">Delete</button></td>
    `;
    payrollTableBody.appendChild(newRow);
  });
}

// Function to Delete a Row
function deleteRow(button) {
  const row = button.parentElement.parentElement;
  const name = row.cells[0].textContent;

  // Remove from localStorage
  let employees = JSON.parse(localStorage.getItem('employees')) || [];
  employees = employees.filter(employee => employee.name !== name);
  localStorage.setItem('employees', JSON.stringify(employees));

  // Remove from DOM
  row.remove();
}

// Load saved data on page load
window.onload = displayPayroll;

// Clear all data
document.getElementById('clearData').addEventListener('click', function () {
  localStorage.removeItem('employees');
  displayPayroll();
});