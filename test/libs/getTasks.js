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
      ],
      'c': [
        'https://example.com/baz'
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
    {filePath: 'test/fixtures/tasks/grouping/all.js', url: 'https://example.com/baz'},
  ]);
});

test('recursive grouping', t => {
  const config = {
    tasks: './test/fixtures/tasks/r-grouping',
    urls: {
      'a': [
        {
          'a': [
            'https://example.com/foo',
            'https://example.com/bar'
          ],
          'b': [
            'https://example.com/bar'
          ],
          'c': [
            'https://example.com/baz'
          ]
        },
        'https://example.com/abaz'
      ],
      'b': [
        'https://example.com/bbaz'
      ]
    }
  };
  const actual = getTasks(config);
  t.deepEqual(actual, [
    {filePath: 'test/fixtures/tasks/r-grouping/a/a-all.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/a/fuga.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/a/hoge.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/a-all.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/a/fuga.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/a/hoge.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/b/fuga.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/b/hoge.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/a-all.js', url: 'https://example.com/baz'},
    {filePath: 'test/fixtures/tasks/r-grouping/a/a-all.js', url: 'https://example.com/abaz'},
    {filePath: 'test/fixtures/tasks/r-grouping/b/fuga.js', url: 'https://example.com/bbaz'},
    {filePath: 'test/fixtures/tasks/r-grouping/all.js', url: 'https://example.com/foo'},
    {filePath: 'test/fixtures/tasks/r-grouping/all.js', url: 'https://example.com/bar'},
    {filePath: 'test/fixtures/tasks/r-grouping/all.js', url: 'https://example.com/baz'},
    {filePath: 'test/fixtures/tasks/r-grouping/all.js', url: 'https://example.com/abaz'},
    {filePath: 'test/fixtures/tasks/r-grouping/all.js', url: 'https://example.com/bbaz'},
  ]);
});
