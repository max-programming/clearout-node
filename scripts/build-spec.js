// Regenerates Clearout-OpenAPI-Spec-V3.json from the YAML source of truth.
// Run `npm run spec:build` after editing the YAML spec.
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const specDir = path.join(__dirname, '..', 'libs', 'clearout-openapi-impl')
const yamlPath = path.join(specDir, 'Clearout-OpenAPI-Spec-V3.yaml')
const jsonPath = path.join(specDir, 'Clearout-OpenAPI-Spec-V3.json')

const spec = yaml.load(fs.readFileSync(yamlPath, 'utf8'))
fs.writeFileSync(jsonPath, JSON.stringify(spec, null, 2) + '\n')

console.log('Wrote', path.relative(process.cwd(), jsonPath))
