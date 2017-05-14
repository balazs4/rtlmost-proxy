const pingLite = require('ping-lite');
const ping = target =>
  new Promise((resolve, reject) => {
    const x = new pingLite(target);
    x.send((err, ms) => {
      resolve({ server: target, ms: ms || 100 });
    });
  });

const targets = [].concat
  .apply(
    [],
    [...Array(40).keys()]
      .filter(x => x % 10 === 0)
      .map(x => x + 10)
      .map(x => 'bcde'.split('').map(y => `${x}${y}`))
  )
  .map(xy => `smooth.edge${xy}.rtl.hu`);

Promise.all(targets.map(ping))
  .then(winner => console.log(winner))
  .catch(err => console.error(err));
