/*global describe, it, expect, spyOn, glb,
         beforeEach, afterEach, jasmine */

describe('glb.lightbox Test Case', function () {
    'use strict';

    beforeEach(function () {
        this.el = document.createElement('div');
        this.el.classList.add('glb-share');
        document.body.appendChild(this.el);

        this.click = function (element) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 1, 0, 0);
            element.dispatchEvent(event);
        };
    });

    afterEach(function () {
        document.body.removeChild(this.el);
    });

    describe('setup', function () {
        it('should have glb.share on page', function () {
            expect(glb.share).not.toBe(undefined);
        });
    });
});