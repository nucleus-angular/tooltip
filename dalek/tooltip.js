module.exports = {
  name: 'tooltip',

  //need to wait for dalekjs action moveTo to be included in the stable build
  /*'should show content when mouse enters handle': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .moveTo('[data-ut="auto-top-left"] .handle')
      .assert.visible('[data-ut="auto-top-left"] .content', 'content is visible')
    .done();
  },

  'should hide content when mouse leaves handle': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .moveTo('[data-ut="auto-top-left"] .handle')
    .moveTo('body')
      .assert.notVisible('[data-ut="auto-top-left"] .content', 'content is not visible')
    .done();
  },

  'should not show content when mouse enters handle for sticky tooltip': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .moveTo('[data-ut="sticky"] .handle')
      .assert.notVisible('[data-ut="sticky"] .content', 'content is not visible')
    .done();
  },

  'should show content when clicking handle for sticky tooltip': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="sticky"] .handle')
      .assert.visible('[data-ut="sticky"] .content', 'content is visible')
    .done();
  },

  'should not hide content when mouse leaves handle for sticky tooltip': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="sticky"] .handle')
    .moveTo('[data-ut="sticky"] .handle')
    .moveTo('body')
      .assert.visible('[data-ut="sticky"] .content', 'content is visible')
    .done();
  },

  'should hide content when clicking handle for sticky tooltip that is already showing content': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="sticky"] .handle')
    .click('[data-ut="sticky"] .handle')
      .assert.notVisible('[data-ut="sticky"] .content', 'content is not visible')
    .done();
  },

  'should position tooltip in the bottom right when the handle is in the top left of the window with auto position enabled': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="auto-top-left"] .handle')
      .assert.css('[data-ut="auto-top-left"] .content', 'top', '15px', 'top positioned correctly')
      .assert.css('[data-ut="auto-top-left"] .content', 'left', '122px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the bottom left when the handle is in the top right of the window with auto position enabled': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="auto-top-right"] .handle')
      .assert.css('[data-ut="auto-top-right"] .content', 'top', '15px', 'top positioned correctly')
      .assert.css('[data-ut="auto-top-right"] .content', 'left', '-100px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the top right when the handle is in the bottom left of the window with auto position enabled': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="auto-bottom-left"] .handle')
      .assert.css('[data-ut="auto-bottom-left"] .content', 'top', '-27px', 'top positioned correctly')
      .assert.css('[data-ut="auto-bottom-left"] .content', 'left', '144px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the top left when the handle is in the bottom right of the window with auto position enabled': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="auto-bottom-right"] .handle')
      .assert.css('[data-ut="auto-bottom-right"] .content', 'top', '-27px', 'top positioned correctly')
      .assert.css('[data-ut="auto-bottom-right"] .content', 'left', '-100px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the top left': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-top-left"] .handle')
      .assert.css('[data-ut="manual-top-left"] .content', 'top', '-27px', 'top positioned correctly')
      .assert.css('[data-ut="manual-top-left"] .content', 'left', '-100px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the top middle': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-top-middle"] .handle')
      .assert.css('[data-ut="manual-top-middle"] .content', 'top', '-27px', 'top positioned correctly')
      .assert.css('[data-ut="manual-top-middle"] .content', 'left', '29px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the top right': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-top-right"] .handle')
      .assert.css('[data-ut="manual-top-right"] .content', 'top', '-27px', 'top positioned correctly')
      .assert.css('[data-ut="manual-top-right"] .content', 'left', '146px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the middle left': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-middle-left"] .handle')
      .assert.css('[data-ut="manual-middle-left"] .content', 'top', '-6px', 'top positioned correctly')
      .assert.css('[data-ut="manual-middle-left"] .content', 'left', '-100px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the middle right': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-middle-right"] .handle')
      .assert.css('[data-ut="manual-middle-right"] .content', 'top', '-6px', 'top positioned correctly')
      .assert.css('[data-ut="manual-middle-right"] .content', 'left', '166px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the bottom left': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-bottom-left"] .handle')
      .assert.css('[data-ut="manual-bottom-left"] .content', 'top', '15px', 'top positioned correctly')
      .assert.css('[data-ut="manual-bottom-left"] .content', 'left', '-100px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the bottom middle': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-bottom-middle"] .handle')
      .assert.css('[data-ut="manual-bottom-middle"] .content', 'top', '15px', 'top positioned correctly')
      .assert.css('[data-ut="manual-bottom-middle"] .content', 'left', '40px', 'left positioned correctly')
    .done();
  },

  'should position tooltip in the bottom right': function(test) {
    test.open('http://localhost:3000/home')
    .wait(500)
    .click('[data-ut="manual-bottom-right"] .handle')
      .assert.css('[data-ut="manual-bottom-right"] .content', 'top', '15px', 'top positioned correctly')
      .assert.css('[data-ut="manual-bottom-right"] .content', 'left', '168px', 'left positioned correctly')
    .done();
  }*/
}