const path = require('node:path')
const fs = require('fs-extra')

// Clean up test data before the tests run
const actual = path.join(__dirname, '..', 'test-data', 'actual')
fs.emptyDirSync(actual)
console.log('Cleanup test data: done')
