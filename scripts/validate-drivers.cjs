
const Ajv = require('ajv');
const fs = require('fs');
const ajv = new Ajv({ strict: false });

const computeSchema = JSON.parse(fs.readFileSync('catalog/compute.schema.json', 'utf8'));
const storageSchema = JSON.parse(fs.readFileSync('catalog/storage.schema.json', 'utf8'));

const validateCompute = ajv.compile(computeSchema);
const validateStorage = ajv.compile(storageSchema);

const computeFiles = [
  'catalog/drivers/compute-dell.json',
  'catalog/drivers/compute-supermicro.json'
];

const storageFiles = [
  'catalog/drivers/storage-dell.json',
  'catalog/drivers/storage-scality.json',
  'catalog/drivers/storage-cloud.json'
];

let allValid = true;

for (const f of computeFiles) {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const valid = validateCompute(data);
  if (valid) {
    console.log('[PASS Compute] ' + f);
  } else {
    allValid = false;
    console.error('[FAIL Compute] ' + f, JSON.stringify(validateCompute.errors, null, 2));
  }
}

for (const f of storageFiles) {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const valid = validateStorage(data);
  if (valid) {
    console.log('[PASS Storage] ' + f);
  } else {
    allValid = false;
    console.error('[FAIL Storage] ' + f, JSON.stringify(validateStorage.errors, null, 2));
  }
}

process.exit(allValid ? 0 : 1);
