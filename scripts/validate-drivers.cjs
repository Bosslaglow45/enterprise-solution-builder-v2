
const Ajv = require('ajv');
const fs = require('fs');
const ajv = new Ajv({ strict: false });

const computeSchema = JSON.parse(fs.readFileSync('catalog/compute.schema.json', 'utf8'));
const storageSchema = JSON.parse(fs.readFileSync('catalog/storage.schema.json', 'utf8'));
const networkingSchema = JSON.parse(fs.readFileSync('catalog/networking.schema.json', 'utf8'));
const securitySchema = JSON.parse(fs.readFileSync('catalog/security.schema.json', 'utf8'));
const resilienceSchema = JSON.parse(fs.readFileSync('catalog/resilience.schema.json', 'utf8'));

const validateCompute = ajv.compile(computeSchema);
const validateStorage = ajv.compile(storageSchema);
const validateNetworking = ajv.compile(networkingSchema);
const validateSecurity = ajv.compile(securitySchema);
const validateResilience = ajv.compile(resilienceSchema);

const computeFiles = [
  'catalog/drivers/compute-dell.json',
  'catalog/drivers/compute-supermicro.json'
];

const storageFiles = [
  'catalog/drivers/storage-dell.json',
  'catalog/drivers/storage-scality.json',
  'catalog/drivers/storage-cloud.json'
];

const networkingFiles = [
  'catalog/drivers/networking-dell.json',
  'catalog/drivers/networking-arista.json'
];

const securityFiles = [
  'catalog/drivers/security-fortinet.json',
  'catalog/drivers/security-checkpoint.json',
  'catalog/drivers/security-sophos.json'
];

const resilienceFiles = [
  'catalog/drivers/resilience-veeam.json',
  'catalog/drivers/resilience-commvault.json',
  'catalog/drivers/resilience-cohesity.json'
];

let allValid = true;

function runValidation(files, validator, label) {
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    const valid = validator(data);
    if (valid) {
      console.log('[PASS ' + label + '] ' + f);
    } else {
      allValid = false;
      console.error('[FAIL ' + label + '] ' + f, JSON.stringify(validator.errors, null, 2));
    }
  }
}

runValidation(computeFiles, validateCompute, 'Compute');
runValidation(storageFiles, validateStorage, 'Storage');
runValidation(networkingFiles, validateNetworking, 'Networking');
runValidation(securityFiles, validateSecurity, 'Security');
runValidation(resilienceFiles, validateResilience, 'Resilience');

process.exit(allValid ? 0 : 1);
