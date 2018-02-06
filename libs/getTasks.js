const fs = require('fs');
const path = require('path');
const uniq = require('array-unique');

const mappingTasks = (url, tasks) => {
  if (!tasks) return [];
  if (Object.keys(tasks).length === 0) return [];
  return tasks.filter(_ => _).map(filePath => {return {filePath, url};});
};

module.exports = (config) => {
  let {tasksDir, tasks, urls} = config;
  tasksDir = tasks;
  let taskGroupList = {};

  const getTasksInDir = (dirPath, noRecursive = false) => {
    return fs.readdirSync(path.resolve(dirPath))
      .map(fileName => {
        if (fs.statSync(path.resolve(dirPath, fileName)).isFile()) {
          return path.join(dirPath, fileName);
        } else {
          if (noRecursive) return;
          let t = {}
          t[fileName] = getTasksInDir(path.join(dirPath, fileName));
          return t;
        }
      });
  };

  const tasksForAll = getTasksInDir(tasksDir, true);

  fs.readdirSync(path.resolve(tasksDir))
    .forEach((group) => {
      if (fs.statSync(path.resolve(tasksDir, group)).isFile()) return;
      taskGroupList[group] = getTasksInDir(path.join(tasksDir, group));
    });

  // make TaskList flatten

  let flatTaskList = {};
  const flattenTaskList = (obj, prefix = '') => {
    if (!obj) return;
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (typeof value === 'string') {
        flatTaskList[prefix + key] = value;
        return;
      } else if (Array.isArray(value)) {
        flatTaskList[prefix + key] = [];
        value.forEach(val => {
          if (typeof val === 'string') {
            flatTaskList[prefix + key].push(val)
          } else if (typeof val === 'object') {
            flattenTaskList(val, prefix + key + '/');
          }
        });
      }
    })
  }
  flattenTaskList(taskGroupList);

  let allResult = [];
  let allUrls = [];

  const recursiveMapping = (urls, prefix = '') => {
    if (Array.isArray(urls)) {
      allUrls.push(...urls);
      return mappingTasks(urls, flatTaskList);
    } else {
      let result = [];
      Object.keys(urls).forEach((group) => {
        urls[group].forEach((url) => {
          if (typeof url === 'string') {
            allUrls.push(url);
            const targetTasks = [].concat(
              ...Object.keys(flatTaskList)
                .filter(
                  key => (new RegExp('^' + key)).test(prefix + group)
                )
                .map(key => flatTaskList[key])
            )
            result.push(...mappingTasks(url, targetTasks));
          } else {
            result.push(...recursiveMapping(url, group + '/'));
          }
        });
      });
      return result;
    }
  }

  allResult.push(...recursiveMapping(urls));

  uniq(allUrls).filter(_ => typeof _ === 'string').forEach((url) => {
    allResult.push(...mappingTasks(url, tasksForAll));
  });

  return  [...new Set(allResult.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
};
