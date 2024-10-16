// Initialize the quotes array with some sample quotes
const quotes = [
    { text: "The best way to predict the future is to create it.", category: "Inspiration" },
    { text: "Success is not final; failure is not fatal.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// Function to display a random quote using innerHTML
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
}

// Function to create the form for adding quotes dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const inputQuote = document.createElement('input');
    inputQuote.setAttribute('id', 'newQuoteText');
    inputQuote.setAttribute('type', 'text');
    inputQuote.setAttribute('placeholder', 'Enter a new quote');

    const inputCategory = document.createElement('input');
    inputCategory.setAttribute('id', 'newQuoteCategory');
    inputCategory.setAttribute('type', 'text');
    inputCategory.setAttribute('placeholder', 'Enter quote category');

    const addButton = document.createElement('button');
    addButton.innerText = 'Add Quote';
    addButton.addEventListener('click', addQuote);

    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
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

        // Clear the input fields after adding the quote
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Show feedback to the user
        alert("New quote added successfully!");
    } else {
        alert("Please enter both a quote and a category.");
    }
}

// Attach event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call the function to create the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
});
