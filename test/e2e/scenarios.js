'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
describe('AnguChat', function() {
  
  describe('New user', function() {

    beforeEach(function() {
      delete localStorage.user;
      browser().navigateTo('../../app/index.html');
    });

    it('should see the login screen', function() {
      expect(element('#loginWindowContainer').attr('class')).toBe('visible');
    });

    it('should\'t login with an empty nickname', function() {
      input('nickname').enter('');
      element('#loginForm :submit').click();
      expect(element('#loginWindowContainer').attr('class')).not().toBe('hidden');
      expect(element('#loginWindowContainer').attr('class')).toBe('visible');
    });

    it('should login in with a valid nickname', function() {
      var nickname = 'Runner' + Date.now();
      input('nickname').enter(nickname);
      element('#loginForm :submit').click();
      expect(element('#loginWindowContainer').attr('class')).toBe('hidden');
      expect(repeater('#messagesWindow li').column('message.text')).toEqual(['Welcome to AnguChat ' + nickname + '!']);
    });
  });
});