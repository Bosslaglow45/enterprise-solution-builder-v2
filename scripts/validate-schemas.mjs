// Validates that every catalog/*.schema.json is a well-formed JSON Schema (draft-07).
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'catalog');
const files = readdirSync(dir).filter((f) => f.endsWith('.schema.json')).sort();
if (files.length === 0) {
  console.error('No catalog/*.schema.json files found');
  process.exit(1);
}

// strict:false because the schemas use the non-standard "example" annotation keyword.
const ajv = new Ajv({ strict: false, allErrors: true });
let failed = 0;
for (const f of files) {
  try {
    const schema = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (!ajv.validateSchema(schema)) throw new Error(ajv.errorsText(ajv.errors));
    ajv.compile(schema);
    console.log('OK   ' + f);
  } catch (e) {
    failed++;
    console.error('FAIL ' + f + ': ' + e.message);
  }
}
if (failed) process.exit(1);
console.log(files.length + ' schema(s) valid');
