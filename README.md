# 山里有棵树

基于 Next.js App Router 的官网与演示后台。首页、套餐选择、演示认领流程和 `/admin` 页面保留原有实现；`/api/v1/home` 提供公开示例数据，真实下单接口尚未开放。

## 本地运行（PyCharm 终端也适用）

需要 Node.js 22.13 或更新版本，以及 npm。在本目录运行：

```bash
npm ci
npm run dev
```

打开 `http://localhost:3000`。验证生产构建时运行：

```bash
npm run build
npm run start
```

`npm run start` 需要先完成构建。无需配置环境变量。页面图片放在 `public/`，代码使用以 `/` 开头的站内资源路径，部署后会自动从当前网站域名读取。

## GitHub 与 Vercel

把项目根目录作为 Git 仓库上传。提交 `app/`、`components/`、`hooks/`、`lib/`、`public/` 中实际使用的图片、`package.json`、`package-lock.json`、`next.config.ts`、`postcss.config.mjs`、`tsconfig.json`、`.gitignore` 和本说明。`public/images/` 中的图片需要一并提交。

在 Vercel 中导入该 GitHub 仓库，保持以下配置：

| 选项 | 值 |
| --- | --- |
| Framework Preset | Next.js（自动识别） |
| Root Directory | 项目根目录 `./` |
| Install Command | 默认，使用 `package-lock.json` |
| Build Command | 默认 `next build`，也可填 `npm run build` |
| Output Directory | 保持默认，不填写 |
| Node.js | 22.x 或 24.x |
| 环境变量 | 当前演示项目不需要 |

点击 **Deploy** 后，Vercel 会给出可从手机和电脑访问的公开网址。只有完成 GitHub 上传与 Vercel 部署后才会产生该网址；本地 `localhost` 仅供开发时使用。

## 不要上传

`.gitignore` 已排除 `node_modules/`、`.next/`、`dist/`、`.vinext/`、`.wrangler/`、`.npm-cache/`、`.idea/`、本地环境文件和设计参考图目录 `public/reference/`。不要在 GitHub 网页上传这些目录，也不要上传个人密钥、真实用户数据或本地缓存。

## 演示范围

`/admin` 是公开可访问的演示后台，数据保存在访问者自己的浏览器中；官网演示订单也只保存在各自浏览器中。两者没有共享数据库，不能用于真实收款、库存或用户资料管理。`POST /api/v1/orders` 会返回 503，直到正式后端接入。
