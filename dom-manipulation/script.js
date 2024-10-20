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
