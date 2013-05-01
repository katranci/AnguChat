'use strict';

xdescribe('directives', function() {

    var $compile;
    var $rootScope;

    // Load the application module which contains the directives
    beforeEach(module('AnguChat.directives'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Replaces the "messages" element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile('<messages>content</messages>')($rootScope);
        // Check that the compiled element contains the template content
        expect(element.html()).toContain('<div id="messagesWindow">');
    });
});