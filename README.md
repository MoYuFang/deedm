# DEEDM protype

### Environment

本 md 中用 `my_deedm` 为项目根文件夹

使用 `node.js` 作为开发环境 `npm` 作为包管理器
[Node.js (LTS) v22.14.0](https://nodejs.org/en/download)

```
>node --version
v22.14.0
>npm --version
10.4.0
```


### Installation

`npm` 会将模块（包括vite）安装到 `my_deedm/node_moudules` 文件夹（`node_modules`不会共享到仓库）

```
git clone https://github.com/MoYuFang/deedm/ my_deedm
cd my_deedm
my_deedm > npm install

```

### Run dev

输入以下命名后，可以在浏览器通过 url `http://localhost:5173/` 预览到界面，vite支持界面热重载
```
my_deedm > npm run dev
```

在 `my_deedm/package.json` 中可以看到 `dev` 是别名
```
"scripts": {
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
}
```

### Structure

主要结构如下
```
src/
    dynagraph/
      examples/
        sample.vue
      BFS+DFS.vue
      ...
    App.vue
    main.js
    style.css
index.html
```

界面运作的流程大致如下：

`index.html` 调用 `src/main.js`，`main.js` 加载主界面 `App.vue`，主界面 `App.vue` 加载组件 `<DFS_BFS/>`

`src/dynagraph/examples/sample.vue` 是使用范例，里面有一些 api 的详细注释

