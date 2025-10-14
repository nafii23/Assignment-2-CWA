module.exports = {
  generateRandomString: function(context, events, done) {
    context.vars.randomString = Math.random().toString(36).substring(7);
    return done();
  }
};