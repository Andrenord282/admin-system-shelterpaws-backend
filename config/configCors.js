const configCorsList = [
    'http://localhost:3000',
    'https://admin-system-shelterpaws-client.vercel.app',
    process.env.URL_APP,
];

const configCors = {
    origin: (origin, callback) => {
        if (configCorsList.includes(origin) || origin === undefined) {
            callback(null, true);
        } else {
            callback(new Error(`CORS не разрешеный origin: ${origin}`));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
};

module.exports = configCors;
