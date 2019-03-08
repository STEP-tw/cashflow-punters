const ActiviyLog = require("../../src/model/activityLog");
const chai = require("chai");

describe("activityLog", function() {
  it("should add activity into activity log", function() {
    const log = new ActiviyLog();
    log.addActivity("added 100 rs to your account", "anu");
    chai
      .expect(log.activityLog[0].msg)
      .to.equal("added 100 rs to your account");
    chai.expect(log.activityLog[0].playerName).to.equal("anu");
  });
  it("should return log when player escaped from the race with rank", function() {
    const log = new ActiviyLog();
    log.logEscape("anu", 1);
    chai.expect(log.activityLog[0].playerName).to.equal("anu");
    chai
      .expect(log.activityLog[0].msg)
      .to.equal(" has escaped from rat race with rank 1");
  });
  it("should add MLM log into activity log", function() {
    const log = new ActiviyLog();
    log.logMLM(true, "anu");
    chai.expect(log.activityLog[0].playerName).to.equal("anu");
    chai.expect(log.activityLog[0].msg).to.equal(" got $500 for MLM");
  });
  it("should add MLM log into activity log", function() {
    const log = new ActiviyLog();
    log.logMLM(false, "anu");
    chai.expect(log.activityLog[0].playerName).to.equal("anu");
    chai.expect(log.activityLog[0].msg).to.equal(" didn't get MLM");
  });
});
