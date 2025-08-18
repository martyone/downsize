const { describe, it, afterEach, mock } = require('node:test')
const assert = require('node:assert/strict')
const childProcess = require('node:child_process')
const ffprobe = require('../../lib/video/ffprobe')

function mockExecFile (err, data) {
  return (cmd, args, cb) => setImmediate(() => cb(err, data))
}

afterEach(() => {
  mock.reset()
})

describe('ffprobe', () => {
  it('parses the FFProbe output rounded to 1 digit', (t, done) => {
    mock.method(childProcess, 'execFile', mockExecFile(undefined, '12.3456'))
    ffprobe.getDuration('video.mp4', (err, duration) => {
      assert.equal(err, null)
      assert.equal(duration, 12.3)
      done()
    })
  })

  it('fail if FFProbe cannot be executed', (t, done) => {
    mock.method(childProcess, 'execFile', mockExecFile(new Error('Not found')))
    ffprobe.getDuration('video.mp4', (err, duration) => {
      assert.equal(err instanceof Error, true)
      done()
    })
  })

  it('handles unexpected FFProbe output', (t, done) => {
    mock.method(childProcess, 'execFile', mockExecFile(undefined, 'unexpected'))
    ffprobe.getDuration('video.mp4', (err, duration) => {
      assert.equal(err instanceof Error, true)
      done()
    })
  })
})
