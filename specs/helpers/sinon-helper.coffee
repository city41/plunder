_ = require('lodash')
sinon = require('sinon')

beforeEach ->
  @sandbox = sinon.sandbox.create()

  for method in ['spy', 'stub']
    this[method] = _.bind(@sandbox[method], @sandbox)

afterEach ->
  @sandbox.restore()
