const { describe, it, afterEach, mock } = require('node:test')
const assert = require('node:assert/strict')
const childProcess = require('node:child_process')
const async = require('async')
const heic = require('../../lib/image/heic')

function mockExecFile (err, data) {
  return (cmd, args, cb) => setImmediate(() => cb(err, data))
}

afterEach(() => {
  mock.reset()
})

describe('heic', () => {
  it('calls gmagick and exiftool', (t, done) => {
    mock.method(childProcess, 'execFile', mockExecFile(null))
    heic.convert('input1.heic', err => {
      assert.equal(err, null)
      assert.equal(childProcess.execFile.mock.callCount(), 3)
      assert.equal(childProcess.execFile.mock.calls[0].arguments[0], 'magick')
      assert.equal(childProcess.execFile.mock.calls[1].arguments[0], 'exiftool')
      assert.equal(childProcess.execFile.mock.calls[2].arguments[0], 'magick')
      done()
    })
  })

  it('stops at the first failing call', (t, done) => {
    mock.method(childProcess, 'execFile', mockExecFile(new Error('FAIL')))
    heic.convert('input2.heic', err => {
      assert.equal(err.message, 'FAIL')
      assert.equal(childProcess.execFile.mock.callCount(), 1)
      assert.equal(childProcess.execFile.mock.calls[0].arguments[0], 'magick')
      done()
    })
  })

  it('only processes each file once', (t, done) => {
    mock.method(childProcess, 'execFile', mockExecFile(null))
    async.parallel([
      done => heic.convert('input3.heic', done),
      done => heic.convert('input3.heic', done)
    ]).then(res => {
      assert.equal(childProcess.execFile.mock.callCount(), 3)
      done()
    })
  })

  it('keeps track of files already processed', (t, done) => {
    mock.method(childProcess, 'execFile', mockExecFile(null))
    async.parallel([
      done => heic.convert('input4.heic', done),
      done => heic.convert('input5.heic', done),
      done => heic.convert('input6.heic', done),
      done => heic.convert('input4.heic', done)
    ]).then(res => {
      assert.equal(childProcess.execFile.mock.callCount(), 3 * 3)
      done()
    })
  })
})
