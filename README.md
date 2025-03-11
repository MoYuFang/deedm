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
src
    components
        ch0-case0.vue
        ch1-case1.vue
        ch1-case2.vue
        ...
    App.vue
    main.js
    style.css
index.html
```

界面运作的流程大致如下：

`index.html` 调用 `src/main.js`，`main.js` 加载主界面 `App.vue`，主界面 `App.vue` 中有对各 case 的索引，点击对应按钮可以加载对应 case 的子界面。

`App.vue` 加载各 case 的子界面方式是在 `src/components/` 下检索格式为 `ch?-case?.vue`的文件，如 `ch1-case1.vue`，在 `App.vue` 中可以看到目前被检索的 case 子界面包括
```
ch1-case1.vue
ch1-case2.vue
ch1-case3.vue
ch1-case4.vue
```

当被检索界面缺失时，主界面加载 `ch0-case0.vue` 作为默认显示

### Collaboration

协作开发时只需要在 `dev` 分支中开发各 case

```

```



