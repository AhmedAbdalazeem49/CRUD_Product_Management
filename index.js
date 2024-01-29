// Set variables
let discount = document.getElementById("discount");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let total = document.getElementById("total");
let count = document.getElementById("count");
let ads = document.getElementById("ads");
let tableBody = document.querySelector("table tbody");
let deleteAll = document.getElementById("deleteAll");
let search = document.getElementById("search");
let searchTitle = document.getElementById("searchTitle");
let searchCategory = document.getElementById("searchCategory");

let mood = "create";
let temp;
let searchMood = "title";

// Get Total price Function
function getTotal() {
  if (price.value != "") {
    total.innerHTML =
      +price.value + +taxes.value + +ads.value - +discount.value;
    total.style.backgroundColor = "#040";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "#a00d02";
  }
}
// When to run the "getTotal()" Function
discount.onkeyup = () => getTotal();
price.onkeyup = () => getTotal();
taxes.onkeyup = () => getTotal();
ads.onkeyup = () => getTotal();

// Create Product Function "Important part"
let dataPro;
if (localStorage.product) {
  dataPro = JSON.parse(localStorage.product);
} else {
  dataPro = [];
}

submit.onclick = () => {
  if (title.value != "" && price.value != "" && category.value != "" && count.value <= 100) {
    let newPro = {
      title: title.value.toLowerCase(),
      price: price.value,
      taxes: taxes.value != "" ? taxes.value : 0,
      ads: ads.value != "" ? ads.value : 0,
      discount: discount.value != "" ? discount.value : 0,
      count: count.value != "" ? count.value : 1,
      category: category.value.toLowerCase(),
      total: total.innerHTML,
    };
    // Count Work "Decide how many copies of the product to generate"
    if (mood == "create") {
      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro.push(newPro);
      }
    } else {
      dataPro[temp] = newPro;
      mood = "create";
      submit.innerHTML = "Create";
      count.style.display = "block";
    }
    clearData();
  }
  // Local Storage Work "Save product in Local Storage"
  localStorage.setItem("product", JSON.stringify(dataPro));
  showData();
};

// Clear Inputs Function
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
  total.innerHTML = "";
}

// Read Product Function
function showData() {
  tableBody.innerHTML = "";
  for (let i = 0; i < dataPro.length; i++) {
    // create tr for each product in the dataPro Array
    let tr = document.createElement("tr");
    // Create td for each data info in our product
    let idTd = document.createElement("td");
    idTd.innerHTML = i;
    tr.appendChild(idTd);

    let titleTd = document.createElement("td");
    titleTd.innerHTML = dataPro[i].title;
    tr.appendChild(titleTd);

    let priceTd = document.createElement("td");
    priceTd.innerHTML = dataPro[i].price;
    tr.appendChild(priceTd);

    let taxesTd = document.createElement("td");
    taxesTd.innerHTML = dataPro[i].taxes;
    tr.appendChild(taxesTd);

    let adsTd = document.createElement("td");
    adsTd.innerHTML = dataPro[i].ads;
    tr.appendChild(adsTd);

    let discountTd = document.createElement("td");
    discountTd.innerHTML = dataPro[i].discount;
    tr.appendChild(discountTd);

    let totalTd = document.createElement("td");
    totalTd.innerHTML = dataPro[i].total;
    tr.appendChild(totalTd);

    let categoryTd = document.createElement("td");
    categoryTd.innerHTML = dataPro[i].category;
    tr.appendChild(categoryTd);

    // Create The Update Button
    let updateButtonTd = document.createElement("td");
    let updateButton = document.createElement("button");
    updateButtonTd.appendChild(updateButton);
    updateButton.id = "update";
    updateButton.innerHTML = "Update";
    tr.appendChild(updateButtonTd);
    updateButton.onclick = () => updateProduct(i);

    // Create The Delete Button
    let deleteButtonTd = document.createElement("td");
    let deleteButton = document.createElement("button");
    deleteButtonTd.appendChild(deleteButton);
    deleteButton.id = "delete";
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = () => deleteData(i);
    tr.appendChild(deleteButtonTd);

    // Add the tr to the tbody
    tableBody.appendChild(tr);
  }
  if (dataPro.length > 0) {
    // Create button
    deleteAll.innerHTML = "";
    let deleteAllButton = document.createElement("button");
    deleteAllButton.innerHTML = `Delete All ( ${dataPro.length} )`;
    deleteAll.appendChild(deleteAllButton);
    // Run the Function
    deleteAllButton.onclick = () => deleteAllData();
  } else {
    deleteAll.innerHTML = "";
  }
  getTotal();
}
// Run the showData in the Global context to show the data every time.
showData();

// Delete Data Function
function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.product = JSON.stringify(dataPro);
  showData();
}

// Delete All Function
function deleteAllData() {
  // two ways to empty the Array
  // dataPro = [];
  dataPro.splice(0);
  // Two ways to remove the products from the localStorage
  // localStorage.removeItem("product");
  localStorage.clear();
  showData();
}

