/*global describe, it, expect, glb, spyOn,
         beforeEach, afterEach */

describe('glb.lightbox Test Case', function () {
    'use strict';

    beforeEach(function () {

        this.click = function (element) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 1, 0, 0);
            element.dispatchEvent(event);
        };

        this.createShareContainer = function () {
            var element = document.createElement('div');
            element.classList.add('glb-share');
            document.body.appendChild(element);
            return element;
        };

        this.el = this.createShareContainer();
    });

    afterEach(function () {
        document.body.removeChild(this.el);
    });

    describe('setup', function () {
        it('should have glb.share on page', function () {
            expect(glb.share).not.toBe(undefined);
        });
    });

    describe('init', function () {
        it('should call mergeOptions method', function () {
            var spy = spyOn(glb.share, 'mergeOptions'),
                options = {'selector': '.test'};
            glb.share.init(options);
            expect(spy).toHaveBeenCalledWith(options);
        });

        it('should call createBars method', function () {
            var spy = spyOn(glb.share, 'createBars');
            glb.share.init();
            expect(spy).toHaveBeenCalled();
        });

        it('should set containers atribute with selected elements', function () {
            glb.share.init();
            expect(glb.share.containers[0]).toEqual(this.el);
        });
    });

    describe('mergeOptions', function () {
        it('should create properties with defaultOptions', function () {
            glb.share.mergeOptions();
            expect(glb.share.selector).toEqual('.glb-share');
            expect(glb.share.networks).toEqual({
                'facebook': glb.share.createFacebookButton
            });
        });

        it('should merge options with defaultOptions', function () {
            glb.share.mergeOptions({'selector': 'test'});
            expect(glb.share.selector).toEqual('test');
        });

        it('should not create options when not exists in defaultOptions', function () {
            glb.share.mergeOptions({'selectorEspecial': 'test'});
            expect(glb.share.selectorEspecial).toBe(undefined);
        });
    });

    describe('createBars', function () {
        it('should call createBar method for each selected element', function () {
            var otherEl = this.createShareContainer(),
                spy = spyOn(glb.share, 'createBar');

            glb.share.containers = [otherEl, this.el];
            glb.share.createBars();

            expect(spy).toHaveBeenCalledWith(otherEl);
            expect(spy).toHaveBeenCalledWith(this.el);
        });
    });

    describe('createBar', function () {
        it('should create wrapper element to share buttons', function () {
            var wrapper = '';

            glb.share.createBar(this.el);
            wrapper = this.el.querySelector('.glb-share-wrapper');

            expect(wrapper).not.toBe(null);
        });

        it('should call createFacebookButton method', function () {
            var spy = spyOn(glb.share, 'createFacebookButton');
            glb.share.networks['facebook'] = glb.share.createFacebookButton;
            glb.share.createBar(this.el);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('createFacebookButton', function () {
        it('should create facebook button', function () {
            var wrapper = '';

            glb.share.createBar(this.el);
            wrapper = this.el.querySelector('.glb-share-wrapper');
            glb.share.createFacebookButton(wrapper);

            expect(wrapper.querySelector('.share-facebook')).not.toBe(null);
        });
    });
});