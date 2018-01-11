# kaerukun 🐸

kaerukun 🐸 will associate urls and tasks for [puppeteer](https://github.com/GoogleChrome/puppeteer).

## Example

### `kaerukun.config.js`

```javascript
module.exports = () => {
  return {
    tasks: './tasks',
    urls: [
      'http://example.com/foo',
      'http://example.com/bar'
    ]
  };
};
```

### `tasks/example.js`

```javascript
module.exports = async (page) => {
  const titleAndUrl = await page.evaluate(() => [document.title, location.href])
  console.log(...titleAndUrl)
}
```
will output
```
Example Domain http://example.com/foo
Example Domain http://example.com/bar
```

1st argument is [class: Page of puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page).

## Usage

1. Install 🐸 to your project.
  - `$ npm i -D kaerukun`
2. Put config file `kaerukun.config.js` on your project root.
3. `$ ./node_modules/.bin/kaerukun`

### Node API

```javascript
require('kaerukun')({config: './kaerukun.config.js'});
```

#### Options

- `config` (optional): Config file path.

## Configuration

### Options

- `tasks <String>`: Directory path includes tasks js file.
- `urls <String[] | Object>`: URLs to execute tasks.
  - You can make group of tasks, for example you make task-groups `a` and `b` then group `a` will execute on `https://example.com/foo` and `https://example.com/bar`, group `b` will execute on `https://example.com/bar`.

```javascript
{
  tasks: './tasks',
  urls: {
    'a': [
      'https://example.com/foo',
      'https://example.com/bar'
    ],
    'b': [
      'https://example.com/bar'
    ]
  }
}
```
  - `Group a tasks` is `./tasks/a/*.js`
  - `Group b tasks` is `./tasks/b/*.js`
  - `./tasks/*.js` will execute on all urls.
