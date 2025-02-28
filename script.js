document.addEventListener("DOMContentLoaded", function () {
    let contentCard = document.getElementById("content-card");
    let functionCard = document.getElementById("function-card");

    async function loadCards() {
        const response = await fetch("cards_data.json");
        const data = await response.json();
        return data;
    }

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    async function generateFlashcards() {
        let data = await loadCards();
        let contentGroups = Object.values(data.contentGroups);
        let randomCategory = getRandomElement(contentGroups);
        let randomSubcategory = getRandomElement(Object.values(randomCategory));
        let randomContent = getRandomElement(randomSubcategory);

        let randomFunction = getRandomElement(data.functionGroup);

        contentCard.innerText = randomContent;
        functionCard.innerText = randomFunction;
    }

    // Event listeners for clicking on the displayed cards
    contentCard.addEventListener("click", async () => {
        let data = await loadCards();
        let contentGroups = Object.values(data.contentGroups);
        let randomCategory = getRandomElement(contentGroups);
        let randomSubcategory = getRandomElement(Object.values(randomCategory));
        let randomContent = getRandomElement(randomSubcategory);
        contentCard.innerText = randomContent;
    });

    functionCard.addEventListener("click", async () => {
        let data = await loadCards();
        let randomFunction = getRandomElement(data.functionGroup);
        functionCard.innerText = randomFunction;
    });

    document.querySelector("button").addEventListener("click", generateFlashcards);

    // Initial generation of flashcards
    generateFlashcards();
});
