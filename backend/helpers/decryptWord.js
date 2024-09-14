import crypto from 'crypto';

const decryptWord = (word) => {
    // Split the word into two parts: the encrypted text and the IV
    const parts = word.split(':');

    // Create a decipher object
    const iv = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[0];
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.SECRET_KEY), iv);

    // Decrypt the word
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Return the decrypted word
    return decrypted;
};

export default decryptWord;