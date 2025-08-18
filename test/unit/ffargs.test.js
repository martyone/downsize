const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const ffargs = require('../../lib/video/ffargs')

describe('ffargs', () => {
  it('crf for h264', () => {
    // Full range is 0-51 (not linear)
    // 17 is already near lossless so we consider it to be 100% quality
    // https://trac.ffmpeg.org/wiki/Encode/H.264
    assert.equal(ffargs.crf(0, 'h264'), 51)
    assert.equal(ffargs.crf(20, 'h264'), 44)
    assert.equal(ffargs.crf(50, 'h264'), 34)
    assert.equal(ffargs.crf(70, 'h264'), 27)
    assert.equal(ffargs.crf(100, 'h264'), 17)
  })

  it('crf for vpx', () => {
    // Full range is 0-63 (not linear)
    // 15 is already near lossless so we consider it to be 100% quality
    // https://trac.ffmpeg.org/wiki/Encode/VP9
    assert.equal(ffargs.crf(0, 'vpx'), 63)
    assert.equal(ffargs.crf(20, 'vpx'), 53)
    assert.equal(ffargs.crf(50, 'vpx'), 39)
    assert.equal(ffargs.crf(80, 'vpx'), 24)
    assert.equal(ffargs.crf(100, 'vpx'), 15)
  })

  describe('video filters', () => {
    it('uses yuv420p chroma subsampling by default', () => {
      // videos from recent iPhones use yuv420p10le
      // once converted to h264 they don't play well in browsers / macOS finder
      // ffmpeg recommends using yuv420p for best compatibility
      // see http://trac.ffmpeg.org/wiki/Encode/H.264
      // and https://trac.ffmpeg.org/wiki/Encode/VP9
      const vf = ffargs.videoFilters('source.mov', {})
      assert.match(vf, /format=yuv420p/)
    })

    it('handles MTS interlacing', () => {
      const vf = ffargs.videoFilters('source.mts', {})
      assert.match(vf, /yadif=1,format=yuv420p/)
    })

    it('handles VAAPI hardware acceleration', () => {
      const vf = ffargs.videoFilters('source.mov', { hwaccel: 'vaapi', bitrate: '1200k' })
      assert.match(vf, /format=nv12\|vaapi,hwupload/)
    })

    it('passes the video filter argument', () => {
      const args = ffargs.prepare('source.mov', 'target.mp4', {})
      const str = args.join(' ')
      assert.match(str, /-vf format=yuv420p/)
    })
  })

  describe('framerate', () => {
    it('sets to a default value if not specified', () => {
      const args = ffargs.prepare('source.mts', 'target.mp4', {})
      const str = args.join(' ')
      assert.match(str, /-r 25/)
      // these are not compatible with -r anymore with ffmpeg v6
      // we simply default to -fps_mode=auto
      assert.doesNotMatch(str, /-vsync/)
      assert.doesNotMatch(str, /-fps_mode/)
    })

    it('can specify a framerate value', () => {
      const args = ffargs.prepare('source.mts', 'target.mp4', { framerate: 60 })
      const str = args.join(' ')
      assert.match(str, /-r 60/)
      assert.doesNotMatch(str, /-vsync/)
      assert.doesNotMatch(str, /-fps_mode/)
    })

    it('keeps the source framerate if set to 0', () => {
      const args = ffargs.prepare('source.mts', 'target.mp4', { framerate: 0 })
      const str = args.join(' ')
      assert.doesNotMatch(str, /-r/)
      assert.match(str, /-fps_mode vfr/)
    })
  })
})
