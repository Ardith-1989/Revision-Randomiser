
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
        functionGroup = data.functionGroup;

        updateGroupSelection();
        updateFunctionSelection();
    } catch (error) {
        console.error("Error loading JSON data:", error);
        alert("Failed to load flashcard data. Please ensure the JSON file is accessible.");
    }
}

// Initialize flashcard groups
let contentGroups = {};
let functionGroup = [];

// Function to show/hide sidebar
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
}

// Function to update function card selection dropdown
function updateFunctionSelection() {
    const functionSelection = document.getElementById("functionSelection");
    functionSelection.innerHTML = "";

    let functionContainer = document.createElement("div");
    functionContainer.classList.add("function-container");

    let functionTitle = document.createElement("div");
    functionTitle.classList.add("function-title");
    functionTitle.textContent = "Select Function Cards";

    let functionCheckbox = document.createElement("input");
    functionCheckbox.type = "checkbox";
    functionCheckbox.classList.add("function-checkbox");
    functionCheckbox.onclick = (event) => {
        event.stopPropagation(); // Prevent dropdown expansion when clicking checkbox
    };
    functionCheckbox.onchange = () => {
        let checkboxes = functionContainer.querySelectorAll(".function-option-checkbox");
        checkboxes.forEach(cb => cb.checked = functionCheckbox.checked);
    };

    let functionContent = document.createElement("div");
    functionContent.classList.add("function-content");

    functionGroup.forEach(func => {
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("function-option-checkbox");
        checkbox.value = func;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + func));
        functionContent.appendChild(label);
    });

    functionTitle.prepend(functionCheckbox);
    functionTitle.onclick = (event) => {
        if (!event.target.classList.contains("function-checkbox")) {
            functionContent.style.display = functionContent.style.display === "block" ? "none" : "block";
        }
    };

    functionContainer.appendChild(functionTitle);
    functionContainer.appendChild(functionContent);
    functionSelection.appendChild(functionContainer);
}

// Ensure JSON data loads properly before running other scripts
document.addEventListener("DOMContentLoaded", async () => {
    await loadCardData();
});
