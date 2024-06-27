const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to generate RSA keys
function generateKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  fs.writeFileSync('publicKey.pem', publicKey.export({ type: 'spki', format: 'pem' }));
  fs.writeFileSync('privateKey.pem', privateKey.export({ type: 'pkcs8', format: 'pem' }));

  console.log('Public and private keys have been generated.');
}

// Function to sign a file
function signFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const privateKey = fs.readFileSync('privateKey.pem', 'utf8');
  const sign = crypto.createSign('SHA256');
  sign.update(fileBuffer);
  const signature = sign.sign(privateKey, 'hex');

  fs.writeFileSync(`${filePath}.sig`, signature);
  console.log(`File signed. Signature saved to ${filePath}.sig`);
}

// Function to verify a file's signature
function verifyFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const signaturePath = `${filePath}.sig`;
  const signature = fs.readFileSync(signaturePath, 'utf8');
  const publicKey = fs.readFileSync('publicKey.pem', 'utf8');

  const verify = crypto.createVerify('SHA256');
  verify.update(fileBuffer);
  const isVerified = verify.verify(publicKey, signature, 'hex');

  console.log(isVerified ? 'The file is authentic.' : 'The file has been tampered with.');
}

// CLI interface
rl.question('Do you want to generate keys, sign a file, or verify a file? (generate/sign/verify): ', (action) => {
  if (action === 'generate') {
    generateKeys();
    rl.close();
  } else if (action === 'sign' || action === 'verify') {
    rl.question('Enter the file path: ', (filePath) => {
      if (action === 'sign') {
        signFile(filePath);
      } else {
        verifyFile(filePath);
      }
      rl.close();
    });
  } else {
    console.log('Invalid action.');
    rl.close();
  }
});