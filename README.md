# Spider_SW_task1_Cryptography

First the keys are generated and the file is signed with the private key
For verification it reads the file to be verified (filePath), its signature file (filePath.sig), and a public key (publicKey.pem) from the file system.
It then uses the crypto module to create a verification object with SHA256 as the hashing algorithm.
The file's content is fed into the verification object.
Finally, it checks if the signature is valid using the public key. If the signature is valid, it means the file is authentic; otherwise, it has been tampered with. The result is logged to the console.

## Working
First run
```
node /path/crypt.js
->generate
->sign
->path to file
```

Then to verify

```
node /path/crypt.js
->verify
->path to file

```
