chai = require("chai")

chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)

sinonChai = require("sinon-chai")
chai.use(sinonChai)

global.expect = chai.expect
