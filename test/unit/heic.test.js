const { describe, it, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const childProcess = require('node:child_process')
const async = require('async')
const sinon = require('sinon')
const heic = require('../../lib/image/heic')

afterEach(() => {
  sinon.restore()
})

describe('heic', () => {
  it('calls gmagick and exiftool', (t, done) => {
    sinon.stub(childProcess, 'execFile').callsFake(fakeExecFile)
    heic.convert('input1.heic', err => {
      assert.equal(err, null)
      assert.equal(childProcess.execFile.callCount, 3)
      assert.equal(childProcess.execFile.getCall(0).args[0], 'magick')
      assert.equal(childProcess.execFile.getCall(1).args[0], 'exiftool')
      assert.equal(childProcess.execFile.getCall(2).args[0], 'magick')
      done()
    })
  })

  it('stops at the first failing call', (t, done) => {
    sinon.stub(childProcess, 'execFile').callsFake(fakeExecFileFail)
    heic.convert('input2.heic', err => {
      assert.equal(err.message, 'FAIL')
      assert.equal(childProcess.execFile.callCount, 1)
      assert.equal(childProcess.execFile.getCall(0).args[0], 'magick')
      done()
    })
  })

  it('only processes each file once', (t, done) => {
    sinon.stub(childProcess, 'execFile').callsFake(fakeExecFile)
    async.parallel([
      done => heic.convert('input3.heic', done),
      done => heic.convert('input3.heic', done)
    ]).then(res => {
      assert.equal(childProcess.execFile.callCount, 3)
      done()
    })
  })

  it('keeps track of files already processed', (t, done) => {
    sinon.stub(childProcess, 'execFile').callsFake(fakeExecFile)
    async.parallel([
      done => heic.convert('input4.heic', done),
      done => heic.convert('input5.heic', done),
      done => heic.convert('input6.heic', done),
      done => heic.convert('input4.heic', done)
    ]).then(res => {
      assert.equal(childProcess.execFile.callCount, 3 * 3)
      done()
    })
  })
})

function fakeExecFile (cmd, args, done) {
  setTimeout(done, 50)
}

function fakeExecFileFail (cmd, args, done) {
  setTimeout(() => done(new Error('FAIL')), 50)
}
