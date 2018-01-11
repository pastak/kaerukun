const test = require('ava');
const getTasks = require('../../libs/getTasks');

test('works', t => {
  const config = {
    tasks: './test/fixtures/tasks/simple',
    urls: [
      'https://example.com/foo',
      'https://example.com/bar'
    ]
  };
  const actual = getTasks(config);
  t.deepEqual(actual, [
    {filePath: 'test/fixtures/tasks/simple/fuga.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/simple/hoge.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/simple/fuga.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/simple/hoge.js', url: 'https://example.com/bar'},
  ]);
});

test('grouping', t => {
  const config = {
    tasks: './test/fixtures/tasks/grouping',
    urls: {
      'a': [
        'https://example.com/foo',
        'https://example.com/bar'
      ],
      'b': [
        'https://example.com/bar'
      ]
    }
  };
  const actual = getTasks(config);
  t.deepEqual(actual, [
    {filePath: 'test/fixtures/tasks/grouping/a/fuga.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/grouping/a/hoge.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/grouping/a/fuga.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/grouping/a/hoge.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/grouping/b/fuga.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/grouping/b/hoge.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/grouping/all.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/grouping/all.js', url: 'https://example.com/bar'},
  ]);
});
