const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const sinon = require('sinon')
const gmagick = require('../../lib/image/gmagick')

function gm () {
  return {
    out: sinon.stub()
  }
}

describe('gmagick', () => {
  it('no arguments', () => {
    const image = gm()
    gmagick.addRawArgs(image, undefined)
    assert.equal(image.out.callCount, 0)
  })

  it('empty array of arguments', () => {
    const image = gm()
    gmagick.addRawArgs(image, [])
    assert.equal(image.out.callCount, 0)
  })

  it('single argument with no values', () => {
    const image = gm()
    gmagick.addRawArgs(image, ['-equalize'])
    assert.equal(image.out.callCount, 1)
    assert.deepEqual(image.out.args[0], ['-equalize'])
  })

  it('single argument with one value', () => {
    const image = gm()
    gmagick.addRawArgs(image, ['-modulate 120'])
    assert.equal(image.out.callCount, 1)
    assert.deepEqual(image.out.args[0], ['-modulate', '120'])
  })

  it('single argument with space-separated values', () => {
    const image = gm()
    gmagick.addRawArgs(image, ['-unsharp 2 0.5 0.5 0'])
    assert.equal(image.out.callCount, 1)
    assert.deepEqual(image.out.args[0], ['-unsharp', '2 0.5 0.5 0'])
  })

  it('multiple arguments', () => {
    const image = gm()
    gmagick.addRawArgs(image, [
      '-equalize',
      '-modulate 120',
      '-unsharp 2 0.5 0.5 0'
    ])
    assert.equal(image.out.callCount, 3)
    assert.deepEqual(image.out.args, [
      ['-equalize'],
      ['-modulate', '120'],
      ['-unsharp', '2 0.5 0.5 0']
    ])
  })
})
