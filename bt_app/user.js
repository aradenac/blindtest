const {eCookie, dCookie} = require('./cookies')

class User {
    constructor(name) {
        this.name = name;
        this.token = null;
    }
    static validCookie(c) {
      var ret;

      ret = false;

      if ('userSession' in c) {
        ret = true;
      }

      return ret;
    }

    static isAdminCookie(c) {
      var ret = false;

      if (User.validCookie(c)){
        var userSession;

        userSession = dCookie(c.userSession);

        if ('isAdmin' in userSession && userSession.isAdmin) {
          ret = true;
        }

        return ret;
      }
    }
}

module.exports = User;
