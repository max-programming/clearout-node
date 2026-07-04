const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const SPEC_DIR = path.join(__dirname, '..', 'libs', 'clearout-openapi-impl')

describe('OpenAPI spec loading', () => {
  test('generated JSON spec is in sync with the YAML source', () => {
    const yamlDoc = yaml.load(
      fs.readFileSync(path.join(SPEC_DIR, 'Clearout-OpenAPI-Spec-V3.yaml'), 'utf8')
    )
    const jsonDoc = require(path.join(SPEC_DIR, 'Clearout-OpenAPI-Spec-V3.json'))

    // normalize the same way the build script does (e.g. YAML timestamps -> strings)
    expect(jsonDoc).toEqual(JSON.parse(JSON.stringify(yamlDoc)))
  })

  test('client initializes without the YAML spec on disk (bundled environments)', async () => {
    const { OpenApiClient } = require(path.join(SPEC_DIR, 'index.js'))
    const yamlPath = path.join(SPEC_DIR, 'Clearout-OpenAPI-Spec-V3.yaml')
    const hiddenPath = yamlPath + '.hidden'

    // simulate a serverless bundle: the YAML file is not shipped
    fs.renameSync(yamlPath, hiddenPath)
    try {
      const client = await new OpenApiClient({ api_token: 'test_token' }).getClient()
      expect(typeof client.getCredits).toBe('function')
    } finally {
      fs.renameSync(hiddenPath, yamlPath)
    }
  })
})
