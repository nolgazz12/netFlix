module.exports = {
    eslint: {
        enable: false,
    },
    webpack: {
        configure: {
            module: {
                rules: [
                    {
                        type: 'javascript/auto',
                        test: /\.mjs$/,
                        include: /node_modules/,
                    },
                ],
            },
        },
    },
}
