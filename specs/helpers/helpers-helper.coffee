_ = require('lodash')

global.helpers = (config) ->
  beforeEach ->
    _.assign(this, config)
