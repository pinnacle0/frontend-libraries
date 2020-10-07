This UI library is mostly based on Ant Design, with enhanced features for Pinnacle group products.



## Good To Know

- Every component associates with its own CSS, and tree-shakeable.

- Remember to `import "@pinnacle0/web-ui/css/global.less"` at first. 
If you want to use existing library color, `import "@pinnacle0/web-ui/css/varibale.less"` is helpful.

- Remember to wrap `<LocaleProvider>` if not using English.

- Remember to wrap `<BrowserRouter>` when using `@pinnacle0/web-ui/admin/MainLayout`. 

- Do not import anything from `@pinnacle0/web-ui/internal/*`.

## Moment Local Tree-shaking Issue

To support this, please do both of following:

- Add `new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),` to your webpack plugins.
This line is to skip all locale imports by moment library itself.

- If you want to support Chinese locale, add `require("moment/locale/zh-cn")` at the beginning of your application.
This line is to enable Chinese calendar when current context locale is "zh".  
