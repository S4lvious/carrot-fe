const fs = require('fs');
const path = require('path');

// Leggi la versione dal package.json
const packageJson = require('./package.json');
const version = packageJson.version;
console.log(`Versione trovata in package.json: ${version}`);

// Percorsi dei file di ambiente (adatta i percorsi se necessario)
const envFiles = [
  path.join(__dirname, 'src', 'environment', 'environment.ts'),
];

// Funzione per aggiornare un file sostituendo il campo version
envFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Assumi che nei file esista una riga con "version: '...'"
    // oppure con "version: '{{VERSION}}'" come placeholder
    const newContent = content.replace(/version:\s*['"][^'"]*['"]/, `version: '${version}'`);

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Aggiornato ${filePath} con la versione ${version}`);
  } else {
    console.error(`Il file ${filePath} non esiste`);
  }
});
