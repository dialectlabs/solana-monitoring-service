import * as web3 from '@solana/web3.js';
var semver = require('semver');
var exec = require('child_process').exec;

const getSomething = async () => {
  let connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'));
  console.log(web3);
  console.log(await connection.getVersion());
  // @ts-ignore
  exec('solana feature status', (error, stdout, stderr) => {
    const table = stdout.match(
      /^((\d+\.\d{1,2}\.\d{1,2}){1}[,\s]{1,2})+\s*\d+(\s+\d{1,2}\.\d{2}\%){2}/gm,
    );
    console.log(table);
    // var max = versions.sort(semver.rcompare);
    //console.log(max);
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
};

getSomething();
