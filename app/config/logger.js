let winston = require('winston');

let logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.json(),
    })
);

logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = logger;
