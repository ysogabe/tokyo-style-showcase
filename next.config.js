/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 大きなファイルのアップロードを許可
  staticPageGenerationTimeout: 300,
  // 静的アセットの設定
  output: 'standalone',
  // 画像・動画の最適化設定
  images: {
    domains: ['localhost'],
  },
  // 大きなファイルの制限を緩和
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

module.exports = nextConfig