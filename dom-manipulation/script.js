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
    fileReader.onload = function (event) {
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
const quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Save quotes to local storage
function saveQuotes(quotes) {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = randomQuote ? randomQuote.text : 'No quotes available!';
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    const newQuote = {
        id: Date.now(),
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    saveQuotes(quotes);
    showRandomQuote();
    populateCategories();
}

// Populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    document.getElementById('quoteDisplay').innerText = filteredQuotes.length
        ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text
        : 'No quotes available!';
}

// Sync quotes with server and resolve conflicts
async function syncQuotesWithServer() {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverQuotes = await fetchQuotesFromServer();

    const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
    saveQuotes(mergedQuotes);

    alert('Quotes have been synced with the server.');
}

// Merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
    const merged = [...localQuotes];
    let conflictsResolved = false;

    serverQuotes.forEach(serverQuote => {
        const existingQuote = merged.find(q => q.id === serverQuote.id);

        if (!existingQuote) {
            merged.push(serverQuote);
        } else {
            existingQuote.text = serverQuote.text;
            existingQuote.category = serverQuote.category;
            conflictsResolved = true;
        }
    });

    if (conflictsResolved) {
        notifyConflictResolution();
    }

    return merged;
}

// Notify users of conflict resolution
function notifyConflictResolution() {
    const notification = document.createElement('div');
    notification.innerText = 'Conflict resolved: Server quotes took precedence.';
    notification.style.position = 'fixed';
    notification.style.bottom = '10px';
    notification.style.right = '10px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = '#ffcc00';
    notification.style.color = '#000';
    notification.style.border = '1px solid #000';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000); // Remove after 5 seconds
}

// Periodically sync with the server
setInterval(syncQuotesWithServer, 30000);

// Fetch quotes from a simulated server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();

        const formattedQuotes = serverQuotes.map(post => ({
            id: post.id,
            text: post.title,
            category: 'Server' // Mock category for server quotes
        }));

        return formattedQuotes;
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
} 
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { id: 1, text: "The best way to predict the future is to create it.", category: "Motivation" },
    { id: 2, text: "Success usually comes to those who are too busy to be looking for it.", category: "Success" }
];

// Function to show a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><small>${randomQuote.category}</small>`;
}

// Function to add a new quote
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    const newQuote = {
        id: Date.now(),
        text: newQuoteText,
        category: newQuoteCategory
    };

    quotes.push(newQuote);
    saveQuotes(quotes);
    showRandomQuote();
    populateCategories();

    // Send the new quote to the server
    await postQuoteToServer(newQuote);
}

// Function to post the new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: quote.text,
                body: quote.category,
                userId: 1
            })
        });

        if (response.ok) {
            console.log('Quote successfully sent to the server');
        } else {
            console.error('Failed to send quote to the server');
        }
    } catch (error) {
        console.error('Error during posting quote to the server:', error);
    }
}

// Function to save quotes to local storage
function saveQuotes(quotes) {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to populate the category filter dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>${quote.text}</p><small>${quote.category}</small>`).join('');
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes(quotes);
        alert('Quotes imported successfully!');
        populateCategories();
        showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to load quotes from local storage and initialize
function initialize() {
    populateCategories();
    showRandomQuote();

    const lastFilter = localStorage.getItem('lastFilter');
    if (lastFilter) {
        document.getElementById('categoryFilter').value = lastFilter;
        filterQuotes();
    }
}

// Remember last selected filter in local storage
function rememberFilter() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastFilter', selectedCategory);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('categoryFilter').addEventListener('change', () => {
    filterQuotes();
    rememberFilter();
});

// Initialize the app on load
window.onload = initialize;

