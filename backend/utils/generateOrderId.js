const { v4: uuidv4 } = require('uuid');

const generateOrderId = () => {
    // Generate a new UUID
    const id = uuidv4();

    // Get the current timestamp in milliseconds
    const timestamp = new Date().getTime();

    // Combine the UUID and timestamp
    const combinedId = `${id}${timestamp}`;

    // Extract the first 10 digits from the combined ID
    const numericId = extractNumericId(combinedId);

    // Insert hyphens at non-consecutive positions
    const idWithHyphens = insertHyphens(numericId);

    return idWithHyphens;
}

const extractNumericId = (str) => {
    // Extract only the digits from the combined ID
    return str.replace(/\D/g, '').substring(0, 10);
}

const insertHyphens = (str) => {
    const length = str.length;

    // Ensure there are at least 3 characters
    if (length < 3) {
        return str;
    }

    // Insert hyphens at non-consecutive positions
    let hyphen1Index, hyphen2Index;

    do {
        hyphen1Index = Math.floor(Math.random() * (2)) + 1;
        hyphen2Index = Math.floor(Math.random() * (6)) + 1;
    } while (hyphen2Index === hyphen1Index + 1 || hyphen2Index === hyphen1Index - 1);

    let result = '';

    for (let i = 0; i < length; i++) {
        result += str[i];
        if (i === hyphen1Index || i === hyphen2Index) {
            result += '-';
        }
    }

    return result;
}

module.exports = generateOrderId;
