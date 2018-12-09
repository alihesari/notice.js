# Notice.js

![](https://api.travis-ci.org/toolkito/notice.js.svg?branch=master)

> A beautiful and modern, yet fully customizable notification library.

## Download & Install

- You can quickly install Notice.js via [NPM](http://npmjs.com/):
```bash
npm install notice.js --save
```
    
- Using [Bower](http://bower.io/):
```bash
bower install notice.js --save
```

- Direct download: [Click here](https://github.com/toolkito/notice.js/archive/master.zip)

### Link styles

```html
<link rel="stylesheet" href="dist/noticejs.css" />
```

### Add scripts
```html
<script src="dist/notice.js"></script>
```

## Usage

**Basic:**
```javascript
new NoticeJs({
    text: 'Notification message',
    position: 'topLeft',
}).show();
```

**With animation:**

Supports css animations, [animate.css](https://daneden.github.io/animate.css/)
```javascript
new NoticeJs({
    text: 'Notification message',
    position: 'topLeft',
    animation: {
        open: 'animated bounceInRight',
        close: 'animated bounceOutLeft'
    }
}).show();
```





