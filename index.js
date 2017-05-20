require('mini-linq-js');
const pingLite = require('ping-lite');

const ping = target =>
  new Promise((resolve, reject) => {
    const x = new pingLite(target);
    x.send((err, ms) => {
      resolve({ server: target, ms: ms || Infinity });
    });
  });

const servers = [10, 20, 30, 40]
  .selectMany(number => ['b', 'c', 'd', 'e'].select(char => `${number}${char}`))
  .select(x => `smooth.edge${x}.rtl.hu`);

const elect = targets =>
  Promise.all(targets.map(ping)).then(results =>
    results
      .where(x => x.ms !== Infinity)
      .orderBy(x => x.ms)
      .select(x => x.server)
      .firstOrDefault()
  );

module.exports = async (req, res) => {
  const server = await elect(servers);
  const target = `http://${server}${req.url}`;
  console.log(target);
  res.writeHead(302, {
    Location: target
  });
  res.end();
};
