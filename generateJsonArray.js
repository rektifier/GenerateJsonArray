const fs = require('fs');

// Read command-line arguments
const defaultNrOfItems = 5;
const nrOfItems = parseInt(process.argv[2], 10) || defaultNrOfItems;
const inputFile = process.argv[3] || 'input.json';
const outputFile = 'output.json';

// Function to generate a GUID
const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const random = (Math.random() * 16) | 0;
        const value = char === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
};

// Function to process $alternate placeholders
const processAlternate = (placeholder, index) => {
    // Match content inside square brackets [ ... ]
    const arrayContent = placeholder.match(/\[(.*?)\]/);
    if (!arrayContent) return placeholder; // If no valid array format, return as-is

    // Match both quoted strings and unquoted values inside single quotes
    const values = arrayContent[1]
        .split(/,(?=(?:[^']*'[^']*')*[^']*$)/) // Split by commas, ignoring commas inside single quotes
        .map(value => value.trim().replace(/^'|'$/g, '')); // Trim and remove single quotes

    // Return the value at the correct index, alternating as necessary
    return values[index % values.length];
};

// Function to replace placeholders dynamically
const replacePlaceholders = (text, index) => {
    const replacers = {
        $index: () => (index).toString(),
        $guid: () => generateGuid(),
        $alternate: (placeholder, index) => processAlternate(placeholder, index),
    };

    return text.replace(/\$[a-zA-Z]+\[.*?\]|\$[a-zA-Z]+/g, (match) => {
        const base = match.includes('[') ? match.split('[')[0] : match;
        if (base === '$alternate') {
            return replacers.$alternate(match, index);
        }
        return replacers[base] ? replacers[base](match, index) : match;
    });
};

// Function to check if the text is valid JSON
const isValidJson = (str) => {
    try {
        // Attempt to parse JSON, and return true if it succeeds
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};


try {
    console.log(`Reading ${inputFile}...`);
    const inputText = fs.readFileSync(inputFile, 'utf8');
    const resultArray = [];

    for (let i = 1; i <= nrOfItems; i++) {
        let processedText = replacePlaceholders(inputText, i);
        
        // Check if the processed text is valid JSON before attempting to parse
        if (isValidJson(processedText)) {
            const objectToRepeat = JSON.parse(processedText);
            resultArray.push(objectToRepeat);
        } else {
            console.error(`Invalid JSON after replacement for iteration ${i + 1}: ${processedText}`);
        }
    }

    console.log(`Writing to ${outputFile}...`);
    fs.writeFileSync(outputFile, JSON.stringify(resultArray, null, 2), 'utf8');
    console.log(`${nrOfItems} objects written to ${outputFile}`);
} catch (error) {
    console.error('Error:', error.message);
}
