const inDev = process.env.NODE_ENV === 'development';

// noinspection WebpackConfigHighlighting
module.exports = [
    {
        test: /\.node$/,
        use: 'node-loader',
    },
    {
        test: /\.(m?js|node)$/,
        parser: {amd: false},
        use: {
            loader: '@marshallofsound/webpack-asset-relocator-loader',
            options: {
                outputAssetBase: 'native_modules',
            },
        }
    },
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: 'ts-loader',
            options: {
                transpileOnly: true,
            },
        },
    },
    {
        test: /\.css$/,
        use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
    },
    {
        test: /\.less$/,
        use: [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
            {loader: 'less-loader'},
        ],
    },
    {
        test: /\.(gif|jpe?g|tiff|png|webp|bmp)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    publicPath: 'images',
                    outputPath: inDev ? 'images' : './main_window/images',
                },
            },
        ],
    }
];
