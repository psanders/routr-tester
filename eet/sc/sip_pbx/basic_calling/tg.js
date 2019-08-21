require('dotenv').config()
const { cleanLoc } = require('../../../utils')
const dod_call_parameters = require('./dod_call_parameters')

describe('Test Group 1.3: Basic Call Origination(DOD) and Termination(DID)', function() {
    this.retries(4)

    after(async () => await cleanLoc())

    it('SC-IT.Conf.1.3.1: Verification of INVITE Message Parameters when Originating a DOD Call', done => dod_call_parameters(done))
    it.skip('SC-IT.Conf.1.3.2: INVITE Message Processing when Terminating a DID Call', void(0))
    it.skip('SC-IT.Conf.1.3.3: SIPPBX Support for Private when Processing INVITE for Terminating DID Call', void(0))
    it.skip('SC-IT.Conf.1.3.4: SIPPBX Support for Private when Generating INVITE for Originating DOD Call', void(0))

})