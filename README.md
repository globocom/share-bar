[![Travis Build Status](https://travis-ci.org/globocom/share-bar.svg)](https://travis-ci.org/globocom/share-bar)
[![Dependencies Status](https://david-dm.org/globocom/share-bar.svg)](https://david-dm.org/globocom/share-bar#info=dependencies)
[![Dev Dependencies Status](https://david-dm.org/globocom/share-bar/dev-status.svg)](https://david-dm.org/globocom/share-bar#info=devDependencies)
[![Coverage Status](https://img.shields.io/coveralls/globocom/share-bar.svg)](https://coveralls.io/r/globocom/share-bar)

# share-bar

> A pure JS plugin to generate a share bar for social media, used by Globo.com.

## Table of Contents

- [Browser Support](#browser-support)
- [How to Install](#how-to-install)
- [How to Use](#how-to-use)
- [Options](#options)
  * [Selector](#selector)
  * [Theme](#theme)
  * [classPopup](#classpopup)
  * [buttonWidth](#buttonwidth)
  * [buttonFullWidth](#buttonfullwidth)
  * [buttonPadding](#buttonpadding)
  * [maxSocialButtons](#maxsocialbuttons)
  * [networks](#networks)
  * [context](#context)
  * [campaign](#campaign)
  * [onCreateBar](#oncreatebar)
  * [onCreateButton](#oncreatebutton)
  * [onShare](#onshare)
  * [createBar](#createbar)
- [Contributing](#contributing)
  * [Icons](#icons)
- [Version](#version)
- [License](#license)

## Browser Support

| ![](http://raphamorim.io/assets/images/browser-support/chrome.png) | ![](http://raphamorim.io/assets/images/browser-support/firefox.png) | ![](http://raphamorim.io/assets/images/browser-support/ie.png) | ![](http://raphamorim.io/assets/images/browser-support/opera.png) | ![](http://raphamorim.io/assets/images/browser-support/safari.png) |
|:---:|:---:|:---:|:---:|:---:|
| All ✔ | 3.6+ ✔ | 9+ ✔ | 29+ ✔ |  5+ ✔ |

## How to Install

Install through NPM:

```
npm install @globocom/share-bar
```

## How to Use

Once you added the CSS and JS from the plugin on the page, you can simply do:

```javascript
new ShareBar({'facebookAppId': 'APP_ID'});
```

> `APP_ID` can be automatically pulled from the page if you're using Facebook meta tags ([meta tag open graph](https://developers.facebook.com/docs/sharing/webmasters#basic)), but we strongly recommend you to pass it manually.

Also, place the following markup where you want the share-bar to be:

```html
<div class="share-bar" 
    data-title="Content Title" 
    data-url="Content URL" 
    data-image-url="http://lorempixel.com/1080/700/" 
    data-hashtags="#example #sharebar">
</div>
```

Take a look at our [demo](https://globocom.github.io/share-bar/).

## Options

The plugin also offer a few options for customization.

### Selector

Allows to alter the default selector.

Default: `.share-bar`

```javascript
new ShareBar({selector: '.meu-seletor'});
```

### Theme

Allows to alter the default theme, using these options: `natural`, `dark`, `minimal` and `minimal light`.

Default: `'natural'`

```javascript
new ShareBar({theme: 'dark'});
```

### classPopup

Allows to alter the CSS class when opening the share popup windows. This is only necessary when the default class is already in use.

Default: `'share-popup'`

```javascript
new ShareBar({classPopup: 'class-popup'});
```

### buttonWidth

Allows to alter the reserved width for small buttons. This property does not change the actual button width, it only uses it to calculate how many buttons can fit in the share bar.

Default: `34`

```javascript
new ShareBar({buttonWidth: 50});
```

### buttonFullWidth

Allows to alter the reserved width for expanded buttons. This property does not change the actual button width, it only uses it to calculate how many buttons can fit in the share bar.

Default: `110`

```javascript
new ShareBar({buttonFullWidth: 150});
```

### buttonPadding

Allows to alter the reserved left padding for buttons. This property does not change the actual button width, it only uses it to calculate how many buttons can fit in the share bar.

Default: `4`

```javascript
new ShareBar({buttonPadding: 4});
```

### maxSocialButtons

Allows to alter the maximum quantity of social networks visible in the share bar. This is only necessary if you want to show more than 6 social networks in the bar.

Default: `6`

```javascript
new ShareBar({maxSocialButtons: 10});
```

### networks

Allows to alter the visible social networks in the share bar. This is the property you use to show or hide social network buttons in the share bar.

Default:

```javascript
[
  'facebook',
  'twitter',
  'whatsapp',
  'google',
  'pinterest',
  'email'
]
```

Customize it like this:

```javascript
new ShareBar({
  'networks': [
    'facebook',
    'twitter',
    function createSampleButton(container, buttonClass) {
      var data = this.getMetadataFromElement(container);
      buttonClass = buttonClass || '';

      this.createButton(
        container, 'sample', buttonClass,
        'http://www.sample.com/sample-sharer.php?u=' + data['url']
      );
    }
  ]
});
```

> Note: The WhatsApp icon is only visible on screens with less than 768px of width and are touch capable.

### context

Allows to alter the render context of the bar. This information is sent via `utm_medium` in the URL. This is useful when you have more than one sharebar on the page and you want to filter the actions on Google Analytics.

Default: `'desktop'`

```javascript
new ShareBar({context: 'mobile'});
```

### campaign

Allows to alter the campaign metadata of the bar. This information is sent via `utm_campaign` in the URL. This is useful when you have more than one sharebar on the page and you want to filter the actions on Google Analytics.

Default: `'share-bar'`

```javascript
new ShareBar({campaign: 'custom-campaign'});
```

### onCreateBar

A callback that fires when you create the bar. It receives the created bar as a parameter.

Default: `function (bar) { return false; }`

```javascript
new ShareBar({
  onCreateBar: function (bar) { 
    alert(bar.innerHTML); 
  }
});
```

### onCreateButton

A callback that fires after a share button is created. It receives the created button as a parameter.

Default: `function (button) { return false; }`

```javascript
new ShareBar({
  onCreateBar: function (button) { 
    alert(button.innerHTML); 
  }
});
```

### onShare

A callback that fires after a share button is clicked. It receives the clicked button as a parameter.

Default: `function (button) { return false; }`

```javascript
new ShareBar({
  onShare: function (button) { 
    alert(button.innerHTML); 
  }
});
```

### createBar

It's possible to call `createBar` to create the bar manually anytime you want.

```javascript
const sharebar = new ShareBar({maxSocialButtons: 10});
sharebar.createBar(document.querySelector('.minha-barra'));
```

> Note: For this to work, you need to have the HTML element shown above with the data-attributes already set.

## Contributing

This project depends on NodeJS and NPM.

To install the project dependencies use:

```
$ make setup
```

To run the tests:

```
$ make test
```

To run a local server for local development use:

```
$ make run
```

### Icons

The icones used in this project are SVGs embbededs in the JavaScript.

Adding more icons to the project:

1 - Add your SVG to the image path

```
$ mv ~/caminho/da/imagem.svg caminho/do/share/src/img/
```

2 - Generate the SVG icons again with Grunt

```
$ grunt icon
```

3 - Alter the CSS and Fonts to accomplish the desired look

4 - If you want, add a callback function to the button


## Version

To generate a new tag version, use this:

```
$ grunt bump
```

## License

The MIT License (MIT)

Copyright (c) 2016 globo.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
