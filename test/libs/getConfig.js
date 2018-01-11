const test = require('ava');
const getConfig = require('../../libs/getConfig');

const expect = {
  tasks: './tasks',
  urls: [
    'https://example.com/foo',
    'https://example.com/bar'
  ]
};

test('works', t => {
  const config = getConfig('./test/fixtures/config.js');
  t.deepEqual(config, expect);
});

test('receive function', t => {
  const f = () => {
    return {
      tasks: './tasks',
      urls: [
        'https://example.com/foo',
        'https://example.com/bar'
      ]
    };
  };
  const config = getConfig(f);
  t.deepEqual(config, expect);
});
