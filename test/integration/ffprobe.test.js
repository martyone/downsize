const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const ffprobe = require('../../lib/video/ffprobe')

describe('ffprobe', () => {
  it('reads the duration of a video', (t, done) => {
    const name = 'test-data/input/videos/big_buck_bunny.mp4'
    ffprobe.getDuration(name, (err, duration) => {
      assert.equal(err, null)
      assert.equal(duration, 15.4)
      done()
    })
  })

  it('does not take the frame count into account', (t, done) => {
    const name = 'test-data/input/videos/single-frame.mov'
    ffprobe.getDuration(name, (err, duration) => {
      assert.equal(err, null)
      assert.equal(duration, 10)
      done()
    })
  })
})
