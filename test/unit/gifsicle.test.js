const { describe, it, beforeEach, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const childProcess = require('node:child_process')
const sinon = require('sinon')
const gifsicle = require('../../lib/image/gifsicle')

describe('gifsicle', () => {
  beforeEach(() => {
    sinon.stub(childProcess, 'execFile').yields()
  })

  afterEach(() => {
    childProcess.execFile.restore()
  })

  it('throws if the image is not a GIF', (t, done) => {
    assert.throws(() => {
      gifsicle.createAnimatedGif('source.gif', 'target.jpg', {}, () => {})
    }, /extension/)
    done()
  })

  it('cannot crop an animated GIF', (t, done) => {
    const opts = { height: 100, width: 100 }
    assert.throws(() => {
      gifsicle.createAnimatedGif('source.gif', 'target.gif', opts, () => {})
    }, /crop/)
    done()
  })

  it('calls Gifsicle', (t, done) => {
    const opts = { width: 100 }
    gifsicle.createAnimatedGif('source.gif', 'target.gif', opts, err => {
      assert.equal(err, undefined)
      assert.equal(childProcess.execFile.callCount, 1)
      const call = childProcess.execFile.args[0]
      const program = call[0]
      const args = call[1].join(' ')
      assert.equal(program, 'gifsicle')
      assert.match(args, /-o target\.gif source\.gif/)
      done()
    })
  })

  it('resizes to a given width', (t, done) => {
    const opts = { width: 100 }
    gifsicle.createAnimatedGif('source.gif', 'target.gif', opts, err => {
      assert.equal(err, undefined)
      assert.equal(childProcess.execFile.callCount, 1)
      const call = childProcess.execFile.args[0]
      const args = call[1].join(' ')
      assert.match(args, /--resize-fit 100x_/)
      done()
    })
  })

  it('resizes to a given height', (t, done) => {
    const opts = { height: 100 }
    gifsicle.createAnimatedGif('source.gif', 'target.gif', opts, err => {
      assert.equal(err, undefined)
      assert.equal(childProcess.execFile.callCount, 1)
      const call = childProcess.execFile.args[0]
      const args = call[1].join(' ')
      assert.match(args, /--resize-fit _x100/)
      done()
    })
  })
})
