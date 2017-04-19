const http = require('http');
const options = {method: 'HEAD', host: 'google.i', port: 80, path: '/'};

const getStatus = (url) => {
  return new Promise((resolve, reject) => {
    let req = http.request(options, (res) => {
      resolve(res.statusCode);
  	});
    req.on('error', (e) => {
      reject(e);
    });
    req.end();
  });
};

const rejectDelay = (reason) => {
	return new Promise((resolve, reject) => {
    setTimeout(reject.bind(null, reason), 2000);
  });
};

const serverIsAlive = async () => {
  return new Promise((resolve, reject) => {
    let p = Promise.reject();

    for (let i=0; i<5; i++) {
      p = p.catch(getStatus).catch(rejectDelay);
    }

    p.then((status) => {
      if (status < 400) {
        resolve(true);
      }
      reject(status < 400);
    }).catch((err) => {
      reject(false);
    });
  });
}

serverIsAlive().catch((err) => {
  console.log('ZeroNet is Not Recheable');
  process.exit(1);
})

