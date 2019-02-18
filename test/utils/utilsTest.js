const {range,assignId} = require('../../src/utils/array.js');
const {expect} = require('chai');

describe('range', function() {
  it('should return range between 2 indexes', function() {
    expect(range(1,3)).to.be.an("array").that.includes(1,2,3);
  });
}); 

describe('assignId', function() {
  it('should assign unique turn to each player', function() {
    expect(assignId([{},1])).to.have.property('turn').to.equal(1);
  });
});