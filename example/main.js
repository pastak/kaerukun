const kaerukun = require('../libs/main');
kaerukun({
  config: () => {
    return {
      tasks: './test/fixtures/tasks/grouping',
      urls: {
        'a': [
          'https://example.com/foo',
          'https://example.com/bar',
        ],
        'b': [
          'https://example.com/bar',
        ]
      }
    };
  }
});
