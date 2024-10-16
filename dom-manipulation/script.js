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

// Attach event listener to the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to add a new quote using innerHTML
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

// Attach event listener to the "Add Quote" button
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
