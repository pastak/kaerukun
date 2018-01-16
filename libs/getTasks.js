const fs = require('fs');
const path = require('path');
const uniq = require('array-unique');

const mappingTasks = (url, tasks) => {
  if (!tasks) return [];
  return tasks.map(filePath => {return {filePath, url};});
};

module.exports = (config) => {
  const {tasks, urls} = config;
  let taskGroupList = {};

  const getTasksInDir = (dirPath) => {
    return fs.readdirSync(path.resolve(dirPath))
      .filter(_ => fs.statSync(path.resolve(dirPath, _)).isFile())
      .map(fileName => path.join(dirPath, fileName));
  };

  const tasksForAll = getTasksInDir(tasks);

  fs.readdirSync(path.resolve(tasks))
    .filter(_ => fs.statSync(path.resolve(tasks, _)).isDirectory())
    .forEach((group) => {
      taskGroupList[group] = getTasksInDir(path.join(tasks, group));
    });

  let result = [];
  let _urls = [];
  if (Array.isArray(urls)) {
    urls.forEach((item) => {
      if (typeof item === 'string') {
        _urls.push(item);
      }
    });
  } else {
    Object.keys(urls).forEach((group) => {
      urls[group].forEach((url) => {
        _urls.push(url);
        result.push(...mappingTasks(url, taskGroupList[group]));
      });
    });
  }
  uniq(_urls).forEach((url) => {
    result.push(...mappingTasks(url, tasksForAll));
  });
  return result;
};
