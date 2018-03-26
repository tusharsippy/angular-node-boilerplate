/**
 * www file is the main server file. It handles enabling cluster and creating server.
 */
const cwd = process.cwd();
const path = require('path');
const config = require('config');
const cluster = require('cluster');
const os = require('os');

// exporting app.js from backend directory
const app = require(path.join(cwd, '/backend/app'));

// exporting winston logger settings for logging
const logger = require(path.join(cwd, 'backend/libs/log'));

// Whether to enable cluster or not(default: false), configuration is set in default.json using config npm package
if (config.get('enable-cluster') && cluster.isMaster) {
    var workers = os.cpus().length;
    logger.info('Master is starting %d workers', workers)

    for (let i = 0; i < workers; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        logger.info('Worker with id %s and process id %d is online', worker.id, worker.process.pid);
    })
    cluster.on('exit', (worker, code, signal) => {
        logger.info('Worker with id %d and process id %d exited with code %s and signal ' + signal, worker.id, worker.process.pid, code, signal);
    })
} else {
    // create node server to listen on port(default 3000) picked from config
    app.set('port', process.env.PORT || config.get('port') || 3000);
    app.listen(app.get('port'), () => {
        logger.info('Server listening on ' + app.get('port'));
    });
}