// Update Product Function
function updateProduct(i) {
  // First Step
  // count.value = 1;
  count.style.display = "none";
  title.value = dataPro[i].title;
  category.value = dataPro[i].category;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  // total.innerHTML = dataPro[i].total;
  getTotal();
  submit.innerHTML = "Update";
  mood = "update";
  temp = i;
  window.scrollTo(0, 0);

  // Second step is above in else section with if mood
}

// Search Mood Function
function getSearchMood(id) {
  if (id == "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.value = "";
  showData();
  search.focus();
  search.setAttribute("placeholder", `Search by ${searchMood}`);
}
// When to run the "getSearchMood function"
searchCategory.onclick = function () {
  getSearchMood(this.id);
};

searchTitle.onclick = function () {
  getSearchMood(this.id);
};

// Search Function
function searchData(value) {
  tableBody.innerHTML = "";
  if (searchMood == "title") {
    for (let i = 0; i < dataPro.length; i++) {
      if (dataPro[i]["title"].includes(value.toLowerCase())) {
        // create tr for each product in the dataPro Array
        let tr = document.createElement("tr");
        // Create td for each data info in our product
        let idTd = document.createElement("td");
        idTd.innerHTML = i;
        tr.appendChild(idTd);

        let titleTd = document.createElement("td");
        titleTd.innerHTML = dataPro[i].title;
        tr.appendChild(titleTd);

        let priceTd = document.createElement("td");
        priceTd.innerHTML = dataPro[i].price;
        tr.appendChild(priceTd);

        let taxesTd = document.createElement("td");
        taxesTd.innerHTML = dataPro[i].taxes;
        tr.appendChild(taxesTd);

        let adsTd = document.createElement("td");
        adsTd.innerHTML = dataPro[i].ads;
        tr.appendChild(adsTd);

        let discountTd = document.createElement("td");
        discountTd.innerHTML = dataPro[i].discount;
        tr.appendChild(discountTd);

        let totalTd = document.createElement("td");
        totalTd.innerHTML = dataPro[i].total;
        tr.appendChild(totalTd);

        let categoryTd = document.createElement("td");
        categoryTd.innerHTML = dataPro[i].category;
        tr.appendChild(categoryTd);

        // Create The Update Button
        let updateButtonTd = document.createElement("td");
        let updateButton = document.createElement("button");
        updateButtonTd.appendChild(updateButton);
        updateButton.id = "update";
        updateButton.innerHTML = "Update";
        tr.appendChild(updateButtonTd);
        updateButton.onclick = () => updateProduct(i);

        // Create The Delete Button
        let deleteButtonTd = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButtonTd.appendChild(deleteButton);
        deleteButton.id = "delete";
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = () => deleteData(i);
        tr.appendChild(deleteButtonTd);

        // Add the tr to the tbody
        tableBody.appendChild(tr);
      }
    }
  } else {
    for (let i = 0; i < dataPro.length; i++) {
      if (dataPro[i]["category"].includes(value.toLowerCase())) {
        // create tr for each product in the dataPro Array
        let tr = document.createElement("tr");
        // Create td for each data info in our product
        let idTd = document.createElement("td");
        idTd.innerHTML = i;
        tr.appendChild(idTd);

        let titleTd = document.createElement("td");
        titleTd.innerHTML = dataPro[i].title;
        tr.appendChild(titleTd);

        let priceTd = document.createElement("td");
        priceTd.innerHTML = dataPro[i].price;
        tr.appendChild(priceTd);

        let taxesTd = document.createElement("td");
        taxesTd.innerHTML = dataPro[i].taxes;
        tr.appendChild(taxesTd);

        let adsTd = document.createElement("td");
        adsTd.innerHTML = dataPro[i].ads;
        tr.appendChild(adsTd);

        let discountTd = document.createElement("td");
        discountTd.innerHTML = dataPro[i].discount;
        tr.appendChild(discountTd);

        let totalTd = document.createElement("td");
        totalTd.innerHTML = dataPro[i].total;
        tr.appendChild(totalTd);

        let categoryTd = document.createElement("td");
        categoryTd.innerHTML = dataPro[i].category;
        tr.appendChild(categoryTd);

        // Create The Update Button
        let updateButtonTd = document.createElement("td");
        let updateButton = document.createElement("button");
        updateButtonTd.appendChild(updateButton);
        updateButton.id = "update";
        updateButton.innerHTML = "Update";
        tr.appendChild(updateButtonTd);
        updateButton.onclick = () => updateProduct(i);

        // Create The Delete Button
        let deleteButtonTd = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButtonTd.appendChild(deleteButton);
        deleteButton.id = "delete";
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = () => deleteData(i);
        tr.appendChild(deleteButtonTd);

        // Add the tr to the tbody
        tableBody.appendChild(tr);
      }
    }
  }
}

// When to run the "searchData Function"
search.onkeyup = function () {
  searchData(this.value);
};
