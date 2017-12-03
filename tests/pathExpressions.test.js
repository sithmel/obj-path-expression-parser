/* eslint-env node, mocha */
const { assert } = require('chai')
const pathExpressionParser = require('..')

describe.only('pathExpressionParser', () => {
  it('one expression', () => {
    const iter = pathExpressionParser('hello', { hello: 1 })
    assert.deepEqual(Array.from(iter), [['hello']])
  })
  it('2 expressions', () => {
    const iter = pathExpressionParser('hello,world', { hello: 1, world: 2 })
    assert.deepEqual(Array.from(iter), [['hello'], ['world']])
  })
  it('1 expression 2 fragments', () => {
    const iter = pathExpressionParser('hello.world', { hello: { world: 2 } })
    assert.deepEqual(Array.from(iter), [['hello', 'world']])
  })
  it('2 expressions 2 fragments', () => {
    const iter = pathExpressionParser('hello.world,bye', { hello: { world: 2 }, bye: 3 })
    assert.deepEqual(Array.from(iter), [['hello', 'world'], ['bye']])
  })
  it('sub pathExpressions', () => {
    const iter = pathExpressionParser('hello(world,mars)', { hello: { world: 2, mars: 3 } })
    assert.deepEqual(Array.from(iter), [['hello', 'world'], ['hello', 'mars']])
  })
  it('sub pathExpressions (2)', () => {
    const iter = pathExpressionParser('(hello,goodbye,ciao)(world,mars)',
      { hello: { world: 2, mars: 3 }, goodbye: { world: 2, mars: 3 }, ciao: { world: 2, mars: 3 } })
    assert.deepEqual(Array.from(iter), [
      ['hello', 'world'], ['goodbye', 'world'], ['ciao', 'world'],
      ['hello', 'mars'], ['goodbye', 'mars'], ['ciao', 'mars']])
  })
  it('globbing', () => {
    const iter = pathExpressionParser('(hello,goodbye,ciao)[*]',
      { hello: { world: 2, mars: 3 }, goodbye: { world: 2, mars: 3 }, ciao: { world: 2, mars: 3 } })
    assert.deepEqual(Array.from(iter), [
      ['hello', 'world'], ['hello', 'mars'],
      ['goodbye', 'world'], ['goodbye', 'mars'],
      ['ciao', 'world'], ['ciao', 'mars']])
  })
  it('escaping globbing', () => {
    const iter = pathExpressionParser('[\\*]',
      { '*': 1, hello: 2 })
    assert.deepEqual(Array.from(iter), [['*']])
  })
  it('slices', () => {
    const iter = pathExpressionParser('numbers[1:-1]',
      { numbers: [0, 1, 2, 3] })
    assert.deepEqual(Array.from(iter), [['numbers', 1], ['numbers', 2]])
  })
})
