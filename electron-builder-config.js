// Electron Builder Configuration for REMOAI Desktop
// This creates a native installer for each platform

const { build } = require('electron-builder');

const config = {
  appId: 'com.remoa.desktop',
  productName: 'REMOAI Desktop',
  directories: {
    output: 'dist-electron'
  },
  files: [
    'app/**/*',
    'backend/**/*',
    '!**/node_modules/**/*',
    '!**/temp/**/*',
    '!**/*.log'
  ],
  extraResources: [
    {
      from: 'backend',
      to: 'backend',
      filter: ['**/*', '!node_modules/**/*']
    }
  ],
  mac: {
    category: 'public.app-category.productivity',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64']
      }
    ],
    icon: 'app/resources/icon.icns'
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      },
      {
        target: 'portable',
        arch: ['x64']
      }
    ],
    icon: 'app/resources/icon.ico'
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      },
      {
        target: 'deb',
        arch: ['x64']
      }
    ],
    icon: 'app/resources/icon.png',
    category: 'Office'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'app/resources/icon.ico',
    uninstallerIcon: 'app/resources/icon.ico',
    installerHeaderIcon: 'app/resources/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'REMOAI Desktop'
  },
  dmg: {
    title: 'REMOAI Desktop Installer',
    icon: 'app/resources/icon.icns',
    background: 'app/resources/dmg-background.png',
    window: {
      width: 540,
      height: 380
    },
    contents: [
      {
        x: 140,
        y: 200,
        type: 'file'
      },
      {
        x: 400,
        y: 200,
        type: 'link',
        path: '/Applications'
      }
    ]
  },
  afterAllArtifactBuild: 'scripts/post-build.js'
};

module.exports = config;
