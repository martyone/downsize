const path = require('node:path')
const fs = require('node:fs')

// Clean up test data before the tests run
const actual = path.join(__dirname, '..', 'test-data', 'actual')
fs.rmSync(actual, { recursive: true, force: true })
fs.mkdirSync(actual)
console.log('Cleanup test data: done')
