let quotes = [];

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes.push(...JSON.parse(savedQuotes));
    }
}

// Function to extract unique categories and populate the dropdown
function populateCategories() {
    const categories = new Set(quotes.map(quote => quote.category));
    const categoryFilter = document.getElementById('categoryFilter');
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Save the last viewed quote to session storage
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Retrieve the last viewed quote from session storage
function loadLastViewedQuote() {
    const lastQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    }
}

// Function to show a random quote
function showRandomQuote() {
    filterQuotes(); // Ensure it displays filtered quotes
}

// Function to filter and display quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    } else {
        document.getElementById('quoteDisplay').innerText = "No quotes available for this category.";
    }
}

// Load the last selected category from local storage
function loadLastSelectedCategory() {
    const lastSelectedCategory = localStorage.getItem('selectedCategory');
    if (lastSelectedCategory) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
        filterQuotes();
    }
}

// Function to create the form for adding new quotes dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const quoteTextInput = document.createElement('input');
    quoteTextInput.setAttribute('id', 'newQuoteText');
    quoteTextInput.setAttribute('type', 'text');
    quoteTextInput.setAttribute('placeholder', 'Enter a new quote');
    
    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.setAttribute('id', 'newQuoteCategory');
    quoteCategoryInput.setAttribute('type', 'text');
    quoteCategoryInput.setAttribute('placeholder', 'Enter quote category');

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    formContainer.appendChild(quoteTextInput);
    formContainer.appendChild(quoteCategoryInput);
    formContainer.appendChild(addButton);

    document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert("New quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Export quotes to JSON file
function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
                populateCategories();
            } else {
                alert('Invalid JSON format. Please provide an array of quotes.');
            }
        } catch (error) {
            alert('Error reading the JSON file.');
        }
    };

    const file = event.target.files[0];
    if (file) {
        fileReader.readAsText(file);
    }
}

// Add event listeners on page load
window.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    populateCategories();
    loadLastViewedQuote();
    loadLastSelectedCategory();
    createAddQuoteForm();
    
    document.getElementById('exportQuotesBtn').addEventListener('click', exportQuotesToJson);
    document.getElementById('importJsonBtn').addEventListener('change', importFromJsonFile);
});
