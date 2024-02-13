export function checkDueDate(inputDate) {
    // Parse the input date string
    const inputDateObj = new Date(inputDate);

    // Get the current date
    const currentDateObj = new Date();

    // Check if the input date is equal or greater than the current date
    if (inputDateObj >= currentDateObj) {
        return "Due";
    } else {
        return "Not Due";
    }
}