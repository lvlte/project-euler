/**
 * Prints out the solution of a project-euler problem, given its id.
 *
 * @file solve.js
 * @example node solve.js 1
 */

if (process.argv.length != 3) {
  console.error('Invalid arguments')
  console.log('Usage: `node solve.js <pid>` where <pid> is the problem id.');
  return;
}

const fs = require('fs');
const path = require('path');

const pid = ('' + process.argv[2]).padStart(3, '0');
const pbList = fs.readdirSync(path.resolve(__dirname, 'problems/'));
let pb = pbList.filter(f => f.startsWith(pid+'-') && f.endsWith('.js'));

if (!pb.length) {
  console.log(`Problem ${pid} still unsolved...`);
  return;
}

const Problem = require ('./problems/' + pb[0]);

const pbName = pb[0].split(/[-.]/)[1].replace(/_/g, ' ');
const timerLabel = '-> run time ';

console.log(`\nProblem ${pid} - ${pbName}`);
console.time(timerLabel);

const solution = Problem.solve();

console.log('-> solution: ', solution);
console.timeEnd(timerLabel);
