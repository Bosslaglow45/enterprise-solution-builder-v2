
const Ajv = require('ajv');
const fs = require('fs');
const ajv = new Ajv({ strict: false });

const schema = JSON.parse(fs.readFileSync('catalog/compute.schema.json', 'utf8'));
const validate = ajv.compile(schema);

const files = [
  'catalog/drivers/compute-dell.json',
  'catalog/drivers/compute-supermicro.json'
];

let allValid = true;
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(f, 'utf8'));
  const valid = validate(data);
  if (valid) {
    console.log('[PASS] ' + f);
  } else {
    allValid = false;
    console.error('[FAIL] ' + f, JSON.stringify(validate.errors, null, 2));
  }
}
process.exit(allValid ? 0 : 1);
