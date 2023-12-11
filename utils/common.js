export function formatDateInMDY(date) {
    const months = [
        "January", "February",
        "March", "April", "May",
        "June", "July", "August",
        "September", "October",
        "November", "December"
    ];
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate}, ${d.getFullYear}`;
}
export async function encryptText(text) {
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);

    // Generate a random initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    console.log("eindow => ", window, window.crypto.subtle);
    // Generate a random encryption key
    const key = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt']
    );

    // Encrypt the text using AES-GCM
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encodedText
    );

    // Combine IV and encrypted data into a single array
    const combinedArray = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
    combinedArray.set(iv, 0);
    combinedArray.set(new Uint8Array(encryptedData), iv.length);

    // Convert the encrypted data to a base64-encoded string
    const encryptedText = btoa(String.fromCharCode(...new Uint8Array(combinedArray)));

    return encryptedText;
}
export async function decryptText(encryptedText) {
    // Convert the base64-encoded string back to a Uint8Array
    const combinedArray = new Uint8Array(atob(encryptedText).split('').map(char => char.charCodeAt(0)));

    // Extract IV from the combined array
    const iv = combinedArray.slice(0, 12);

    // Extract encrypted data from the combined array
    const encryptedData = combinedArray.slice(12);

    // Generate the decryption key (assuming you have the key stored securely)
    const key = await window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['decrypt']
    );

    // Decrypt the encrypted data using AES-GCM
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        encryptedData
    );

    // Decode the decrypted data to text
    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);

    return decryptedText;
}
