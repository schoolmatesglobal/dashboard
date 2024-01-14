export function splitName(fullName) {
  // Check if fullName is null or undefined
  if (!fullName) {
    // Handle the case where fullName is null or undefined
    return { firstname: '', lastname: '' };
  }

  // Split the full name into an array of words
  const words = fullName.split(' ');

  // Initialize variables for first and last names
  let firstname = '';
  let lastname = '';

  // Check if there are at least two words in the array
  if (words.length >= 2) {
    // The first word is the first name
    firstname = words[0];
    
    // The rest of the words are considered part of the last name
    lastname = words.slice(1).join(' ');
  } else if (words.length === 1) {
    // If there's only one word, consider it as the first name
    firstname = words[0];
  }

  // Create an object to hold the first and last names
  const nameInfo = {
    firstname,
    lastname,
  };

  return nameInfo;
}
  
//   // Example usage:
//   const fullName = 'Tony Bon';
//   const nameInfo = splitName(fullName);
//   console.log(nameInfo.firstname); // Output: Tony
//   console.log(nameInfo.lastname);  // Output: Bon
  