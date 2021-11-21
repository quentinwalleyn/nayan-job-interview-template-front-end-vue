module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: { version: '3.16', proposals: true },
                modules: false
            }
        ]
    ]
};
