const { describe, it, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const childProcess = require('node:child_process')
const sinon = require('sinon')
const ffprobe = require('../../lib/video/ffprobe')

afterEach(() => {
  sinon.restore()
})

describe('ffprobe', () => {
  it('parses the FFProbe output rounded to 1 digit', (t, done) => {
    sinon.stub(childProcess, 'execFile').yields(undefined, '12.3456')
    ffprobe.getDuration('video.mp4', (err, duration) => {
      assert.equal(err, null)
      assert.equal(duration, 12.3)
      done()
    })
  })

  it('fail if FFProbe cannot be executed', (t, done) => {
    sinon.stub(childProcess, 'execFile').yields(new Error('Not found'))
    ffprobe.getDuration('video.mp4', (err, duration) => {
      assert.equal(err instanceof Error, true)
      done()
    })
  })

  it('handles unexpected FFProbe output', (t, done) => {
    sinon.stub(childProcess, 'execFile').yields(undefined, 'unexpected')
    ffprobe.getDuration('video.mp4', (err, duration) => {
      assert.equal(err instanceof Error, true)
      done()
    })
  })
})
