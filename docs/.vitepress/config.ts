import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  base: '/MatrixLauncherDocs/',
  title: 'MatrixLauncher',
  description: '面向 Minecraft 服务器的 Kotlin / Compose Desktop 定制启动器框架',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'MatrixLauncher',
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '配置', link: '/configuration/client-profile' },
      { text: '开发', link: '/development/architecture' },
      { text: '发布', link: '/deployment/build-release' }
    ],
    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '项目介绍', link: '/' },
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '核心概念', link: '/guide/core-concepts' }
        ]
      },
      {
        text: '配置指南',
        items: [
          { text: '客户端配置', link: '/configuration/client-profile' },
          { text: '远程 Manifest', link: '/configuration/remote-manifest' },
          { text: '品牌与界面', link: '/configuration/branding-ui' },
          { text: '账号与登录', link: '/configuration/accounts' },
          { text: '文件分发', link: '/configuration/file-distribution' }
        ]
      },
      {
        text: '安全与发布',
        items: [
          { text: '安全与签名', link: '/security/manifest-signing' },
          { text: '构建与发布', link: '/deployment/build-release' }
        ]
      },
      {
        text: '开发参考',
        items: [
          { text: '项目架构', link: '/development/architecture' },
          { text: '扩展开发', link: '/development/extensions' },
          { text: '限制与路线图', link: '/development/limitations' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ewsk233' }
    ],
    footer: {
      message: '基于 Apache License 2.0 发布',
      copyright: 'Copyright © 2026 ewsk233'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdatedText: '最后更新'
  }
})
