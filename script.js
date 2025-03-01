
// Function to load card data from JSON file with nested categories support
async function loadCardData() {
    try {
        let response = await fetch('./cards_data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch JSON file: ' + response.statusText);
        }
        let data = await response.json();

        console.log("JSON Data Loaded:", data); // Debugging log

        contentGroups = data.contentGroups;
        functionGroups = data.functionGroups;

        updateGroupSelection();
        updateFunctionSelection();
    } catch (error) {
        console.error("Error loading JSON data:", error);
        alert("Failed to load flashcard data. Please ensure the JSON file is accessible.");
    }
}

// Initialize flashcard groups
let contentGroups = {};
let functionGroups = [];

// Function to show/hide sidebar
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
}

// Function to create checkboxes for nested categories
function createCategoryCheckboxes(parentElement, categories) {
    Object.entries(categories).forEach(([category, items]) => {
        let container = document.createElement("div");
        container.classList.add("category-container");

        let categoryTitle = document.createElement("div");
        categoryTitle.classList.add("category-title");
        categoryTitle.textContent = category;

        let categoryCheckbox = document.createElement("input");
        categoryCheckbox.type = "checkbox";
        categoryCheckbox.classList.add("category-checkbox");
        categoryCheckbox.dataset.category = category;
        categoryCheckbox.onclick = (event) => {
            event.stopPropagation(); // Prevent dropdown expansion when clicking checkbox
        };
        categoryCheckbox.onchange = () => {
            let checkboxes = container.querySelectorAll(".content-checkbox");
            checkboxes.forEach(cb => cb.checked = categoryCheckbox.checked);
        };

        let contentDiv = document.createElement("div");
        contentDiv.classList.add("category-content");

        categoryTitle.prepend(categoryCheckbox);
        categoryTitle.onclick = (event) => {
            if (!event.target.classList.contains("category-checkbox")) {
                contentDiv.style.display = contentDiv.style.display === "block" ? "none" : "block";
            }
        };

        if (Array.isArray(items)) {
            items.forEach(item => {
                let label = document.createElement("label");
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.classList.add("content-checkbox");
                checkbox.value = item;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(" " + item));
                contentDiv.appendChild(label);
            });
        } else {
            createCategoryCheckboxes(contentDiv, items); // Recursive call for deeper nesting
        }

        container.appendChild(categoryTitle);
        container.appendChild(contentDiv);
        parentElement.appendChild(container);
    });
}

// Function to populate content group selection in the sidebar
function updateGroupSelection() {
    const groupSelection = document.getElementById("groupSelection");
    groupSelection.innerHTML = "";

    createCategoryCheckboxes(groupSelection, contentGroups);
}

// Function to toggle function selection visibility
function toggleFunctionSelection() {
    let functionDiv = document.getElementById("functionSelection");
    functionDiv.style.display = functionDiv.style.display === "block" ? "none" : "block";
}

// Function to populate function selection in the sidebar
function updateFunctionSelection() {
    const functionSelection = document.getElementById("functionSelection");
    functionSelection.innerHTML = "";

    functionGroup.forEach(func => {
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("function-checkbox");
        checkbox.value = func;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + func));
        functionSelection.appendChild(label);
    });
}

// Function to select/deselect all function cards
function toggleAllFunctions() {
    let isChecked = document.getElementById("selectAllFunctions").checked;
    document.querySelectorAll(".function-checkbox").forEach(cb => cb.checked = isChecked);
}

// Function to generate random flashcards
function generateFlashcards() {
    let selectedContent = [];
    document.querySelectorAll(".content-checkbox:checked").forEach(cb => {
        selectedContent.push(cb.value);
    });

    let selectedFunctions = [];
    document.querySelectorAll(".function-checkbox:checked").forEach(cb => {
        selectedFunctions.push(cb.value);
    });

    let functionOnly = document.getElementById("functionOnly").checked;
    let contentOnly = document.getElementById("contentOnly").checked;

    if (selectedContent.length === 0 && !functionOnly) {
        alert("Please select at least one content card.");
        return;
    }

    if (selectedFunctions.length === 0 && !contentOnly) {
        alert("Please select at least one function card.");
        return;
    }

    if (functionOnly) {
        document.getElementById("function-card").innerText = selectedFunctions[Math.floor(Math.random() * selectedFunctions.length)];
        document.getElementById("content-card").innerText = "Content";
    } else if (contentOnly) {
        document.getElementById("content-card").innerText = selectedContent[Math.floor(Math.random() * selectedContent.length)];
        document.getElementById("function-card").innerText = "Function";
    } else {
        document.getElementById("content-card").innerText = selectedContent[Math.floor(Math.random() * selectedContent.length)];
        document.getElementById("function-card").innerText = selectedFunctions[Math.floor(Math.random() * selectedFunctions.length)];
    }
}

// Ensure JSON data loads properly before running other scripts
document.addEventListener("DOMContentLoaded", async () => {
    await loadCardData();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then((reg) => console.log("Service Worker Registered!", reg))
    .catch((err) => console.log("Service Worker Registration Failed!", err));
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  // Create an install button
  let installButton = document.createElement("button");
  installButton.textContent = "Install App";
  installButton.style.position = "fixed";
  installButton.style.bottom = "20px";
  installButton.style.right = "20px";
  installButton.style.padding = "10px";
  installButton.style.background = "#007BFF";
  installButton.style.color = "#fff";
  installButton.style.border = "none";
  installButton.style.cursor = "pointer";

  installButton.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.log("User installed the app");
      }
      installButton.remove();
    });
  });

  document.body.appendChild(installButton);
});
// 🔹 Load Nested Function Categories
function loadFunctionCategories() {
    fetch('cards_data.json')
        .then(response => response.json())
        .then(data => {
            const functionSelectionDiv = document.getElementById('functionSelection');
            functionSelectionDiv.innerHTML = ''; // Clear previous content

            Object.entries(data.functionGroups).forEach(([category, functions]) => {
                // Create Category Header
                const categoryContainer = document.createElement('div');
                categoryContainer.classList.add('function-container');

                const categoryHeader = document.createElement('div');
                categoryHeader.classList.add('function-title');
                categoryHeader.innerHTML = `<input type="checkbox" class="function-checkbox" onchange="toggleCategoryFunctions(this)"> ${category} ▼`;

                // Create Function List (Initially Hidden)
                const functionList = document.createElement('div');
                functionList.classList.add('function-content');
                functionList.style.display = 'none';

                functions.forEach(func => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.classList.add('function-checkbox');
                    checkbox.value = func;
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(` ${func}`));
                    functionList.appendChild(label);
                });

                // Add Toggle Feature to Category Header
                categoryHeader.addEventListener('click', () => {
                    functionList.style.display = functionList.style.display === 'none' ? 'block' : 'none';
                });

                // Append to Sidebar
                categoryContainer.appendChild(categoryHeader);
                categoryContainer.appendChild(functionList);
                functionSelectionDiv.appendChild(categoryContainer);
            });
        })
        .catch(error => console.error('Error loading function categories:', error));
}

// 🔹 Toggle all functions in a category
function toggleCategoryFunctions(checkbox) {
    const functionContainer = checkbox.parentElement.nextElementSibling;
    const checkboxes = functionContainer.querySelectorAll('.function-checkbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// Load function categories on page load
document.addEventListener('DOMContentLoaded', loadFunctionCategories);
