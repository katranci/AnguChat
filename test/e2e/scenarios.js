'use strict';


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

  describe('User after successful login', function() {

    beforeEach(function() {
        delete localStorage.user;
        browser().navigateTo('../../app/index.html');

        var nickname = 'Runner' + Date.now();
        input('nickname').enter(nickname);
        element('#loginForm :submit').click();

        sleep(1);
    });

    it('should see a logout button next to his name', function() {
        expect(element('#usersWindow li[is-logged-in-user="true"] a.logout').count()).toBe(1);
    });

    it('should be able to logout', function() {
      confirmOK();
      element('#usersWindow li[is-logged-in-user="true"] a.logout').click();
      expect(element('#usersWindow li[is-logged-in-user="true"]').count()).toBe(0);
    });

    it('shouldn\'t be logged out if he pressed the cancel button', function() {
      confirmCancel();
      element('#usersWindow li[is-logged-in-user="true"] a.logout').click();
      expect(element('#usersWindow li[is-logged-in-user="true"]').count()).toBe(1);
    });
  });
});