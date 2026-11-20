window.__ModuleLoader__.load({
  id: 'dsh-lifiwallpaper',
  factory(require) {
    var module = { exports: {} }

    const React = require('react')
    let ReactDOM = null
    try {
      ReactDOM = require('react-dom')
    } catch {
      ReactDOM = null
    }

    const NS = 'dsh-appearance'
    const API = '/dsh-appearance'
    const DAY_MS = 86400000

    const t = (key, vars) => {
      const dict = PLUGIN_TRANSLATOR ? PLUGIN_TRANSLATOR(key, vars) : key
      return dict
    }
    let PLUGIN_TRANSLATOR = null

    const h = React.createElement
    const useState = React.useState
    const useEffect = React.useEffect
    const useRef = React.useRef
    const useMemo = React.useMemo

    /* ------------------------------------------------------------------ */
    /* locale                                                              */
    /* ------------------------------------------------------------------ */

    const ZN = {
      nav: '啥鱼外观',
      title: '外观',
      intro: '用自己的图片或视频做整个界面的底层背景，并按喜好调整玻璃质感与主题色。',
      background: '背景图',
      backgroundHint: '支持拖入、粘贴或选择图片；拖动画面调整位置，滚轮或滑块缩放。',
      upload: '上传图片或视频',
      replace: '更换背景',
      remove: '移除背景',
      fitCover: '填满',
      fitContain: '适应',
      zoom: '缩放',
      bgOpacity: '背景不透明度',
      bgBlur: '背景模糊',
      bgBlurGaussian: '高斯模糊',
      bgBlurLinear: '线性模糊',
      bgBlurHint: '模糊只作用于背景，界面与卡片保持清晰。',
      answerRegion: 'AI 回答玻璃底',
      noImage: '还没有背景图',
      noImageHint: '上传图片或视频（MP4/WebM）后会在此预览，并可自动生成主题色。',
      dragHint: '拖动调整位置',
      glass: '玻璃效果',
      glassHint: '只给按钮、消息、输入框等卡片加玻璃，其余空位透出背景。',
      glassNone: '无',
      glassTranslucent: '半透明',
      glassFrosted: '磨砂玻璃',
      glassLiquid: '液态玻璃',
      strength: '强度',
      radius: '圆角',
      regions: '应用区域',
      regionConversation: '对话内容',
      regionSidebar: '侧栏按钮',
      regionPanels: '插件面板',
      regionDialogs: '弹窗与菜单',
      theme: '主题色',
      themeHint: '从背景图自动取色，或手动指定一个颜色。',
      autoPalette: '图片取色',
      custom: '自定义',
      resetTheme: '恢复默认主题色',
      recolor: '重新取色',
      picker: '取色器',
      hex: 'HEX',
      rgb: 'RGB',
      about: '关于与重置',
      version: '版本',
      resetAll: '恢复默认外观',
      resetHint: '恢复默认配置会保留已上传的背景图。',
      resetDone: '已恢复默认设置，保存后生效',
      saved: '已保存',
      saveFailed: '保存失败，请重试',
      uploadFailed: '上传失败',
      today: '今日',
      todayTotal: '今日 {total} tok',
      sessionPart: '（本对话 {tokens} tok）',
      balance: '余额',
      balanceUnknown: '余额 —',
      costPart: '（今日已用 ¥{day} / 本对话 ¥{session}）',
      costPartSolo: '（今日已用 ¥{day}）',
      balanceSignedOut: '未登录或未配置 API Key',
      refresh: '刷新余额',
      reloadPage: '重新加载界面',
      restart: '退出并重启',
      restartTitle: '关于重启',
      restartBody:
        '桌面端没有向插件开放退出或重启应用的接口，因此这里只能重新加载界面。若需要彻底退出，请使用系统托盘或窗口菜单退出应用，然后重新打开。',
      cancel: '取消',
      reloadNow: '重新加载',
      autoPicked: '已从背景取出 {count} 个颜色',
      previewEmpty: '预览',
      loading: '读取中…',
      syncing: '正在同步…',
      offline: '无法连接插件后台，界面仍可用。',
      apply: '应用',
      save: '保存',
      discard: '放弃更改',
      unsaved: '有未保存的更改',
      allSaved: '所有更改已保存',
      saving: '保存中…',
      saveHint: '保存后会应用背景位置、玻璃与主题色。',
      tabQuick: '快速更改',
      tabUpload: '上传新样式',
      schemeLight: '浅色模式',
      schemeDark: '深色模式',
      schemeHint: '浅色与深色模式各自保存壁纸与玻璃参数，切换主题时自动跟随。',
      dropHint: '也可把样式包（.zip）拖到这里快速启用',
      exportPack: '导出样式包',
      importPack: '导入样式包',
      importHint: '拖入或选择之前导出的 .zip；校验通过后才会应用。',
      importDone: '样式包已导入并应用',
      importFailed: '样式包校验失败',
      showUsage: '显示 Tokens 与花费',
      usageDisclaimer: 'Tokens 和花费可能有误，请以官方信息为准。',
      processRegion: '思考/工具过程玻璃',
      composerCollapse: '折叠输入框',
      composerExpand: '展开输入框',
    }

    const EN = {
      nav: 'Fish Appearance',
      title: 'Appearance',
      intro: 'Use your own image or video as the app-wide backdrop, then fine-tune the glass and accent colors.',
      background: 'Wallpaper',
      backgroundHint: 'Drop, paste, or pick an image. Drag to move it; scroll or use the slider to zoom.',
      upload: 'Upload image or video',
      replace: 'Replace background',
      remove: 'Remove background',
      fitCover: 'Fill',
      fitContain: 'Fit',
      zoom: 'Zoom',
      bgOpacity: 'Wallpaper opacity',
      bgBlur: 'Wallpaper blur',
      bgBlurGaussian: 'Gaussian',
      bgBlurLinear: 'Linear',
      bgBlurHint: 'Blur applies to the wallpaper only; the UI and cards stay sharp.',
      answerRegion: 'AI answer glass',
      noImage: 'No wallpaper yet',
      noImageHint: 'Upload an image or video (MP4/WebM) to preview it here and extract accent colors.',
      dragHint: 'Drag to reposition',
      glass: 'Glass effect',
      glassHint: 'Glass is applied to cards only (buttons, messages, composer); empty space shows the wallpaper.',
      glassNone: 'None',
      glassTranslucent: 'Translucent',
      glassFrosted: 'Frosted',
      glassLiquid: 'Liquid glass',
      strength: 'Strength',
      radius: 'Corner radius',
      regions: 'Regions',
      regionConversation: 'Chat content',
      regionSidebar: 'Sidebar buttons',
      regionPanels: 'Plugin panels',
      regionDialogs: 'Dialogs & menus',
      theme: 'Accent color',
      themeHint: 'Extract colors from the wallpaper, or choose one manually.',
      autoPalette: 'From image',
      custom: 'Custom',
      resetTheme: 'Reset accent',
      recolor: 'Re-extract',
      picker: 'Picker',
      hex: 'HEX',
      rgb: 'RGB',
      about: 'About & reset',
      version: 'Version',
      resetAll: 'Reset appearance',
      resetHint: 'Resetting the appearance keeps your uploaded wallpaper.',
      resetDone: 'Defaults restored — save to apply',
      saved: 'Saved',
      saveFailed: 'Save failed, please retry',
      uploadFailed: 'Upload failed',
      today: 'Today',
      todayTotal: 'Today {total} tok',
      sessionPart: ' ({tokens} tok this chat)',
      balance: 'Balance',
      balanceUnknown: 'Balance —',
      costPart: ' (today ¥{day} / this chat ¥{session})',
      costPartSolo: ' (today ¥{day})',
      balanceSignedOut: 'Not signed in and no API key',
      refresh: 'Refresh balance',
      reloadPage: 'Reload UI',
      restart: 'Quit & restart',
      restartTitle: 'About restarting',
      restartBody:
        'The desktop shell does not expose a quit or restart API to plugins, so this button can only reload the UI. To fully quit, use the tray or window menu, then reopen the app.',
      cancel: 'Cancel',
      reloadNow: 'Reload',
      autoPicked: 'Picked {count} colors from the background',
      previewEmpty: 'Preview',
      loading: 'Loading…',
      syncing: 'Syncing…',
      offline: 'Plugin backend is unreachable; the UI still works.',
      apply: 'Apply',
      save: 'Save',
      discard: 'Discard changes',
      unsaved: 'Unsaved changes',
      allSaved: 'All changes saved',
      saving: 'Saving…',
      saveHint: 'Saving applies the wallpaper position, glass, and accent color.',
      tabQuick: 'Quick changes',
      tabUpload: 'New style',
      schemeLight: 'Light mode',
      schemeDark: 'Dark mode',
      schemeHint: 'Light and dark modes keep their own wallpaper and glass settings; switching the theme follows automatically.',
      dropHint: 'Or drop a style pack (.zip) here to apply it',
      exportPack: 'Export style pack',
      importPack: 'Import style pack',
      importHint: 'Drop or pick a previously exported .zip; it is applied only after verification.',
      importDone: 'Style pack imported and applied',
      importFailed: 'Style pack verification failed',
      showUsage: 'Show tokens and cost',
      usageDisclaimer: 'Tokens and cost may be inaccurate; refer to official information.',
      processRegion: 'Thinking / tool process glass',
      composerCollapse: 'Collapse input',
      composerExpand: 'Expand input',
    }

    /* ------------------------------------------------------------------ */
    /* small utilities                                                     */
    /* ------------------------------------------------------------------ */

    const DEFAULTS = {
      version: 2,
      profiles: {
        light: {
          background: { zoom: 1, posX: 0.5, posY: 0.5, fit: 'cover', blur: 0, blurType: 'gaussian', opacity: 100 },
          glass: {
            mode: 'frosted',
            strength: 55,
            radius: 14,
            answer: true,
            regions: { conversation: true, sidebar: true, panels: true, dialogs: true },
          },
          theme: { mode: 'default', color: '#5b8dff', palette: [] },
        },
        dark: {
          background: { zoom: 1, posX: 0.5, posY: 0.5, fit: 'cover', blur: 0, blurType: 'gaussian', opacity: 100 },
          glass: {
            mode: 'frosted',
            strength: 55,
            radius: 14,
            answer: true,
            regions: { conversation: true, sidebar: true, panels: true, dialogs: true },
          },
          theme: { mode: 'default', color: '#5b8dff', palette: [] },
        },
      },
      ui: { showUsage: true },
    }

    const clamp = (n, min, max, fallback) => {
      const v = Number(n)
      if (!Number.isFinite(v)) return fallback
      return Math.min(max, Math.max(min, v))
    }

    const isHex = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)

    function normalizeBackground(raw) {
      const bg = raw && typeof raw === 'object' ? raw : {}
      return {
        zoom: Number(clamp(bg.zoom, 1, 4, 1).toFixed(3)),
        posX: Number(clamp(bg.posX, 0, 1, 0.5).toFixed(4)),
        posY: Number(clamp(bg.posY, 0, 1, 0.5).toFixed(4)),
        fit: bg.fit === 'contain' ? 'contain' : 'cover',
        blur: Math.round(clamp(bg.blur, 0, 32, 0)),
        blurType: bg.blurType === 'linear' ? 'linear' : 'gaussian',
        opacity: Math.round(clamp(bg.opacity, 0, 100, 100)),
      }
    }

    function normalizeGlass(raw) {
      const glass = raw && typeof raw === 'object' ? raw : {}
      const regions = glass.regions && typeof glass.regions === 'object' ? glass.regions : {}
      return {
        mode: ['none', 'translucent', 'frosted', 'liquid'].includes(glass.mode) ? glass.mode : 'frosted',
        strength: Math.round(clamp(glass.strength, 0, 100, 55)),
        radius: Math.round(clamp(glass.radius, 0, 28, 14)),
        answer: glass.answer !== false,
        regions: {
          conversation: regions.conversation !== false,
          sidebar: regions.sidebar !== false,
          panels: regions.panels !== false,
          dialogs: regions.dialogs !== false,
        },
      }
    }

    function normalizeTheme(raw) {
      const theme = raw && typeof raw === 'object' ? raw : {}
      return {
        mode: ['default', 'auto', 'custom'].includes(theme.mode) ? theme.mode : 'default',
        color: isHex(theme.color) ? theme.color.toLowerCase() : '#5b8dff',
        palette: Array.isArray(theme.palette) ? theme.palette.filter(isHex).slice(0, 8).map((c) => c.toLowerCase()) : [],
      }
    }

    function normalizeProfile(raw, fallbackTheme) {
      const src = raw && typeof raw === 'object' ? raw : {}
      return {
        background: normalizeBackground(src.background),
        glass: normalizeGlass(src.glass),
        theme: normalizeTheme(src.theme || fallbackTheme),
      }
    }

    function normalizeConfig(raw) {
      const src = raw && typeof raw === 'object' ? raw : {}
      const legacyTheme = normalizeTheme(src.theme)
      const ui = src.ui && typeof src.ui === 'object' ? src.ui : {}
      // v1/v2.0 kept one background/glass/theme set for both themes. Mirror it
      // into both profiles so upgrading users keep their look in both modes.
      const legacy = src.background || src.glass ? { background: src.background, glass: src.glass } : null
      const profiles = src.profiles && typeof src.profiles === 'object' ? src.profiles : {}
      return {
        version: 2,
        profiles: {
          light: normalizeProfile(profiles.light || legacy, legacyTheme),
          dark: normalizeProfile(profiles.dark || legacy, legacyTheme),
        },
        ui: {
          showUsage: ui.showUsage !== false,
        },
      }
    }

    function profileOf(config, scheme) {
      const profiles = (config && config.profiles) || {}
      return profiles[scheme] || profiles.light || DEFAULTS.profiles.light
    }

    // Auto mode follows the wallpaper palette of the active theme, so a unique
    // dark wallpaper also yields a unique dark accent color.
    // Palette extracted live for the currently loaded wallpaper (per theme).
    const livePalettes = { light: null, dark: null }

    function accentColor(theme, mode) {
      const live = mode ? livePalettes[mode] : null
      if (theme.mode === 'auto' && live && live.palette && live.palette.length) return live.palette[0]
      if (theme.mode === 'auto' && theme.palette && theme.palette.length) return theme.palette[0]
      return theme.color
    }

    function updateProfile(config, scheme, patch) {
      const base = profileOf(config, scheme)
      return Object.assign({}, config, {
        profiles: Object.assign({}, config.profiles, { [scheme]: Object.assign({}, base, patch) }),
      })
    }

    function hexToRgb(hex) {
      const v = isHex(hex) ? hex.slice(1) : '5b8dff'
      return {
        r: parseInt(v.slice(0, 2), 16),
        g: parseInt(v.slice(2, 4), 16),
        b: parseInt(v.slice(4, 6), 16),
      }
    }

    function rgbToHex(r, g, b) {
      const to = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
      return `#${to(r)}${to(g)}${to(b)}`
    }

    function rgbToHsl(r, g, b) {
      const rn = r / 255
      const gn = g / 255
      const bn = b / 255
      const max = Math.max(rn, gn, bn)
      const min = Math.min(rn, gn, bn)
      let hue = 0
      let sat = 0
      const light = (max + min) / 2
      const d = max - min
      if (d > 0) {
        sat = d / (1 - Math.abs(2 * light - 1))
        if (max === rn) hue = ((gn - bn) / d) % 6
        else if (max === gn) hue = (bn - rn) / d + 2
        else hue = (rn - gn) / d + 4
        hue *= 60
        if (hue < 0) hue += 360
      }
      return { h: hue, s: Math.max(0, Math.min(1, sat)), l: light }
    }

    function hslToRgb(hue, sat, light) {
      const c = (1 - Math.abs(2 * light - 1)) * sat
      const hp = (((hue % 360) + 360) % 360) / 60
      const x = c * (1 - Math.abs((hp % 2) - 1))
      let r = 0
      let g = 0
      let b = 0
      if (hp < 1) [r, g, b] = [c, x, 0]
      else if (hp < 2) [r, g, b] = [x, c, 0]
      else if (hp < 3) [r, g, b] = [0, c, x]
      else if (hp < 4) [r, g, b] = [0, x, c]
      else if (hp < 5) [r, g, b] = [x, 0, c]
      else [r, g, b] = [c, 0, x]
      const m = light - c / 2
      return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
    }

    function brandVariants(hex) {
      const rgb = hexToRgb(hex)
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const light = hslToRgb(hsl.h, Math.max(0.42, Math.min(0.95, hsl.s)), clamp(hsl.l, 0.38, 0.52, 0.46))
      const dark = hslToRgb(hsl.h, Math.max(0.45, Math.min(0.98, hsl.s + 0.06)), clamp(hsl.l, 0.58, 0.74, 0.64))
      return { light: rgbToHex(light.r, light.g, light.b), dark: rgbToHex(dark.r, dark.g, dark.b) }
    }

    function rgba(hex, alpha) {
      const { r, g, b } = hexToRgb(hex)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    function readStorage(key) {
      try {
        return window.localStorage.getItem(key)
      } catch {
        return null
      }
    }

    function writeStorage(key, value) {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        /* ignore */
      }
    }

    function dimsKey(version) {
      return `dsh-appearance.dims.${version}`
    }

    function cacheDims(version, w, hgt) {
      if (!version) return
      writeStorage(dimsKey(version), `${w}x${hgt}`)
    }

    function readDims(version) {
      const raw = readStorage(dimsKey(version))
      if (!raw) return null
      const [w, hgt] = raw.split('x').map(Number)
      return w > 0 && hgt > 0 ? { w, h: hgt } : null
    }

    /* ------------------------------------------------------------------ */
    /* store                                                               */
    /* ------------------------------------------------------------------ */

    const store = {
      state: {
        loaded: false,
        error: null,
        note: null,
        config: normalizeConfig(DEFAULTS),
        serverConfig: normalizeConfig(DEFAULTS),
        images: { light: null, dark: null },
        savedVersions: { light: null, dark: null },
        scheme: 'light',
        editScheme: 'light',
        revision: 0,
        balance: null,
        balanceError: null,
        balanceAt: 0,
        usage: { day: '', total: 0, sessions: {} },
        serverTime: 0,
        dirty: false,
        saving: false,
        stagedImage: null,
        stagedRemove: false,
        stagedRemoveMode: null,
      },
      subs: new Set(),
      get() {
        return this.state
      },
      set(patch) {
        this.state = Object.assign({}, this.state, patch)
        for (const fn of this.subs) {
          try {
            fn(this.state)
          } catch {
            /* ignore */
          }
        }
      },
      subscribe(fn) {
        this.subs.add(fn)
        return () => this.subs.delete(fn)
      },
    }

    function useStore() {
      const [snap, setSnap] = useState(store.get())
      useEffect(() => store.subscribe(setSnap), [])
      return snap
    }

    function themeScheme() {
      try {
        const snapshot = pluginCtx && pluginCtx.theme ? pluginCtx.theme.getTheme() : null
        return snapshot && snapshot.active && snapshot.active.colorScheme === 'dark' ? 'dark' : 'light'
      } catch {
        return 'light'
      }
    }

    // Solid theme base behind the wallpaper; visible through the opacity slider.
    function themeBaseColor() {
      try {
        const snapshot = pluginCtx && pluginCtx.theme ? pluginCtx.theme.getTheme() : null
        const value = snapshot && snapshot.active && snapshot.active.tokens && snapshot.active.tokens['--dsw-alias-bg-base']
        if (typeof value === 'string' && value && value !== 'transparent') return value
      } catch {
        /* fall through */
      }
      return themeScheme() === 'dark' ? '#12141a' : '#ffffff'
    }

    // Each theme owns its wallpaper. Never borrow the other theme's image:
    // editing dark while light is active must not change what is on screen.
    function resolveImage() {
      const state = store.get()
      const images = state.images || {}
      return { image: images[activeScheme] || null, mode: activeScheme, fallback: false }
    }

    /* ------------------------------------------------------------------ */
    /* runtime state                                                       */
    /* ------------------------------------------------------------------ */

    let pluginCtx = null
    let activeScheme = 'light'
    let appliedInfo = { mode: null, version: null, url: null, w: 0, h: 0 }
    const dimsListeners = new Set()
    let disposers = []
    let eventSource = null
    let pollTimer = null
    let themeDisposer = null

    function subscribe(fn) {
      const dispose = fn()
      if (typeof dispose === 'function') disposers.push(dispose)
      return dispose
    }

    function apiJson(path, options) {
      const opts = Object.assign({ credentials: 'same-origin' }, options || {})
      opts.headers = Object.assign({ accept: 'application/json' }, (options && options.headers) || {})
      return fetch(API + path, opts).then(async (res) => {
        const text = await res.text()
        let body = null
        if (text) {
          try {
            body = JSON.parse(text)
          } catch {
            body = null
          }
        }
        if (!res.ok) {
          const message = body && body.error ? body.error : `HTTP ${res.status}`
          const err = new Error(message)
          err.status = res.status
          throw err
        }
        return body
      })
    }

    function configKey(config) {
      return JSON.stringify(config)
    }

    function applyServerState(next, opts) {
      if (!next || !next.config) return
      const config = normalizeConfig(next.config)
      const images = next.images || { light: next.image || null, dark: null }
      const keepLocal = Boolean((opts && opts.keepLocalConfig) || store.get().dirty)
      const current = store.get()
      const patch = {
        loaded: true,
        error: null,
        config: keepLocal ? current.config : config,
        serverConfig: config,
        images: { light: images.light || null, dark: images.dark || null },
        savedVersions: {
          light: images.light ? images.light.version : null,
          dark: images.dark ? images.dark.version : null,
        },
        scheme: themeScheme(),
        editScheme: keepLocal ? current.editScheme : themeScheme(),
        revision: Number(next.revision) || 0,
        balance: next.balance || null,
        balanceError: next.balanceError || null,
        balanceAt: Number(next.balanceAt) || 0,
        usage: next.usage || { day: '', total: 0, sessions: {} },
        serverTime: Number(next.serverTime) || 0,
      }
      store.set(patch)
      ensureImage()
      applyVisuals()
      if (!opts || !opts.silent) store.set({ note: null })
    }

    async function loadState(force) {
      try {
        const next = await apiJson(`/state${force ? '?force=1' : ''}`)
        applyServerState(next, { silent: true })
        store.set({ error: null })
      } catch (err) {
        store.set({ error: String((err && err.message) || err) })
      }
    }

    /* ------------------------------------------------------------------ */
    /* image & background                                                  */
    /* ------------------------------------------------------------------ */

    function ensureImage() {
      const resolved = resolveImage()
      const image = resolved.image
      if (!image) {
        appliedInfo = { mode: null, version: null, url: null, w: 0, h: 0 }
        return
      }
      if (image.width > 0 && image.height > 0) {
        const known = { w: image.width, h: image.height }
        cacheDims(image.version, known.w, known.h)
      }
      if (appliedInfo.version === image.version && appliedInfo.url && appliedInfo.mode === resolved.mode && appliedInfo.w > 0 && appliedInfo.h > 0) return
      const url = `${API}/background?mode=${resolved.mode}&v=${encodeURIComponent(image.version)}`
      appliedInfo = { mode: resolved.mode, version: image.version, url, w: 0, h: 0 }
      const cached = image.width > 0 && image.height > 0 ? { w: image.width, h: image.height } : readDims(image.version)
      if (cached) {
        appliedInfo.w = cached.w
        appliedInfo.h = cached.h
      }
      const isVideo = image.kind === 'video' || String(image.mime || '').indexOf('video/') === 0
      const probe = isVideo ? document.createElement('video') : new window.Image()
      if (isVideo) {
        probe.muted = true
        probe.preload = 'metadata'
      }
      const onReady = () => {
        if (appliedInfo.version !== image.version) return
        const w = isVideo ? probe.videoWidth : probe.naturalWidth
        const h = isVideo ? probe.videoHeight : probe.naturalHeight
        if (!w || !h) return
        appliedInfo.w = w
        appliedInfo.h = h
        cacheDims(image.version, w, h)
        applyBackground()
        refreshAutoPalette(resolved.mode, image, url)
        for (const fn of dimsListeners) {
          try {
            fn()
          } catch {
            /* ignore */
          }
        }
      }
      probe.onload = onReady
      probe.onloadedmetadata = onReady
      probe.src = url
      // Some cached/embedded responses never fire a probe event. Retry once by
      // decoding a blob so the wallpaper geometry is never stuck at 0x0.
      if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
        window.setTimeout(async () => {
          if (appliedInfo.version !== image.version) return
          if (appliedInfo.w > 0 && appliedInfo.h > 0) return
          try {
            const response = await fetch(url, { credentials: 'same-origin' })
            if (!response.ok) return
            const blob = await response.blob()
            if (isVideo) {
              const video = document.createElement('video')
              video.muted = true
              video.preload = 'metadata'
              video.src = URL.createObjectURL(blob)
              video.onloadedmetadata = () => {
                if (appliedInfo.version !== image.version) return
                if (video.videoWidth) {
                  appliedInfo.w = video.videoWidth
                  appliedInfo.h = video.videoHeight
                  cacheDims(image.version, appliedInfo.w, appliedInfo.h)
                  applyBackground()
                }
                URL.revokeObjectURL(video.src)
              }
              return
            }
            if (typeof createImageBitmap === 'function') {
              const bitmap = await createImageBitmap(blob)
              if (appliedInfo.version !== image.version) return
              appliedInfo.w = bitmap.width
              appliedInfo.h = bitmap.height
              cacheDims(image.version, bitmap.width, bitmap.height)
              applyBackground()
              bitmap.close && bitmap.close()
            }
          } catch {
            /* keep the plain-image fallback */
          }
        }, 1200)
      }
    }

    async function refreshAutoPalette(mode, image, url) {
      const theme = profileOf(store.get().serverConfig, mode).theme
      if (theme.mode !== 'auto') return
      if (livePalettes[mode] && livePalettes[mode].version === image.version) return
      livePalettes[mode] = { version: image.version, palette: null }
      try {
        const response = await fetch(url, { credentials: 'same-origin' })
        if (!response.ok) return
        const blob = await response.blob()
        const palette = await extractPalette(blob)
        if (!palette || !palette.length) return
        livePalettes[mode] = { version: image.version, palette }
        if (mode === activeScheme) {
          applyCssVars()
          applyThemeTokens()
        }
      } catch {
        /* keep the stored accent */
      }
    }

    function backgroundGeometry() {
      const cfg = profileOf(store.get().serverConfig, activeScheme).background
      const vw = Math.max(1, window.innerWidth)
      const vh = Math.max(1, window.innerHeight)
      const iw = appliedInfo.w || vw
      const ih = appliedInfo.h || vh
      const scaleBase = cfg.fit === 'contain' ? Math.min(vw / iw, vh / ih) : Math.max(vw / iw, vh / ih)
      const scale = scaleBase * cfg.zoom
      return { vw, vh, iw, ih, w: iw * scale, h: ih * scale }
    }

    let wallpaperWrap = null
    let imageBg = null
    let videoBg = null

    function ensureWallpaperWrap() {
      if (!document.body) return null
      if (!wallpaperWrap || !wallpaperWrap.isConnected) {
        wallpaperWrap = document.createElement('div')
        wallpaperWrap.className = 'dsap-wallpaper-wrap'
        document.body.appendChild(wallpaperWrap)
        imageBg = null
        videoBg = null
      }
      return wallpaperWrap
    }

    function ensureImageLayer(url) {
      const wrap = ensureWallpaperWrap()
      if (!wrap) return null
      if (!imageBg || !imageBg.isConnected) {
        imageBg = document.createElement('div')
        imageBg.className = 'dsap-image-bg'
        wrap.appendChild(imageBg)
      }
      if (imageBg.dataset.src !== url) {
        imageBg.dataset.src = url
        imageBg.style.backgroundImage = `url("${url}")`
      }
      return imageBg
    }

    function removeImageLayer() {
      if (!imageBg) return
      try {
        if (imageBg.parentNode) imageBg.parentNode.removeChild(imageBg)
      } catch {
        /* ignore */
      }
      imageBg = null
    }

    function ensureVideoLayer(url) {
      const wrap = ensureWallpaperWrap()
      if (!wrap) return null
      if (!videoBg || !videoBg.isConnected) {
        videoBg = document.createElement('video')
        videoBg.className = 'dsap-video-bg'
        videoBg.muted = true
        videoBg.defaultMuted = true
        videoBg.loop = true
        videoBg.autoplay = true
        videoBg.playsInline = true
        videoBg.setAttribute('muted', '')
        videoBg.setAttribute('playsinline', '')
        wrap.appendChild(videoBg)
      }
      if (videoBg.dataset && videoBg.dataset.src !== url) {
        videoBg.dataset.src = url
        videoBg.src = url
        const started = videoBg.play && videoBg.play()
        if (started && started.catch) started.catch(() => {})
      }
      return videoBg
    }

    function removeVideoLayer() {
      if (!videoBg) return
      try {
        videoBg.pause()
      } catch {
        /* ignore */
      }
      try {
        if (videoBg.parentNode) videoBg.parentNode.removeChild(videoBg)
      } catch {
        /* ignore */
      }
      videoBg = null
    }

    // Directional ("linear") blur is implemented with an SVG filter: a purely
    // horizontal Gaussian blur smears the wallpaper sideways, while the default
    // mode uses the browser's isotropic CSS blur.
    function ensureBlurFilter(blur) {
      if (!document.body) return null
      let svg = document.getElementById('dsap-blur-defs')
      if (!svg) {
        const ns = 'http://www.w3.org/2000/svg'
        svg = document.createElementNS(ns, 'svg')
        svg.setAttribute('id', 'dsap-blur-defs')
        svg.setAttribute('aria-hidden', 'true')
        svg.setAttribute('width', '0')
        svg.setAttribute('height', '0')
        svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
        const defs = document.createElementNS(ns, 'defs')
        const filter = document.createElementNS(ns, 'filter')
        filter.setAttribute('id', 'dsap-linear-blur')
        filter.setAttribute('x', '-30%')
        filter.setAttribute('y', '-30%')
        filter.setAttribute('width', '160%')
        filter.setAttribute('height', '160%')
        const gaussian = document.createElementNS(ns, 'feGaussianBlur')
        gaussian.setAttribute('stdDeviation', '0 0')
        filter.appendChild(gaussian)
        defs.appendChild(filter)
        svg.appendChild(defs)
        document.body.appendChild(svg)
      }
      const gaussian = svg.querySelector('feGaussianBlur')
      if (gaussian) gaussian.setAttribute('stdDeviation', `${(blur * 0.85).toFixed(2)} 0`)
      return 'url(#dsap-linear-blur)'
    }

    function applyBackground() {
      const root = document.documentElement
      const body = document.body
      if (!body) return
      const state = store.get()
      const resolved = resolveImage()
      const image = resolved.image
      const savedVersion = (state.savedVersions || {})[activeScheme]
      const shown = Boolean(image) && Boolean(appliedInfo.url) && appliedInfo.version === image.version &&
        (resolved.fallback || savedVersion === image.version)
      if (!shown) {
        body.style.backgroundImage = 'none'
        body.style.backgroundSize = ''
        body.style.backgroundPosition = ''
        body.style.backgroundRepeat = ''
        removeImageLayer()
        removeVideoLayer()
        if (wallpaperWrap) wallpaperWrap.style.display = 'none'
        root.removeAttribute('data-dsh-ap-bg')
        root.removeAttribute('data-dsh-ap-bg-blurtype')
        return
      }
      const geo = backgroundGeometry()
      const bg = profileOf(state.serverConfig, activeScheme).background
      const blur = Math.round(clamp(bg.blur, 0, 32, 0))
      const linear = blur > 0 && bg.blurType === 'linear'
      const filter = blur <= 0 ? 'none' : linear ? ensureBlurFilter(blur) : `blur(${blur}px)`
      // Slightly overscan blurred layers so the viewport edges do not fade out.
      const grow = blur > 0 ? 1 + Math.min(blur, 32) / 320 : 1
      const x = bg.posX * Math.max(0, geo.vw - geo.w)
      const y = bg.posY * Math.max(0, geo.vh - geo.h)
      const wrap = ensureWallpaperWrap()
      if (wrap) wrap.style.display = 'block'
      const mediaOpacity = String(clamp(bg.opacity, 0, 100, 100) / 100)
      if (wrap) wrap.style.background = themeBaseColor()
      body.style.backgroundImage = 'none'
      body.style.backgroundSize = ''
      body.style.backgroundPosition = ''
      body.style.backgroundRepeat = ''
      const kind = image.kind === 'video' || String(image.mime || '').indexOf('video/') === 0 ? 'video' : 'image'
      if (kind === 'video') {
        removeImageLayer()
        const video = ensureVideoLayer(appliedInfo.url)
        if (video) {
          video.style.width = Math.max(1, geo.w) + 'px'
          video.style.height = Math.max(1, geo.h) + 'px'
          video.style.left = x + 'px'
          video.style.top = y + 'px'
          video.style.filter = filter
          video.style.transform = `scale(${grow.toFixed(4)})`
          video.style.opacity = mediaOpacity
        }
      } else {
        removeVideoLayer()
        const layer = ensureImageLayer(appliedInfo.url)
        if (layer) {
          layer.style.width = Math.max(1, geo.vw) + 'px'
          layer.style.height = Math.max(1, geo.vh) + 'px'
          layer.style.backgroundSize = `${Math.max(1, geo.w)}px ${Math.max(1, geo.h)}px`
          layer.style.backgroundPosition = `${x}px ${y}px`
          layer.style.filter = filter
          layer.style.transform = `scale(${grow.toFixed(4)})`
          layer.style.opacity = mediaOpacity
        }
      }
      root.setAttribute('data-dsh-ap-bg', '1')
      root.setAttribute('data-dsh-ap-bg-blurtype', linear ? 'linear' : 'gaussian')
    }

    /* ------------------------------------------------------------------ */
    /* theme & css                                                         */
    /* ------------------------------------------------------------------ */

    let themeApplying = false
    let appliedThemeKey = ''

    function applyThemeTokens() {
      if (!pluginCtx || !pluginCtx.theme) return
      const state = store.get()
      const theme = profileOf(state.serverConfig, activeScheme).theme
      const mode = theme.mode
      const glass = profileOf(state.serverConfig, activeScheme).glass
      const resolved = resolveImage()
      const image = resolved.image
      const bgOn = Boolean(
        image && appliedInfo.version === image.version && (resolved.fallback || state.savedVersions[activeScheme] === image.version),
      )
      const key = [activeScheme, mode, accentColor(theme, activeScheme), bgOn ? image.version : '', glass.mode, glass.strength].join('|')
      if (key === appliedThemeKey) return
      if (themeDisposer) {
        try {
          themeDisposer()
        } catch {
          /* ignore */
        }
        themeDisposer = null
      }
      if (mode === 'default' && !bgOn) {
        appliedThemeKey = key
        return
      }
      const tokens = {}
      if (mode !== 'default') {
        const variants = brandVariants(accentColor(theme, activeScheme))
        tokens['--dsw-alias-brand-primary'] = { light: variants.light, dark: variants.dark }
      }
      if (bgOn) {
        tokens['--dsw-alias-bg-base'] = { light: 'rgba(255,255,255,0)', dark: 'rgba(18,20,26,0)' }
        tokens['--dsw-specific-sidebar-fill'] = { light: 'rgba(255,255,255,0)', dark: 'rgba(18,20,26,0)' }
      }
      themeApplying = true
      try {
        themeDisposer = pluginCtx.theme.overrideTokens(NS, tokens)
      } catch (err) {
        console.warn('[dsh-appearance] theme override failed', err)
      } finally {
        themeApplying = false
      }
      appliedThemeKey = key
    }

    function applyScheme() {
      const scheme = themeScheme()
      document.documentElement.setAttribute('data-dsh-ap-scheme', scheme)
      if (scheme === activeScheme) return
      activeScheme = scheme
      appliedInfo = { mode: null, version: null, url: null, w: 0, h: 0 }
      if (store.get().scheme !== scheme) store.set({ scheme })
      ensureImage()
      applyBackground()
    }

    function applyCssVars() {
      const root = document.documentElement
      const state = store.get()
      const glass = profileOf(state.serverConfig, activeScheme).glass
      const strength = glass.strength / 100
      const alpha =
        glass.mode === 'translucent' ? 0.86 - 0.3 * strength : glass.mode === 'liquid' ? 0.7 - 0.4 * strength : 0.78 - 0.4 * strength
      const blur =
        glass.mode === 'frosted' ? 8 + 18 * strength : glass.mode === 'liquid' ? 14 + 26 * strength : 0
      const accent = accentColor(profileOf(state.serverConfig, activeScheme).theme, activeScheme)
      root.style.setProperty('--dsh-ap-alpha', String(Math.max(0.18, Math.min(0.92, alpha)).toFixed(3)))
      root.style.setProperty('--dsh-ap-blur', `${Math.round(blur)}px`)
      root.style.setProperty('--dsh-ap-accent', accent)
      root.setAttribute('data-dsh-ap-glass', glass.mode)
      root.setAttribute('data-dsh-ap-region-conversation', glass.regions.conversation ? '1' : '0')
      root.setAttribute('data-dsh-ap-region-sidebar', glass.regions.sidebar ? '1' : '0')
      root.setAttribute('data-dsh-ap-region-panels', glass.regions.panels ? '1' : '0')
      root.setAttribute('data-dsh-ap-region-dialogs', glass.regions.dialogs ? '1' : '0')
      root.setAttribute('data-dsh-ap-answer', glass.answer === false ? '0' : '1')
      root.style.setProperty('--dsh-ap-radius', `${Math.round(glass.radius)}px`)
    }

    function tagColumns() {
      const overlay = document.querySelector('[data-shell-overlay]')
      const frame = overlay && overlay.parentElement
      if (!frame) return
      frame.setAttribute('data-dsh-ap-frame', '1')
      if (frame.hasAttribute('data-rightbar-fullscreen')) document.documentElement.setAttribute('data-dsh-ap-rb-full', '1')
      else document.documentElement.removeAttribute('data-dsh-ap-rb-full')
      const names = ['sidebar', 'center', 'rightbar']
      let index = 0
      for (const child of Array.from(frame.children)) {
        if (index >= names.length) break
        if (!(child instanceof HTMLElement)) continue
        if (child.hasAttribute('data-shell-bottom')) break
        child.setAttribute('data-dsh-ap-col', names[index])
        index += 1
      }
      tagCards(frame)
    }

    function paint(node, kind) {
      if (!node || node.closest('.dsap-settings')) return
      node.setAttribute('data-dsh-ap-card', kind)
    }

    // The composer bar slot spans the full width; only the inner white input box
    // should carry the glass surface. Pick the largest rounded, painted descendant.
    function tagComposerBar(center) {
      const bar = center.querySelector('[data-slot="conversation.composer.bar"]')
      if (!bar) return
      const cached = bar.__dsapComposerTag
      if (cached && cached.isConnected) {
        paint(cached, 'conversation')
        return
      }
      const candidates = []
      for (const node of bar.querySelectorAll('*')) {
        const style = window.getComputedStyle(node)
        const bg = style.backgroundColor || ''
        const alpha = /rgba\([^)]*,\s*([0-9.]+)\s*\)/.exec(bg)
        const painted = bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)' && !(alpha && Number(alpha[1]) < 0.12)
        const radius = parseFloat(style.borderRadius) || 0
        if (!painted || radius < 6) continue
        const box = node.getBoundingClientRect()
        if (box.width < 120 || box.height < 24) continue
        candidates.push({ node, area: box.width * box.height })
      }
      candidates.sort((a, b) => b.area - a.area)
      const target = candidates.length ? candidates[0].node : bar
      bar.__dsapComposerTag = target
      paint(target, 'conversation')
    }

    function tagChrome(sidebar, center) {
      if (sidebar) {
        for (const node of sidebar.querySelectorAll('button[data-sidebar-opener], button[data-sidebar-toggle]')) {
          paint(node, 'chrome')
        }
        for (const node of sidebar.querySelectorAll('[class*="sectionLabel"]')) {
          node.setAttribute('data-dsh-ap-section', '1')
        }
      }
      if (center) {
        // Paint each control exactly once. The slot wrappers and the buttons they
        // contain must not both receive a card, or the border/shadow doubles up.
        const controls = new Set()
        for (const node of center.querySelectorAll('[data-conversation-header-leading] button, [data-conversation-header-corner] button')) {
          controls.add(node)
        }
        for (const slot of center.querySelectorAll('[data-slot="conversation.session.header.actions"], [data-slot="conversation.session.header.utilities"]')) {
          for (const child of Array.from(slot.children)) {
            if (!(child instanceof HTMLElement)) continue
            const buttons = child.matches('button, [role="button"]')
              ? [child]
              : Array.from(child.querySelectorAll('button, [role="button"]'))
            // A single control gets the glass itself; a grouped control (e.g.
            // folder + chevron) gets one glass around the group, never both.
            controls.add(buttons.length === 1 ? buttons[0] : child)
          }
        }
        if (!controls.size) {
          for (const node of center.querySelectorAll('[class*="headerUtilities"] button, [class*="headerActions"] button')) controls.add(node)
        }
        for (const node of controls) paint(node, 'chrome')
        // The tab strip and the views "more" menu share one row; surface the row.
        const tabs = center.querySelector('[data-conversation-tabs]')
        if (tabs && tabs.parentElement) {
          tabs.parentElement.setAttribute('data-dsh-ap-tabs', '1')
          paint(tabs.parentElement, 'conversation')
        }
      }
    }

    function tagCards(frame) {
      const previous = document.querySelectorAll('[data-dsh-ap-card]')
      for (const node of previous) node.removeAttribute('data-dsh-ap-card')
      for (const node of document.querySelectorAll('[data-dsh-ap-section]')) node.removeAttribute('data-dsh-ap-section')

      const sidebar = frame.querySelector('[data-dsh-ap-col="sidebar"]')
      if (sidebar) {
        const rows = sidebar.querySelectorAll(
          'button[class*="newSession"], [class*="panelRow"], [class*="regionArea"] button, [class*="regionArea"] [role="button"], [class*="projectRow"], [class*="sessionRow"], [class*="searchResultRow"]',
        )
        for (const node of rows) {
          if (node.closest('.dsap-foot') || node.closest('[class*="footArea"]')) continue
          paint(node, 'sidebar')
        }
      }

      const center = frame.querySelector('[data-dsh-ap-col="center"]')
      if (center) {
        const rows = center.querySelectorAll(
          '[data-slot="conversation.chat.node"], [data-message-bubble], [data-slot="conversation.composer.dock"]',
        )
        for (const node of rows) {
          const flow = node.closest('[data-chat-flow-kind]')
          if (flow && flow.getAttribute('data-chat-flow-kind') === 'assistant-step') continue
          paint(node, 'conversation')
        }
        // The assistant flow kind is "assistant-step" (not "assistant"). The
        // glass belongs on the markdown root inside the routed chat node.
        for (const row of center.querySelectorAll('[data-chat-flow-kind="assistant-step"]')) {
          const slot = row.querySelector('[data-slot="conversation.chat.node"]')
          const target = (slot && slot.firstElementChild) || row
          paint(target, 'answer')
        }
        // Thinking / context-injection / tool calls: one glass card per process
        // group, separate from the answer glass. Members outside a group (older
        // hosts) still get their own card.
        for (const row of center.querySelectorAll('[data-chat-flow-kind="turn-process"]')) {
          if (row.closest('[data-dsh-ap-card="answer"]')) continue
          paint(row, 'process')
        }
        for (const node of center.querySelectorAll('[data-turn-process-member]')) {
          if (node.closest('[data-chat-flow-kind="turn-process"]')) continue
          if (node.closest('[data-dsh-ap-card="answer"]')) continue
          paint(node, 'process')
        }
        tagComposerBar(center)
      }
      tagChrome(sidebar, center)
      tagFade(center)
    }

    function clearFade(node) {
      if (!node) return
      node.removeAttribute('data-dsh-ap-fade')
      node.style.removeProperty('--dsap-fade-start')
      node.style.removeProperty('--dsap-fade-end')
      node.__dsapFadeStart = undefined
      node.__dsapFadeEnd = undefined
    }

    // Fade each conversation row only where it passes underneath the composer.
    // Masking the rows themselves (instead of the scroll container) keeps the
    // composer untouched and works even when chat virtualization replaces the
    // scroll content. The visible band starts at the input box top and ends
    // ~20% into the composer height.
    function updateFade(scroll) {
      if (!scroll) return
      const seat = scroll.querySelector('[data-composer-seat]')
      const bar = scroll.querySelector('[data-slot="conversation.composer.bar"]')
      const box = bar && bar.__dsapComposerTag && bar.__dsapComposerTag.isConnected ? bar.__dsapComposerTag : null
      const anchor = box || seat
      const marked = Array.from(scroll.querySelectorAll('[data-dsh-ap-fade]'))

      if (!anchor) {
        for (const node of marked) clearFade(node)
        return
      }
      const anchorRect = anchor.getBoundingClientRect()
      const anchorTop = anchorRect.top
      if (anchorRect.height <= 0) {
        for (const node of marked) clearFade(node)
        return
      }
      const band = Math.max(18, Math.min(64, anchorRect.height * 0.22))

      const rows = []
      for (const node of scroll.querySelectorAll('[data-chat-flow-kind]')) {
        const parent = node.parentElement
        if (parent && parent.closest('[data-chat-flow-kind]')) continue
        rows.push(node)
      }

      const keep = new Set()
      for (const row of rows) {
        const rect = row.getBoundingClientRect()
        if (rect.height <= 0) continue
        // Fully above the composer: leave it crisp.
        if (rect.bottom <= anchorTop + 0.5) continue
        let start
        let end
        if (rect.top >= anchorTop - 0.5) {
          // Fully underneath the composer: hide it completely.
          start = 0
          end = 0
        } else {
          start = Math.max(0, Math.min(rect.height, anchorTop - rect.top))
          end = Math.min(rect.height, start + band)
        }
        const startPx = Math.round(start)
        const endPx = Math.round(end)
        // Mask the content inside an answer card, never the card root: the
        // card's border lives on ::before and would be clipped by the mask.
        const card = row.querySelector('[data-dsh-ap-card="answer"]')
        const target = (card && (card.querySelector('[class*="body"]') || card.firstElementChild)) || card || row
        // Row coordinates only map onto the target after removing its offset.
        const targetRect = target.getBoundingClientRect()
        const offset = Math.round(targetRect.top - rect.top)
        const startOnTarget = Math.max(0, Math.min(targetRect.height, startPx - offset))
        const endOnTarget = Math.max(0, Math.min(targetRect.height, endPx - offset))
        const startPx2 = Math.round(startOnTarget)
        const endPx2 = Math.round(endOnTarget)
        keep.add(target)
        if (target.__dsapFadeStart === startPx2 && target.__dsapFadeEnd === endPx2 && target.hasAttribute('data-dsh-ap-fade')) continue
        target.__dsapFadeStart = startPx2
        target.__dsapFadeEnd = endPx2
        target.style.setProperty('--dsap-fade-start', startPx2 + 'px')
        target.style.setProperty('--dsap-fade-end', endPx2 + 'px')
        target.setAttribute('data-dsh-ap-fade', '1')
      }

      for (const node of marked) {
        if (!keep.has(node)) clearFade(node)
      }
    }

    function tagFade(center) {
      if (!center) return
      const scroll = center.querySelector('[data-conversation-scroll]')
      if (!scroll) return
      if (scroll.__dsapFadeBound !== true) {
        scroll.__dsapFadeBound = true
        let ticking = false
        const schedule = () => {
          if (ticking) return
          ticking = true
          window.requestAnimationFrame(() => {
            ticking = false
            updateFade(scroll)
          })
        }
        scroll.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
      }
      updateFade(scroll)
    }

    function applyVisuals() {
      applyScheme()
      applyCssVars()
      applyBackground()
      applyThemeTokens()
      tagColumns()
    }

    let visualQueued = false
    function queueVisuals() {
      if (visualQueued) return
      visualQueued = true
      const run = () => {
        visualQueued = false
        applyVisuals()
      }
      if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(run)
      else setTimeout(run, 16)
    }

    /* ------------------------------------------------------------------ */
    /* config persistence                                                  */
    /* ------------------------------------------------------------------ */

    function setConfig(next) {
      const merged = normalizeConfig(next)
      const state = store.get()
      const staged = Boolean(state.stagedImage) || Boolean(state.stagedRemove)
      store.set({ config: merged, dirty: staged || configKey(merged) !== configKey(state.serverConfig) })
      return merged
    }

    function discardChanges() {
      const state = store.get()
      releaseStaged()
      store.set({
        config: state.serverConfig,
        stagedImage: null,
        stagedRemove: false,
        stagedRemoveMode: null,
        dirty: false,
        note: null,
        error: null,
      })
      applyVisuals()
    }

    async function postImage(staged) {
      const mode = staged.mode || store.get().editScheme
      const res = await fetch(`${API}/background?mode=${encodeURIComponent(mode)}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'content-type': staged.type || 'application/octet-stream',
          'x-image-width': String(Math.max(0, Math.round(staged.w || 0))),
          'x-image-height': String(Math.max(0, Math.round(staged.h || 0))),
        },
        body: staged.blob,
      })
      if (!res.ok) {
        let message = `HTTP ${res.status}`
        try {
          const body = await res.json()
          if (body && body.error) message = body.error
        } catch {
          /* ignore */
        }
        throw new Error(message)
      }
      const result = await res.json()
      return result.image || null
    }

    async function saveConfig() {
      if (store.get().saving) return false
      store.set({ saving: true, note: null })
      try {
        const state = store.get()
        const staged = state.stagedImage
        if (staged) {
          const mode = staged.mode || state.editScheme
          const image = await postImage(staged)
          releaseStaged()
          // Only the visible theme owns the on-screen wallpaper. Saving the other
          // theme must not clear or swap what the user is currently looking at.
          if (mode === activeScheme) appliedInfo = { mode: null, version: null, url: null, w: 0, h: 0 }
          store.set({
            images: Object.assign({}, state.images, { [mode]: image || null }),
            savedVersions: Object.assign({}, state.savedVersions, { [mode]: image ? image.version : null }),
            stagedImage: null,
            stagedRemove: false,
            stagedRemoveMode: null,
            error: null,
          })
          if (mode === activeScheme) ensureImage()
          applyVisuals()
        } else if (state.stagedRemove) {
          const mode = state.stagedRemoveMode || state.editScheme
          await apiJson(`/background?mode=${encodeURIComponent(mode)}`, { method: 'DELETE' })
          if (mode === activeScheme) appliedInfo = { mode: null, version: null, url: null, w: 0, h: 0 }
          store.set({
            images: Object.assign({}, state.images, { [mode]: null }),
            savedVersions: Object.assign({}, state.savedVersions, { [mode]: null }),
            stagedRemove: false,
            stagedRemoveMode: null,
            error: null,
          })
          applyVisuals()
        }

        const result = await apiJson('/config', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(store.get().config),
        })
        const config = normalizeConfig(result.config)
        const nextImages = result.images || store.get().images
        store.set({
          config,
          serverConfig: config,
          images: { light: nextImages.light || null, dark: nextImages.dark || null },
          savedVersions: {
            light: nextImages.light ? nextImages.light.version : null,
            dark: nextImages.dark ? nextImages.dark.version : null,
          },
          revision: Number(result.revision) || store.get().revision,
          saving: false,
          dirty: false,
          note: 'saved',
        })
        applyVisuals()
        setTimeout(() => {
          if (store.get().note === 'saved') store.set({ note: null })
        }, 1600)
        return true
      } catch (err) {
        store.set({
          saving: false,
          note: 'saveFailed',
          error: String((err && err.message) || err),
        })
        return false
      }
    }

    /* ------------------------------------------------------------------ */
    /* balance & usage                                                     */
    /* ------------------------------------------------------------------ */

    async function refreshBalance() {
      try {
        await apiJson('/refresh', { method: 'POST' })
      } catch (err) {
        store.set({ error: String((err && err.message) || err) })
      }
      await loadState(false)
    }

    function releaseStaged() {
      const staged = store.get().stagedImage
      if (staged && staged.url) {
        try {
          URL.revokeObjectURL(staged.url)
        } catch {
          /* ignore */
        }
      }
    }

    function clearStaged() {
      releaseStaged()
      const state = store.get()
      store.set({
        stagedImage: null,
        stagedRemove: false,
        stagedRemoveMode: null,
        dirty: configKey(state.config) !== configKey(state.serverConfig),
      })
    }

    async function stageImage(file) {
      const prepared = await prepareImage(file)
      const palette = await extractPalette(prepared.blob)
      const url = URL.createObjectURL(prepared.blob)
      const current = store.get()
      const editTheme = profileOf(current.config, current.editScheme).theme
      const themePatch = palette.length
        ? {
            palette,
            mode: editTheme.mode === 'default' ? 'auto' : editTheme.mode,
            color: palette[0] || editTheme.color,
          }
        : {}
      const config = normalizeConfig(
        updateProfile(current.config, current.editScheme, { theme: Object.assign({}, editTheme, themePatch) }),
      )
      releaseStaged()
      store.set({
        stagedImage: {
          mode: current.editScheme,
          blob: prepared.blob,
          type: prepared.type,
          kind: prepared.kind || (String(prepared.type || '').indexOf('video/') === 0 ? 'video' : 'image'),
          url,
          w: prepared.width,
          h: prepared.height,
        },
        stagedRemove: false,
        stagedRemoveMode: null,
        config,
        dirty: true,
        error: null,
        note: palette.length ? `autoPicked:${palette.length}` : null,
      })
    }

    function removeImage() {
      const state = store.get()
      if (state.stagedImage) {
        clearStaged()
        store.set({ note: null })
        return
      }
      if (!state.images[state.editScheme]) return
      store.set({ stagedRemove: true, stagedRemoveMode: state.editScheme, dirty: true, note: null })
    }

    function readFileAsImage(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const img = new window.Image()
        img.onload = () => {
          resolve({ img, url })
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('图片读取失败'))
        }
        img.src = url
      })
    }

    function readVideoDims(file) {
      return new Promise((resolve) => {
        const url = URL.createObjectURL(file)
        const video = document.createElement('video')
        let settled = false
        const finish = (w, h) => {
          if (settled) return
          settled = true
          try {
            URL.revokeObjectURL(url)
          } catch {
            /* ignore */
          }
          resolve({ w: w || 0, h: h || 0 })
        }
        video.preload = 'metadata'
        video.muted = true
        video.onloadedmetadata = () => finish(video.videoWidth, video.videoHeight)
        video.onerror = () => finish(0, 0)
        setTimeout(() => finish(video.videoWidth, video.videoHeight), 5000)
        video.src = url
      })
    }

    async function prepareImage(file) {
      if (!file) throw new Error('请选择背景文件')
      const type = String(file.type || '')
      const isVideo = type.indexOf('video/') === 0 || /\.(mp4|webm|ogv|mov)$/i.test(file.name || '')
      if (!isVideo && type.indexOf('image/') !== 0) throw new Error('请选择图片或视频文件')
      if (file.size > 80 * 1024 * 1024) throw new Error('背景文件超过 80MB')
      if (isVideo) {
        const dims = await readVideoDims(file)
        return { blob: file, type: type || 'video/mp4', width: dims.w, height: dims.h, kind: 'video' }
      }
      const { img, url } = await readFileAsImage(file)
      const width = img.naturalWidth
      const height = img.naturalHeight
      const overSize = file.size > 8 * 1024 * 1024 || width > 4096 || height > 4096
      if (!overSize) {
        URL.revokeObjectURL(url)
        return { blob: file, type: file.type, width, height, kind: 'image' }
      }
      const maxSide = 3840
      const scale = Math.min(1, maxSide / Math.max(width, height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      const context = canvas.getContext('2d')
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
      if (!blob) throw new Error('图片压缩失败')
      return { blob, type: 'image/jpeg', width: canvas.width, height: canvas.height, kind: 'image' }
    }

    function extractPalette(blob) {
      const isVideo = String((blob && blob.type) || '').indexOf('video/') === 0
      return new Promise((resolve) => {
        const url = URL.createObjectURL(blob)
        let settled = false
        let timer = null
        const finish = (list) => {
          if (settled) return
          settled = true
          if (timer) clearTimeout(timer)
          try {
            URL.revokeObjectURL(url)
          } catch {
            /* ignore */
          }
          resolve(list)
        }
        const draw = (source) => {
          try {
            const size = 96
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            const context = canvas.getContext('2d', { willReadFrequently: true })
            context.drawImage(source, 0, 0, size, size)
            const data = context.getImageData(0, 0, size, size).data
            const buckets = new Map()
            for (let i = 0; i < data.length; i += 4) {
              const alpha = data[i + 3]
              if (alpha < 128) continue
              const r = data[i]
              const g = data[i + 1]
              const b = data[i + 2]
              const max = Math.max(r, g, b)
              const min = Math.min(r, g, b)
              const light = (max + min) / 510
              if (light < 0.1 || light > 0.93) continue
              const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)
              const entry = buckets.get(key)
              if (entry) {
                entry.count += 1
              } else {
                buckets.set(key, { count: 1, r, g, b })
              }
            }
            const top = [...buckets.values()].sort((a, b) => b.count - a.count).slice(0, 48)
            const picked = []
            for (const entry of top) {
              if (picked.length >= 5) break
              const tooClose = picked.some((hex) => {
                const other = hexToRgb(hex)
                const distance =
                  Math.abs(other.r - entry.r) + Math.abs(other.g - entry.g) + Math.abs(other.b - entry.b)
                return distance < 48
              })
              if (!tooClose) picked.push(rgbToHex(entry.r, entry.g, entry.b))
            }
            finish(picked)
          } catch {
            finish([])
          }
        }
        if (isVideo) {
          const video = document.createElement('video')
          video.muted = true
          video.preload = 'auto'
          video.playsInline = true
          video.onloadeddata = () => {
            try {
              video.currentTime = Math.min(0.15, Math.max(0.01, (video.duration || 1) / 3))
            } catch {
              draw(video)
            }
          }
          video.onseeked = () => draw(video)
          video.onerror = () => finish([])
          timer = setTimeout(() => {
            if (video.videoWidth) draw(video)
            else finish([])
          }, 6000)
          video.src = url
        } else {
          const img = new window.Image()
          img.onload = () => draw(img)
          img.onerror = () => finish([])
          img.src = url
        }
      })
    }

    /* ------------------------------------------------------------------ */
    /* styles                                                              */
    /* ------------------------------------------------------------------ */

    const CSS = `
      .dsap-settings { display:flex; flex-direction:column; gap:14px; padding:2px 0 28px; font-size:13px; color:var(--dsw-alias-label-primary); }
      .dsap-settings-head { display:flex; flex-direction:column; gap:6px; }
      .dsap-intro { margin:0; color:var(--dsw-alias-label-secondary); font-size:12px; line-height:1.6; }
      .dsap-savebar { display:flex; align-items:center; flex-wrap:wrap; gap:8px; padding:10px 12px; border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-1); box-shadow:0 6px 18px rgba(0,0,0,.12); }
      .dsap-save-state { font-size:12px; font-weight:600; color:var(--dsw-alias-label-secondary); }
      .dsap-savebar[data-dirty='1'] .dsap-save-state { color:var(--dsw-alias-state-warn-primary); }
      .dsap-save-hint { flex:1; min-width:120px; font-size:10px; line-height:1.4; color:var(--dsw-alias-label-secondary); }
      .dsap-card { border:1px solid var(--dsw-alias-border-l1); border-radius:12px; padding:14px; background:var(--dsw-alias-bg-layer-1); }
      .dsap-card-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
      .dsap-card-title { font-size:13px; font-weight:600; margin:0; }
      .dsap-hint { color:var(--dsw-alias-label-secondary); font-size:11px; line-height:1.6; margin:6px 0 0; }
      .dsap-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
      .dsap-row + .dsap-row { margin-top:10px; }
      .dsap-label { font-size:11px; color:var(--dsw-alias-label-secondary); min-width:44px; }
      .dsap-stage { position:relative; height:auto; aspect-ratio:var(--dsap-stage-ratio, 16 / 9); min-height:170px; max-height:320px; border-radius:10px; overflow:hidden; border:1px solid var(--dsw-alias-border-l2); background-color:var(--dsw-alias-bg-layer-2); cursor:grab; touch-action:none; background-repeat:no-repeat; }
      .dsap-stage-media { position:absolute; max-width:none; pointer-events:none; user-select:none; }
      .dsap-stage-frame { position:absolute; inset:0; background-repeat:no-repeat; pointer-events:none; }
      .dsap-stage[data-empty='1'] { display:grid; place-items:center; color:var(--dsw-alias-label-secondary); font-size:12px; background-image:linear-gradient(135deg, var(--dsw-alias-bg-layer-2), var(--dsw-alias-bg-overlay)); }
      .dsap-stage:active { cursor:grabbing; }
      .dsap-stage::after { content:attr(data-hint); position:absolute; right:8px; bottom:6px; font-size:10px; color:#fff; background:rgba(0,0,0,.35); padding:2px 6px; border-radius:6px; opacity:0; transition:opacity .2s; }
      .dsap-stage:hover::after { opacity:1; }
      .dsap-btn { border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); border-radius:8px; padding:6px 12px; font-size:12px; cursor:pointer; }
      .dsap-btn:hover { background:var(--dsw-alias-bg-layer-2); }
      .dsap-btn[data-primary='1'] { background:var(--dsw-alias-brand-primary); color:#fff; border-color:transparent; }
      .dsap-btn:disabled { opacity:.5; cursor:default; }
      .dsap-seg { display:inline-flex; border:1px solid var(--dsw-alias-border-l1); border-radius:9px; overflow:hidden; }
      .dsap-seg button { border:0; background:transparent; color:var(--dsw-alias-label-secondary); font-size:12px; padding:6px 12px; cursor:pointer; }
      .dsap-seg button[data-active='1'] { background:var(--dsw-alias-bg-layer-2); color:var(--dsw-alias-brand-primary); font-weight:600; }
      .dsap-range { width:100%; accent-color:var(--dsw-alias-brand-primary); }
      .dsap-value { font-size:11px; color:var(--dsw-alias-label-secondary); min-width:38px; text-align:right; }
      .dsap-swatches { display:flex; gap:8px; flex-wrap:wrap; }
      .dsap-swatch { width:26px; height:26px; border-radius:8px; border:2px solid transparent; cursor:pointer; padding:0; }
      .dsap-swatch[data-active='1'] { border-color:var(--dsw-alias-label-primary); }
      .dsap-color { width:34px; height:26px; padding:0; border:1px solid var(--dsw-alias-border-l1); border-radius:7px; background:transparent; }
      .dsap-input { width:86px; border:1px solid var(--dsw-alias-border-l1); background:var(--dsw-alias-bg-layer-2); color:var(--dsw-alias-label-primary); border-radius:7px; padding:5px 8px; font-size:12px; }
      .dsap-input[data-size='sm'] { width:44px; }
      .dsap-chip { font-size:10px; color:var(--dsw-alias-label-secondary); border:1px solid var(--dsw-alias-border-l1); border-radius:999px; padding:2px 8px; }
      .dsap-toggle { display:inline-flex; align-items:center; gap:7px; font-size:12px; color:var(--dsw-alias-label-primary); cursor:pointer; }
      .dsap-toggle input { accent-color:var(--dsw-alias-brand-primary); }
      .dsap-note { font-size:11px; color:var(--dsw-alias-state-success-primary); }
      .dsap-note[data-kind='error'] { color:var(--dsw-alias-state-error-primary); }
      .dsap-empty { color:var(--dsw-alias-label-secondary); }

      .dsap-foot { display:flex; flex-direction:column; gap:6px; width:100%; min-width:0; padding:2px 0 8px; }
      .dsap-foot-meta { font-size:10px; line-height:1.35; color:var(--dsw-alias-label-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .dsap-foot-balance { display:block; width:100%; font-size:12px; font-weight:600; line-height:1.45; white-space:normal; overflow:visible; overflow-wrap:anywhere; text-overflow:clip; color:var(--dsw-alias-label-primary); }
      .dsap-foot-actions { display:flex; gap:6px; }
      .dsap-icon { width:24px; height:24px; display:grid; place-items:center; border:1px solid var(--dsw-alias-border-l1); border-radius:7px; background:transparent; color:var(--dsw-alias-label-secondary); cursor:pointer; padding:0; }
      .dsap-icon:hover { background:var(--dsw-alias-bg-layer-2); color:var(--dsw-alias-label-primary); }
      .dsap-icon svg { width:14px; height:14px; }
      .dsap-foot[data-narrow='1'] { align-items:center; gap:6px; }
      .dsap-foot[data-narrow='1'] .dsap-foot-actions { flex-direction:column; }

      .dsap-modal { position:fixed; inset:0; z-index:9999; display:grid; place-items:center; background:rgba(0,0,0,.38); }
      .dsap-modal-card { width:min(380px, 90vw); border-radius:14px; padding:20px; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); box-shadow:0 24px 80px rgba(0,0,0,.35); }
      .dsap-modal-title { margin:0 0 8px; font-size:14px; font-weight:600; }
      .dsap-modal-body { margin:0; font-size:12px; line-height:1.7; color:var(--dsw-alias-label-secondary); }
      .dsap-modal-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:18px; }
    `

    const GLASS_CSS = `
      html[data-dsh-ap-bg='1'] body { background-color: transparent; }
      html[data-dsh-ap-bg='1'] [data-dsh-ap-frame] { background-color: transparent !important; background-image: none !important; }
      html[data-dsh-ap-bg='1'] #root { background-color: transparent; }

      .dsap-wallpaper-wrap { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
      .dsap-image-bg, .dsap-video-bg { position: absolute; left: 0; top: 0; pointer-events: none; transform-origin: center; }
      .dsap-image-bg { background-repeat: no-repeat; }
      .dsap-video-bg { object-fit: fill; background: transparent; }

      /* Conversation text stays readable above the composer and fades out only
         while it passes underneath it. No solid scrim is painted over the glass. */
      html[data-dsh-ap-bg='1'] [data-dsh-ap-fade] {
        -webkit-mask-image: linear-gradient(to bottom, #000 0px, #000 var(--dsap-fade-start), transparent var(--dsap-fade-end), transparent 100%);
        mask-image: linear-gradient(to bottom, #000 0px, #000 var(--dsap-fade-start), transparent var(--dsap-fade-end), transparent 100%);
      }

      /* Header chrome: readable text/icons on a glass pill, without a second ring. */
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) [data-dsh-ap-card='chrome'] {
        color: var(--dsw-alias-label-primary) !important;
        border-color: transparent !important;
        box-shadow: none !important;
      }
      html[data-dsh-ap-bg='1'] [data-dsh-ap-card='chrome'] svg { color: inherit !important; }
      html[data-dsh-ap-bg='1'] [data-dsh-ap-tabs='1'] { margin-left: -8px; margin-right: -8px; padding-left: 10px; padding-right: 10px; }

      /* Sidebar section captions (e.g. "工作区") get the strong label color. */
      html[data-dsh-ap-bg='1'] [data-dsh-ap-section] { color: var(--dsw-alias-label-primary) !important; font-weight: 650; }

      /* AI answers get an inset glass halo without changing the text layout. The
         pseudo-element is isolated so its negative paint order stays behind the
         answer text instead of blurring it. */
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) [data-dsh-ap-card='answer'] {
        position: relative;
        isolation: isolate;
        background: transparent !important;
        background-image: none !important;
        border: 0 !important;
        box-shadow: none !important;
        padding: 0;
      }
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) [data-dsh-ap-card='answer']::before {
        content: '';
        position: absolute;
        z-index: -1;
        inset: -10px -14px;
        border-radius: calc(var(--dsh-ap-radius) + 2px);
        background-color: rgba(255,255,255,var(--dsh-ap-alpha));
        -webkit-backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        border: 1px solid rgba(255,255,255,.30);
        box-shadow: 0 2px 14px rgba(0,0,0,.07);
        pointer-events: none;
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) [data-dsh-ap-card='answer']::before {
        background-color: rgba(18,20,26,var(--dsh-ap-alpha));
        border-color: rgba(255,255,255,.12);
      }
      html[data-dsh-ap-answer='0'] [data-dsh-ap-card='answer']::before,
      html[data-dsh-ap-region-conversation='0'] [data-dsh-ap-card='answer']::before,
      html[data-dsh-ap-glass='none'] [data-dsh-ap-card='answer']::before {
        display: none;
      }

      html[data-dsh-ap-bg='1'] [data-dsh-ap-col],
      html[data-dsh-ap-bg='1'] [data-conversation-content],
      html[data-dsh-ap-bg='1'] [data-shell-bottom],
      html[data-dsh-ap-bg='1'] [data-rightbar-col],
      html[data-dsh-ap-bg='1'] [data-global-panel] { background-color: transparent; }

      /* Top bars stay transparent: logo strip, window drag strip, conversation tabs/header. */
      html[data-dsh-ap-bg='1'] header[data-window-drag],
      html[data-dsh-ap-bg='1'] [class*='topStrip'],
      html[data-dsh-ap-bg='1'] [class*='logoRow'],
      html[data-dsh-ap-bg='1'] [data-conversation-header-leading],
      html[data-dsh-ap-bg='1'] [data-conversation-header-corner],
      html[data-dsh-ap-bg='1'] [data-shell-leading] {
        background-color: transparent !important;
        background-image: none !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
        border: 0 !important;
        box-shadow: none !important;
      }

      /* Cards: only interactive / informational rows get a glass surface. */
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) [data-dsh-ap-card]:not([data-dsh-ap-card='answer']) {
        background-color: rgba(255,255,255,var(--dsh-ap-alpha)) !important;
        -webkit-backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        border-radius: var(--dsh-ap-radius);
        border: 1px solid rgba(255,255,255,.30);
        box-shadow: 0 2px 14px rgba(0,0,0,.07);
      }
      /* Sidebar footer widget is not an in-app card: style its root directly. */
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) .dsap-foot {
        background-color: rgba(255,255,255,var(--dsh-ap-alpha));
        -webkit-backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        border-radius: var(--dsh-ap-radius);
        border: 1px solid rgba(255,255,255,.30);
        box-shadow: 0 2px 14px rgba(0,0,0,.07);
        padding: 8px 10px;
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) .dsap-foot {
        background-color: rgba(18,20,26,var(--dsh-ap-alpha));
        border-color: rgba(255,255,255,.12);
      }
      html[data-dsh-ap-region-sidebar='0'] .dsap-foot,
      html[data-dsh-ap-glass='none'] .dsap-foot {
        background-color: transparent;
        border-color: transparent;
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }
      /* Usage readout switched off: only the two action buttons are glass. */
      html[data-dsh-ap-bg='1'] .dsap-foot[data-mini='1'] {
        width:auto;
        align-self:flex-start;
        align-items:flex-start;
        gap:0;
        background-color: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
        padding: 0 !important;
      }
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) .dsap-foot-actions[data-glass='1'] {
        width:max-content;
        padding: 4px 5px;
        border-radius: var(--dsh-ap-radius);
        background-color: rgba(255,255,255,var(--dsh-ap-alpha));
        -webkit-backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.18);
        border: 1px solid rgba(255,255,255,.30);
        box-shadow: 0 2px 14px rgba(0,0,0,.07);
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) .dsap-foot-actions[data-glass='1'] {
        background-color: rgba(18,20,26,var(--dsh-ap-alpha));
        border-color: rgba(255,255,255,.12);
      }
      html[data-dsh-ap-region-sidebar='0'] .dsap-foot-actions[data-glass='1'],
      html[data-dsh-ap-glass='none'] .dsap-foot-actions[data-glass='1'] {
        background-color: transparent;
        border-color: transparent;
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) [data-dsh-ap-card]:not([data-dsh-ap-card='answer']) {
        background-color: rgba(18,20,26,var(--dsh-ap-alpha)) !important;
        border-color: rgba(255,255,255,.12);
      }
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass='none'] [data-dsh-ap-card] {
        background-color: transparent !important;
        border-color: transparent;
        box-shadow: none;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }

      /* Chrome widgets keep the same host glass as every other card. They must
         NOT be repositioned: the sidebar opener/collapse buttons rely on their
         own absolute placement. Only while a dropdown is open do we drop the
         host's backdrop-filter, so the popover is not trapped in a stacking
         context below the conversation. */
      html[data-dsh-ap-bg='1'][data-dsh-ap-glass]:not([data-dsh-ap-glass='none']) [data-dsh-ap-card='chrome'] {
        border-color: transparent !important;
        box-shadow: none !important;
      }
      html[data-dsh-ap-bg='1'] [data-dsh-ap-card='chrome']:has([aria-expanded='true']) {
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
        z-index: 30;
      }

      /* Fullscreen right panel: hide the conversation it covers and keep a
         near-opaque glass surface so no chat text bleeds through. The panel is
         absolutely positioned and may overhang its grid column, so the surface
         must be painted on the panel root as well as on the column. */
      html[data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dsh-ap-col='center'] { visibility: hidden !important; }
      html[data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dsh-ap-col='rightbar'],
      html[data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dsh-ap-col='rightbar'] > * {
        background-color: rgba(255,255,255,.92) !important;
        -webkit-backdrop-filter: blur(24px) saturate(1.2);
        backdrop-filter: blur(24px) saturate(1.2);
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dsh-ap-col='rightbar'],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dsh-ap-col='rightbar'] > * {
        background-color: rgba(18,20,26,.92) !important;
      }
      /* Menus opened from the fullscreen panel can overflow past the panel
         surface, so they need the same near-opaque glass. */
      html[data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'] [role='menu'],
      html[data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'] [role='listbox'] {
        background-color: rgba(255,255,255,.92) !important;
        -webkit-backdrop-filter: blur(24px) saturate(1.2);
        backdrop-filter: blur(24px) saturate(1.2);
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'] [role='menu'],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'] [role='listbox'] {
        background-color: rgba(18,20,26,.92) !important;
      }

      html[data-dsh-ap-region-sidebar='0'] [data-dsh-ap-card='sidebar'],
      html[data-dsh-ap-region-conversation='0'] [data-dsh-ap-card='conversation'] {
        background-color: transparent !important;
        background-image: none !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
      }

      /* Panels and dialogs keep whole-surface glass. */
      html[data-dsh-ap-region-panels='1'] [data-rightbar-col],
      html[data-dsh-ap-region-panels='1'] [data-global-panel] {
        background-color: rgba(255,255,255,var(--dsh-ap-alpha));
        -webkit-backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.2);
        backdrop-filter: blur(var(--dsh-ap-blur)) saturate(1.2);
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-region-panels='1'] [data-rightbar-col],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-region-panels='1'] [data-global-panel] {
        background-color: rgba(18,20,26,var(--dsh-ap-alpha));
      }
      html[data-dsh-ap-glass='none'][data-dsh-ap-region-panels='1'] [data-rightbar-col],
      html[data-dsh-ap-glass='none'][data-dsh-ap-region-panels='1'] [data-global-panel] {
        background-color: transparent;
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }

      html[data-dsh-ap-region-dialogs='1'] [role='dialog'],
      html[data-dsh-ap-region-dialogs='1'] [role='alertdialog'],
      html[data-dsh-ap-region-dialogs='1'] [role='menu'] {
        background-color: rgba(255,255,255,calc(var(--dsh-ap-alpha) + 0.12)) !important;
        -webkit-backdrop-filter: blur(calc(var(--dsh-ap-blur) + 6px)) saturate(1.25);
        backdrop-filter: blur(calc(var(--dsh-ap-blur) + 6px)) saturate(1.25);
        border-radius: var(--dsh-ap-radius);
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-region-dialogs='1'] [role='dialog'],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-region-dialogs='1'] [role='alertdialog'],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-region-dialogs='1'] [role='menu'] {
        background-color: rgba(18,20,26,calc(var(--dsh-ap-alpha) + 0.12)) !important;
      }

      /* Popovers must always sit above the conversation surface. */
      html[data-dsh-ap-bg='1'] [role='menu'],
      html[data-dsh-ap-bg='1'] [role='listbox'] { z-index: 2147483000 !important; }
      /* Fullscreen right panel menus must win over the dialog glass rule above
         (same properties, but declared later). */
      html[data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'][data-dsh-ap-region-dialogs='1'] [role='menu'],
      html[data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'][data-dsh-ap-region-dialogs='1'] [role='listbox'] {
        background-color: rgba(255,255,255,.92) !important;
        -webkit-backdrop-filter: blur(24px) saturate(1.2) !important;
        backdrop-filter: blur(24px) saturate(1.2) !important;
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'][data-dsh-ap-region-dialogs='1'] [role='menu'],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'][data-dsh-ap-rb-full='1'][data-dsh-ap-region-dialogs='1'] [role='listbox'] {
        background-color: rgba(18,20,26,.92) !important;
      }
      /* Fullscreen right-panel dock/panel internals may overhang the column. */
      html[data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dockkit-host],
      html[data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-sidebar-right-session],
      html[data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dockkit-empty] {
        background-color: rgba(255,255,255,.92) !important;
      }
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dockkit-host],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-sidebar-right-session],
      html[data-dsh-ap-scheme='dark'][data-dsh-ap-bg='1'] [data-rightbar-fullscreen] [data-dockkit-empty] {
        background-color: rgba(18,20,26,.92) !important;
      }

      /* Thinking / context injection / tool calls share one process card. */
      html[data-dsh-ap-region-conversation='0'] [data-dsh-ap-card='process'] {
        background-color: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        -webkit-backdrop-filter: none !important;
        backdrop-filter: none !important;
      }

      /* Settings: pinned tabs and light/dark editor switch. */
      .dsap-sticky { position:sticky; top:0; z-index:6; display:flex; flex-direction:column; gap:8px; padding:6px 0 8px; background:color-mix(in srgb, var(--dsw-alias-bg-layer-1) 90%, transparent); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); border-radius:0 0 12px 12px; }
      .dsap-tabs { display:flex; gap:4px; padding:4px; border-radius:12px; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); }
      .dsap-tabs button { flex:1; min-width:0; appearance:none; border:0; background:transparent; color:var(--dsw-alias-label-secondary); font:inherit; font-size:12px; padding:7px 10px; border-radius:9px; cursor:pointer; }
      .dsap-tabs button[data-active='1'] { background:var(--dsw-alias-bg-base); color:var(--dsw-alias-label-primary); box-shadow:0 1px 4px rgba(0,0,0,.10); }
      .dsap-scheme-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
      .dsap-scheme-row .dsap-label { flex:1 1 220px; font-size:11px; color:var(--dsw-alias-label-secondary); line-height:1.4; }
      .dsap-usage-note { color:var(--dsw-alias-label-secondary); font-size:11px; opacity:.85; }
      .dsap-dropzone { border-style:dashed; }
      .dsap-drop-hint { color:var(--dsw-alias-label-secondary); font-size:11px; }
      .dsap-composer-toggle { position:fixed; right:26px; bottom:176px; z-index:31; pointer-events:auto; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:50%; background-color:rgba(255,255,255,var(--dsh-ap-alpha)); color:var(--dsw-alias-label-primary); border:1px solid rgba(255,255,255,.30); box-shadow:0 2px 14px rgba(0,0,0,.07); -webkit-backdrop-filter:blur(var(--dsh-ap-blur)) saturate(1.18); backdrop-filter:blur(var(--dsh-ap-blur)) saturate(1.18); cursor:pointer; }
      html[data-dsh-ap-scheme='dark'] .dsap-composer-toggle { background-color:rgba(18,20,26,var(--dsh-ap-alpha)); border-color:rgba(255,255,255,.12); }
      html[data-dsh-ap-glass='none'] .dsap-composer-toggle { background-color:transparent; border-color:var(--dsw-alias-border-l1); box-shadow:none; -webkit-backdrop-filter:none; backdrop-filter:none; }
      .dsap-composer-toggle svg { width:16px; height:16px; }
      html[data-dsh-ap-composer-collapsed='1'] [data-composer-seat] {
        --dsh-composer-text-max-height: 168px !important;
      }
      html[data-dsh-ap-composer-collapsed='1'] [data-composer-seat] [class*='scroll'] { max-height: 168px !important; }
    `

    function installStyles() {
      const tags = []
      for (const [id, text] of [
        ['dsh-appearance/base', CSS],
        ['dsh-appearance/glass', GLASS_CSS],
      ]) {
        const selector = `style[data-plugin-css="${id}"]`
        if (document.querySelector(selector)) continue
        const tag = document.createElement('style')
        tag.dataset.plugin = 'dsh-appearance'
        tag.dataset.pluginCss = id
        tag.textContent = text
        document.head.appendChild(tag)
        tags.push(tag)
      }
      return () => {
        for (const tag of tags) {
          try {
            tag.remove()
          } catch {
            /* ignore */
          }
        }
      }
    }

    /* ------------------------------------------------------------------ */
    /* sync                                                                */
    /* ------------------------------------------------------------------ */

    function startSync() {
      loadState(true)
      try {
        eventSource = new EventSource(`${API}/events`)
        eventSource.addEventListener('state', (event) => {
          try {
            const next = JSON.parse(event.data)
            applyServerState(next, { silent: true })
          } catch {
            /* ignore */
          }
        })
        eventSource.onopen = () => {
          loadState(true)
        }
        eventSource.onerror = () => {
          store.set({ error: store.get().error || 'events disconnected' })
        }
      } catch {
        eventSource = null
      }

      pollTimer = setInterval(() => {
        if (document.visibilityState === 'visible') loadState(false)
      }, 60000)
      if (pollTimer && typeof pollTimer.unref === 'function') pollTimer.unref()

      const onVisible = () => {
        if (document.visibilityState === 'visible') loadState(true)
      }
      const onResize = () => queueVisuals()
      document.addEventListener('visibilitychange', onVisible)
      window.addEventListener('resize', onResize)

      let mutationQueued = false
      const observer = new MutationObserver(() => {
        if (mutationQueued) return
        mutationQueued = true
        setTimeout(() => {
          mutationQueued = false
          tagColumns()
        }, 120)
      })
      observer.observe(document.documentElement, { childList: true, subtree: true })

      const onThemeChange = () => {
        if (themeApplying) return
        // The host emits theme/change before it commits the new token set.
        // Applying overrideTokens during that window bakes the OLD scheme's
        // light/dark pair into the new theme (accent appears inverted until a
        // manual reload). Switch the scheme + CSS vars immediately, but defer
        // the token override until the host has settled on the next frames.
        applyScheme()
        applyCssVars()
        applyBackground()
        const settle = () => {
          if (themeApplying) return
          applyScheme()
          applyCssVars()
          applyThemeTokens()
          applyBackground()
        }
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => requestAnimationFrame(settle))
        } else {
          setTimeout(settle, 32)
        }
        setTimeout(settle, 180)
        setTimeout(settle, 600)
      }
      const offTheme = pluginCtx && pluginCtx.on ? pluginCtx.on('theme/change', onThemeChange) : null

      return () => {
        if (eventSource) {
          try {
            eventSource.close()
          } catch {
            /* ignore */
          }
          eventSource = null
        }
        if (pollTimer) clearInterval(pollTimer)
        pollTimer = null
        document.removeEventListener('visibilitychange', onVisible)
        window.removeEventListener('resize', onResize)
        observer.disconnect()
        if (typeof offTheme === 'function') offTheme()
      }
    }

    /* ------------------------------------------------------------------ */
    /* UI: settings                                                        */
    /* ------------------------------------------------------------------ */

    function Segmented(props) {
      return h(
        'div',
        { className: 'dsap-seg', role: 'group' },
        props.options.map((option) =>
          h(
            'button',
            {
              key: option.value,
              type: 'button',
              'data-active': props.value === option.value ? '1' : '0',
              onClick: () => props.onChange(option.value),
            },
            option.label,
          ),
        ),
      )
    }

    function Toggle(props) {
      return h(
        'label',
        { className: 'dsap-toggle' },
        h('input', { type: 'checkbox', checked: props.checked, onChange: (e) => props.onChange(e.target.checked) }),
        props.label,
      )
    }

    function noteText(note) {
      if (!note) return null
      if (note.indexOf('autoPicked:') === 0) {
        return { kind: 'ok', text: t('autoPicked', { count: note.split(':')[1] }) }
      }
      if (note === 'saved') return { kind: 'ok', text: t('saved') }
      if (note === 'saveFailed') return { kind: 'error', text: t('saveFailed') }
      if (note === 'resetDone') return { kind: 'ok', text: t('resetDone') }
      return null
    }

    function BackgroundCard(props) {
      const snap = useStore()
      const profile = profileOf(snap.config, snap.editScheme)
      const savedImage = snap.images[snap.editScheme] || null
      const stagedHere = snap.stagedImage && snap.stagedImage.mode === snap.editScheme ? snap.stagedImage : null
      const preview = stagedHere
        ? {
            url: stagedHere.url,
            w: stagedHere.w,
            h: stagedHere.h,
            kind: stagedHere.kind || (String(stagedHere.type || '').indexOf('video/') === 0 ? 'video' : 'image'),
          }
        : savedImage && !snap.stagedRemove
          ? {
              url: `${API}/background?mode=${encodeURIComponent(snap.editScheme)}&v=${encodeURIComponent(savedImage.version)}`,
              w: savedImage.width || (appliedInfo.version === savedImage.version ? appliedInfo.w : 0),
              h: savedImage.height || (appliedInfo.version === savedImage.version ? appliedInfo.h : 0),
              kind: savedImage.kind || (String(savedImage.mime || '').indexOf('video/') === 0 ? 'video' : 'image'),
            }
          : null
      const hasImage = Boolean(preview && preview.url)
      const [busy, setBusy] = useState(false)
      const [error, setError] = useState(null)
      const stageRef = useRef(null)
      const dragRef = useRef(null)
      const fileRef = useRef(null)

      const [tick, setTick] = useState(0)

      useEffect(() => {
        const bump = () => setTick((n) => n + 1)
        bump()
        window.addEventListener('resize', bump)
        dimsListeners.add(bump)
        return () => {
          window.removeEventListener('resize', bump)
          dimsListeners.delete(bump)
        }
      }, [])

      useEffect(() => {
        setTick((n) => n + 1)
      }, [snap.images, snap.stagedImage && snap.stagedImage.url, snap.stagedRemove, snap.editScheme])

      useEffect(() => {
        const el = stageRef.current
        if (!el) return
        const handler = (event) => {
          const state = store.get()
          const active = Boolean(state.stagedImage) || Boolean(state.images[state.editScheme] && !state.stagedRemove)
          if (!active) return
          event.preventDefault()
          const delta = event.deltaY > 0 ? -0.08 : 0.08
          const bg = profileOf(state.config, state.editScheme).background
          updateBackground({ zoom: Number(clamp(bg.zoom + delta, 1, 4, bg.zoom).toFixed(3)) })
        }
        el.addEventListener('wheel', handler, { passive: false })
        return () => el.removeEventListener('wheel', handler)
      }, [])

      const stageGeometry = useMemo(() => {
        if (!hasImage) return null
        const zoom = profile.background.zoom
        const rect = stageRef.current ? stageRef.current.getBoundingClientRect() : null
        const boxW = rect && rect.width ? rect.width : 480
        const boxH = rect && rect.height ? rect.height : 270
        const iw = preview.w || boxW
        const ih = preview.h || boxH
        const base = profile.background.fit === 'contain' ? Math.min(boxW / iw, boxH / ih) : Math.max(boxW / iw, boxH / ih)
        const w = Math.max(1, iw * base * zoom)
        const hh = Math.max(1, ih * base * zoom)
        return { boxW, boxH, w, hh, x: -(w - boxW) * profile.background.posX, y: -(hh - boxH) * profile.background.posY }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [snap.images, snap.stagedImage, snap.stagedRemove, snap.config, snap.editScheme, tick])

      const mediaStyle = stageGeometry
        ? {
            width: `${stageGeometry.w}px`,
            height: `${stageGeometry.hh}px`,
            left: `${stageGeometry.x}px`,
            top: `${stageGeometry.y}px`,
            opacity: String(profile.background.opacity / 100),
          }
        : {}

      const frameStyle = stageGeometry
        ? {
            backgroundImage: `url("${preview.url}")`,
            backgroundSize: `${stageGeometry.w}px ${stageGeometry.hh}px`,
            backgroundPosition: `${stageGeometry.x}px ${stageGeometry.y}px`,
            opacity: String(profile.background.opacity / 100),
          }
        : {}

      function updateBackground(patch) {
        const current = store.get().config
        setConfig(
          Object.assign({}, current, {
            profiles: Object.assign({}, current.profiles, {
              [store.get().editScheme]: Object.assign({}, current.profiles[store.get().editScheme], {
                background: Object.assign({}, current.profiles[store.get().editScheme].background, patch),
              }),
            }),
          }),
        )
      }

      function onPick(file) {
        if (!file) return
        setBusy(true)
        setError(null)
        stageImage(file)
          .catch((err) => setError(String((err && err.message) || err)))
          .finally(() => setBusy(false))
      }

      function beginDrag(clientX, clientY) {
        if (!hasImage) return false
        const stage = stageRef.current
        const rect = stage ? stage.getBoundingClientRect() : null
        if (!rect || !rect.width || !rect.height) return false
        const startState = store.get()
        const scheme = startState.editScheme
        const bg0 = profileOf(startState.config, scheme).background
        const drag = {
          x: clientX,
          y: clientY,
          posX: bg0.posX,
          posY: bg0.posY,
          rect,
          imgW: preview.w || rect.width,
          imgH: preview.h || rect.height,
          scheme,
        }
        dragRef.current = drag
        const move = (ev) => {
          if (!dragRef.current) return
          const st = store.get()
          const bgNow = profileOf(st.config, scheme).background
          const base =
            bgNow.fit === 'contain'
              ? Math.min(drag.rect.width / drag.imgW, drag.rect.height / drag.imgH)
              : Math.max(drag.rect.width / drag.imgW, drag.rect.height / drag.imgH)
          const renderedW = drag.imgW * base * bgNow.zoom
          const renderedH = drag.imgH * base * bgNow.zoom
          const spanX = renderedW - drag.rect.width
          const spanY = renderedH - drag.rect.height
          const dx = ev.clientX - drag.x
          const dy = ev.clientY - drag.y
          const nextX = spanX > 1 ? drag.posX - dx / spanX : bgNow.posX
          const nextY = spanY > 1 ? drag.posY - dy / spanY : bgNow.posY
          updateBackground({
            posX: Number(clamp(nextX, 0, 1, drag.posX).toFixed(4)),
            posY: Number(clamp(nextY, 0, 1, drag.posY).toFixed(4)),
          })
        }
        const up = () => {
          dragRef.current = null
          window.removeEventListener('pointermove', move)
          window.removeEventListener('mousemove', move)
          window.removeEventListener('pointerup', up)
          window.removeEventListener('mouseup', up)
          window.removeEventListener('pointercancel', up)
          window.removeEventListener('blur', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('mousemove', move)
        window.addEventListener('pointerup', up)
        window.addEventListener('mouseup', up)
        window.addEventListener('pointercancel', up)
        window.addEventListener('blur', up)
        return true
      }

      function onPointerDown(event) {
        if (beginDrag(event.clientX, event.clientY)) event.preventDefault()
      }

      function onMouseDownFallback(event) {
        if (dragRef.current) return
        if (beginDrag(event.clientX, event.clientY)) event.preventDefault()
      }

      function onDrop(event) {
        event.preventDefault()
        const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]
        if (file) onPick(file)
      }

      return h(
        'section',
        { className: 'dsap-card' },
        h(
          'div',
          { className: 'dsap-card-head' },
          h('h3', { className: 'dsap-card-title' }, t('background')),
          h(
            'div',
            { className: 'dsap-row' },
            hasImage
              ? h(
                  'button',
                  { type: 'button', className: 'dsap-btn', onClick: () => fileRef.current && fileRef.current.click() },
                  t('replace'),
                )
              : null,
            hasImage
              ? h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsap-btn',
                    onClick: () => {
                      removeImage()
                    },
                  },
                  t('remove'),
                )
              : h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsap-btn',
                    'data-primary': '1',
                    onClick: () => fileRef.current && fileRef.current.click(),
                  },
                  t('upload'),
                ),
          ),
        ),
        h(
          'div',
          {
            ref: stageRef,
            className: 'dsap-stage',
            'data-empty': hasImage ? '0' : '1',
            'data-hint': t('dragHint'),
            style: Object.assign(
              { '--dsap-stage-ratio': typeof window !== 'undefined' ? `${window.innerWidth} / ${Math.max(1, window.innerHeight)}` : '16 / 9' },
              hasImage ? { backgroundColor: themeBaseColor() } : null,
            ),
            onPointerDown,
            onMouseDown: onMouseDownFallback,
            onDragOver: (event) => event.preventDefault(),
            onDrop,
            onPaste: (event) => {
              const items = event.clipboardData && event.clipboardData.files
              if (items && items[0]) onPick(items[0])
            },
            tabIndex: 0,
          },
          hasImage
            ? preview.kind === 'video'
              ? h('video', {
                  key: preview.url,
                  src: preview.url,
                  className: 'dsap-stage-media',
                  style: mediaStyle,
                  draggable: false,
                  muted: true,
                  loop: true,
                  autoPlay: true,
                  playsInline: true,
                })
              : h('div', { key: preview.url, className: 'dsap-stage-frame', style: frameStyle })
            : h('div', { className: 'dsap-empty' }, t('noImage'), h('div', { className: 'dsap-hint' }, t('noImageHint'))),
        ),
        h(
          'input',
          {
            ref: fileRef,
            type: 'file',
            accept: 'image/*,video/mp4,video/webm,video/ogg',
            style: { display: 'none' },
            onChange: (event) => {
              const file = event.target.files && event.target.files[0]
              event.target.value = ''
              onPick(file)
            },
          },
        ),
        h(
          'div',
          { className: 'dsap-row', style: { marginTop: '10px' } },
          h('span', { className: 'dsap-label' }, t('zoom')),
          h('input', {
            type: 'range',
            className: 'dsap-range',
            min: 1,
            max: 4,
            step: 0.01,
            value: profile.background.zoom,
            disabled: !hasImage,
            onChange: (event) => updateBackground({ zoom: Number(event.target.value) }),
          }),
          h('span', { className: 'dsap-value' }, `${Number(profile.background.zoom).toFixed(2)}×`),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h('span', { className: 'dsap-label' }, t('bgOpacity')),
          h('input', {
            type: 'range',
            className: 'dsap-range',
            min: 0,
            max: 100,
            step: 1,
            value: profile.background.opacity,
            disabled: !hasImage,
            onChange: (event) => updateBackground({ opacity: Number(event.target.value) }),
          }),
          h('span', { className: 'dsap-value' }, String(profile.background.opacity) + '%'),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h('span', { className: 'dsap-label' }, t('bgBlur')),
          h('input', {
            type: 'range',
            className: 'dsap-range',
            min: 0,
            max: 32,
            step: 1,
            value: profile.background.blur,
            disabled: !hasImage,
            onChange: (event) => updateBackground({ blur: Number(event.target.value) }),
          }),
          h('span', { className: 'dsap-value' }, `${Number(profile.background.blur) || 0}px`),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h(Segmented, {
            value: profile.background.blurType,
            onChange: (value) => updateBackground({ blurType: value }),
            options: [
              { value: 'gaussian', label: t('bgBlurGaussian') },
              { value: 'linear', label: t('bgBlurLinear') },
            ],
          }),
          h('span', { className: 'dsap-hint', style: { flex: '1' } }, t('bgBlurHint')),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h(
            'div',
            { className: 'dsap-seg' },
            h(
              'button',
              {
                type: 'button',
                'data-active': profile.background.fit === 'cover' ? '1' : '0',
                onClick: () => updateBackground({ fit: 'cover' }),
              },
              t('fitCover'),
            ),
            h(
              'button',
              {
                type: 'button',
                'data-active': profile.background.fit === 'contain' ? '1' : '0',
                onClick: () => updateBackground({ fit: 'contain' }),
              },
              t('fitContain'),
            ),
          ),
          busy ? h('span', { className: 'dsap-chip' }, t('loading')) : null,
          error ? h('span', { className: 'dsap-note', 'data-kind': 'error' }, `${t('uploadFailed')}: ${error}`) : null,
        ),
        h('p', { className: 'dsap-hint' }, t('backgroundHint')),
      )
    }

    function GlassCard() {
      const snap = useStore()
      const glass = profileOf(snap.config, snap.editScheme).glass

      function update(patch) {
        const current = store.get().config
        const scheme = store.get().editScheme
        setConfig(
          Object.assign({}, current, {
            profiles: Object.assign({}, current.profiles, {
              [scheme]: Object.assign({}, current.profiles[scheme], {
                glass: Object.assign({}, current.profiles[scheme].glass, patch),
              }),
            }),
          }),
        )
      }

      function updateRegion(key, value) {
        update({ regions: Object.assign({}, glass.regions, { [key]: value }) })
      }

      return h(
        'section',
        { className: 'dsap-card' },
        h('div', { className: 'dsap-card-head' }, h('h3', { className: 'dsap-card-title' }, t('glass'))),
        h(
          'div',
          { className: 'dsap-row' },
          h(
            'div',
            { className: 'dsap-seg' },
            [
              ['none', t('glassNone')],
              ['translucent', t('glassTranslucent')],
              ['frosted', t('glassFrosted')],
              ['liquid', t('glassLiquid')],
            ].map(([value, label]) =>
              h(
                'button',
                {
                  key: value,
                  type: 'button',
                  'data-active': glass.mode === value ? '1' : '0',
                  onClick: () => update({ mode: value }),
                },
                label,
              ),
            ),
          ),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h('span', { className: 'dsap-label' }, t('strength')),
          h('input', {
            type: 'range',
            className: 'dsap-range',
            min: 0,
            max: 100,
            step: 1,
            value: glass.strength,
            onChange: (event) => update({ strength: Number(event.target.value) }),
          }),
          h('span', { className: 'dsap-value' }, `${glass.strength}%`),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h('span', { className: 'dsap-label' }, t('radius')),
          h('input', {
            type: 'range',
            className: 'dsap-range',
            min: 0,
            max: 28,
            step: 1,
            value: glass.radius,
            onChange: (event) => update({ radius: Number(event.target.value) }),
          }),
          h('span', { className: 'dsap-value' }, `${glass.radius}px`),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h(Toggle, {
            checked: glass.answer !== false,
            onChange: (value) => update({ answer: value }),
            label: t('answerRegion'),
          }),
        ),
        h('div', { className: 'dsap-hint' }, t('regions')),
        h(
          'div',
          { className: 'dsap-row' },
          h(Toggle, {
            checked: glass.regions.conversation,
            onChange: (v) => updateRegion('conversation', v),
            label: t('regionConversation'),
          }),
          h(Toggle, {
            checked: glass.regions.sidebar,
            onChange: (v) => updateRegion('sidebar', v),
            label: t('regionSidebar'),
          }),
          h(Toggle, {
            checked: glass.regions.panels,
            onChange: (v) => updateRegion('panels', v),
            label: t('regionPanels'),
          }),
          h(Toggle, {
            checked: glass.regions.dialogs,
            onChange: (v) => updateRegion('dialogs', v),
            label: t('regionDialogs'),
          }),
        ),
        h('p', { className: 'dsap-hint' }, t('glassHint')),
      )
    }

    function ThemeCard(props) {
      const snap = useStore()
      const theme = profileOf(snap.config, snap.editScheme).theme
      const [hexDraft, setHexDraft] = useState(theme.color)
      const [rgb, setRgb] = useState(() => hexToRgb(theme.color))

      useEffect(() => {
        setHexDraft(theme.color)
        setRgb(hexToRgb(theme.color))
      }, [theme.color])

      function applyColor(hex, mode) {
        const current = store.get().config
        const scheme = store.get().editScheme
        const base = profileOf(current, scheme).theme
        setConfig(
          updateProfile(current, scheme, {
            theme: Object.assign({}, base, {
              color: isHex(hex) ? hex.toLowerCase() : base.color,
              mode: mode || 'custom',
            }),
          }),
        )
      }

      function updateRgb(channel, value) {
        const next = Object.assign({}, rgb, { [channel]: clamp(value, 0, 255, rgb[channel]) })
        setRgb(next)
        applyColor(rgbToHex(next.r, next.g, next.b), 'custom')
      }

      const palette = theme.palette.length ? theme.palette : []

      return h(
        'section',
        { className: 'dsap-card' },
        h(
          'div',
          { className: 'dsap-card-head' },
          h('h3', { className: 'dsap-card-title' }, t('theme')),
          h(
            'button',
            {
              type: 'button',
              className: 'dsap-btn',
              disabled: !snap.images[snap.editScheme],
              onClick: async () => {
                const source = snap.images[snap.editScheme]
                if (!source) return
                try {
                  const res = await fetch(`${API}/background?mode=${encodeURIComponent(snap.editScheme)}&v=${encodeURIComponent(source.version)}`, {
                    credentials: 'same-origin',
                  })
                  const blob = await res.blob()
                  const picked = await extractPalette(blob)
                  if (picked.length) {
                    const current = store.get().config
                    const scheme = store.get().editScheme
                    const base = profileOf(current, scheme).theme
                    setConfig(
                      updateProfile(current, scheme, {
                        theme: Object.assign({}, base, {
                          palette: picked,
                          color: base.mode === 'custom' ? base.color : picked[0],
                          mode: base.mode === 'custom' ? 'custom' : 'auto',
                        }),
                      }),
                    )
                    store.set({ note: `autoPicked:${picked.length}` })
                  }
                } catch {
                  /* ignore */
                }
              },
            },
            t('recolor'),
          ),
        ),
        palette.length
          ? h(
              'div',
              { className: 'dsap-row' },
              h(
                'div',
                { className: 'dsap-swatches' },
                palette.map((hex) =>
                  h('button', {
                    key: hex,
                    type: 'button',
                    className: 'dsap-swatch',
                    'data-active': theme.color.toLowerCase() === hex ? '1' : '0',
                    style: { background: hex },
                    title: hex,
                    onClick: () => applyColor(hex, 'auto'),
                  }),
                ),
              ),
              h('span', { className: 'dsap-chip' }, t('autoPalette')),
            )
          : h('p', { className: 'dsap-hint' }, t('noImageHint')),
        h(
          'div',
          { className: 'dsap-row' },
          h('span', { className: 'dsap-label' }, t('picker')),
          h('input', {
            type: 'color',
            className: 'dsap-color',
            value: theme.color,
            onChange: (event) => applyColor(event.target.value, 'custom'),
          }),
          h('span', { className: 'dsap-label' }, t('hex')),
          h('input', {
            className: 'dsap-input',
            value: hexDraft,
            spellCheck: false,
            onChange: (event) => {
              setHexDraft(event.target.value)
              if (isHex(event.target.value)) applyColor(event.target.value, 'custom')
            },
          }),
        ),
        h(
          'div',
          { className: 'dsap-row' },
          h('span', { className: 'dsap-label' }, t('rgb')),
          h('input', {
            className: 'dsap-input',
            'data-size': 'sm',
            type: 'number',
            min: 0,
            max: 255,
            value: Math.round(rgb.r),
            onChange: (event) => updateRgb('r', Number(event.target.value)),
          }),
          h('input', {
            className: 'dsap-input',
            'data-size': 'sm',
            type: 'number',
            min: 0,
            max: 255,
            value: Math.round(rgb.g),
            onChange: (event) => updateRgb('g', Number(event.target.value)),
          }),
          h('input', {
            className: 'dsap-input',
            'data-size': 'sm',
            type: 'number',
            min: 0,
            max: 255,
            value: Math.round(rgb.b),
            onChange: (event) => updateRgb('b', Number(event.target.value)),
          }),
          h(
            'button',
            {
              type: 'button',
              className: 'dsap-btn',
              onClick: () => {
                const current = store.get().config
                const scheme = store.get().editScheme
                const base = profileOf(current, scheme).theme
                setConfig(updateProfile(current, scheme, { theme: Object.assign({}, base, { mode: 'default' }) }))
              },
            },
            t('resetTheme'),
          ),
        ),
        h('p', { className: 'dsap-hint' }, t('themeHint')),
      )
    }

    function AboutCard() {
      const snap = useStore()
      const [confirming, setConfirming] = useState(false)
      return h(
        'section',
        { className: 'dsap-card' },
        h('div', { className: 'dsap-card-head' }, h('h3', { className: 'dsap-card-title' }, t('about'))),
        h('div', { className: 'dsap-row' }, h('span', { className: 'dsap-label' }, t('version')), h('span', null, '0.2.5')),
        h('p', { className: 'dsap-hint' }, t('resetHint')),
        h(
          'div',
          { className: 'dsap-row' },
          confirming
            ? h(
                React.Fragment,
                null,
                h('span', { className: 'dsap-label' }, t('resetHint')),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsap-btn',
                    'data-primary': '1',
                    onClick: () => {
                      setConfirming(false)
                      setConfig(normalizeConfig(DEFAULTS))
                      store.set({ note: 'resetDone' })
                    },
                  },
                  t('resetAll'),
                ),
                h('button', { type: 'button', className: 'dsap-btn', onClick: () => setConfirming(false) }, t('cancel')),
              )
            : h(
                'button',
                { type: 'button', className: 'dsap-btn', onClick: () => setConfirming(true) },
                t('resetAll'),
              ),
        ),
        snap.error ? h('p', { className: 'dsap-note', 'data-kind': 'error' }, t('offline')) : null,
      )
    }

    function SaveBar() {
      const snap = useStore()
      const showNote = snap.note === 'saved' || snap.note === 'saveFailed' || snap.note === 'resetDone'
      const note = showNote ? noteText(snap.note) : null
      const dirty = Boolean(snap.dirty)
      const saving = Boolean(snap.saving)
      const status = saving ? t('saving') : dirty ? t('unsaved') : t('allSaved')
      return h(
        'div',
        { className: 'dsap-savebar', 'data-dirty': dirty ? '1' : '0' },
        h('span', { className: 'dsap-save-state' }, status),
        note ? h('span', { className: 'dsap-note', 'data-kind': note.kind === 'error' ? 'error' : 'ok' }, note.text) : null,
        h('span', { className: 'dsap-save-hint' }, t('saveHint')),
        h(
          'button',
          {
            type: 'button',
            className: 'dsap-btn',
            disabled: !dirty || saving,
            onClick: () => discardChanges(),
          },
          t('discard'),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dsap-btn',
            'data-primary': '1',
            disabled: !dirty || saving,
            onClick: () => {
              saveConfig()
            },
          },
          saving ? t('saving') : t('save'),
        ),
      )
    }

    function SchemeSwitch() {
      const snap = useStore()
      return h(
        'div',
        { className: 'dsap-scheme-row' },
        h('span', { className: 'dsap-label' }, t('schemeHint')),
        h(
          'div',
          { className: 'dsap-seg' },
          [
            ['light', t('schemeLight')],
            ['dark', t('schemeDark')],
          ].map(([value, label]) =>
            h(
              'button',
              {
                key: value,
                type: 'button',
                'data-active': snap.editScheme === value ? '1' : '0',
                onClick: () => store.set({ editScheme: value }),
              },
              label,
            ),
          ),
        ),
      )
    }

    function UsageCard() {
      const snap = useStore()
      return h(
        'section',
        { className: 'dsap-card' },
        h('div', { className: 'dsap-card-head' }, h('h3', { className: 'dsap-card-title' }, t('showUsage'))),
        h('div', { className: 'dsap-row' }, h(Toggle, {
          checked: snap.config.ui.showUsage !== false,
          onChange: (value) => {
            const current = store.get().config
            setConfig(Object.assign({}, current, { ui: Object.assign({}, current.ui, { showUsage: value }) }))
          },
          label: t('showUsage'),
        })),
        h('p', { className: 'dsap-hint dsap-usage-note' }, t('usageDisclaimer')),
      )
    }

    function ImportExportCard() {
      const [busy, setBusy] = useState(false)
      const [status, setStatus] = useState(null)
      const fileRef = useRef(null)
      async function onFile(file) {
        if (!file) return
        setBusy(true)
        setStatus(null)
        try {
          const res = await fetch(`${API}/import.zip`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'content-type': 'application/zip' },
            body: file,
          })
          let body = null
          try {
            body = await res.json()
          } catch {
            /* ignore */
          }
          if (!res.ok) throw new Error((body && body.error) || `HTTP ${res.status}`)
          releaseStaged()
          store.set({ dirty: false, stagedImage: null, stagedRemove: false, stagedRemoveMode: null, error: null })
          await loadState(true)
          store.set({ note: null })
          setStatus(t('importDone'))
        } catch (err) {
          setStatus(`${t('importFailed')}: ${String((err && err.message) || err)}`)
        } finally {
          setBusy(false)
        }
      }
      return h(
        'section',
        {
          className: 'dsap-card dsap-dropzone',
          onDragOver: (event) => event.preventDefault(),
          onDrop: (event) => {
            event.preventDefault()
            const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]
            if (file) onFile(file)
          },
        },
        h('div', { className: 'dsap-card-head' }, h('h3', { className: 'dsap-card-title' }, t('importPack'))),
        h(
          'div',
          { className: 'dsap-row' },
          h(
            'a',
            { className: 'dsap-btn', href: `${API}/export.zip`, download: 'dsh-appearance-style.zip' },
            t('exportPack'),
          ),
          h(
            'button',
            { type: 'button', className: 'dsap-btn', disabled: busy, onClick: () => fileRef.current && fileRef.current.click() },
            busy ? t('loading') : t('importPack'),
          ),
          h('div', { className: 'dsap-drop-hint' }, t('dropHint')),
          h('input', {
            ref: fileRef,
            type: 'file',
            accept: '.zip,application/zip',
            style: { display: 'none' },
            onChange: (event) => {
              const file = event.target.files && event.target.files[0]
              onFile(file)
              event.target.value = ''
            },
          }),
        ),
        h('p', { className: 'dsap-hint' }, t('importHint')),
        status ? h('p', { className: 'dsap-note', 'data-kind': status.indexOf(t('importFailed')) === 0 ? 'error' : 'ok' }, status) : null,
      )
    }

    function AppearanceSettings() {
      const [tab, setTab] = useState('quick')
      return h(
        'div',
        { className: 'dsap-settings' },
        h(
          'div',
          { className: 'dsap-settings-head' },
          h('h2', { className: 'dsap-card-title', style: { margin: 0 } }, t('title')),
          h('p', { className: 'dsap-intro' }, t('intro')),
        ),
        h(
          'div',
          { className: 'dsap-sticky' },
          h(
            'div',
            { className: 'dsap-tabs' },
            [
              ['quick', t('tabQuick')],
              ['upload', t('tabUpload')],
            ].map(([value, label]) =>
              h(
                'button',
                { key: value, type: 'button', 'data-active': tab === value ? '1' : '0', onClick: () => setTab(value) },
                label,
              ),
            ),
          ),
          h(SaveBar),
        ),
        tab === 'quick'
          ? [h(SchemeSwitch), h(BackgroundCard), h(GlassCard), h(ThemeCard), h(UsageCard)]
          : [h(SchemeSwitch), h(ImportExportCard), h(BackgroundCard), h(AboutCard)],
      )
    }

    /* ------------------------------------------------------------------ */
    /* UI: sidebar footer                                                  */
    /* ------------------------------------------------------------------ */

    function formatBalance(balance) {
      if (!balance || !Array.isArray(balance.wallets) || !balance.wallets.length) return null
      const symbols = { CNY: '¥', USD: '$' }
      return balance.wallets
        .map((wallet) => {
          const symbol = symbols[wallet.currency] || `${wallet.currency} `
          return `${symbol}${wallet.balance}`
        })
        .join(' · ')
    }

    function formatCost(value) {
      const n = Number(value) || 0
      return n > 0 && n < 0.01 ? '<0.01' : n.toFixed(2)
    }

    function useSessionId() {
      const [id, setId] = useState(() => currentSessionId())
      useEffect(() => {
        const observer = new MutationObserver(() => {
          const next = currentSessionId()
          setId((prev) => (prev === next ? prev : next))
        })
        observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-conversation-session'] })
        return () => observer.disconnect()
      }, [])
      return id
    }

    function currentSessionId() {
      try {
        const node = document.querySelector('[data-conversation-session]')
        return node ? node.getAttribute('data-conversation-session') : null
      } catch {
        return null
      }
    }

    function formatTokens(n) {
      const value = Number(n) || 0
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
      if (value >= 1e4) return `${(value / 1e3).toFixed(1)}k`
      return String(Math.round(value))
    }

    function RestartDialog(props) {
      const content = h(
        'div',
        {
          className: 'dsap-modal',
          role: 'dialog',
          'aria-modal': 'true',
          onClick: (event) => {
            if (event.target === event.currentTarget) props.onClose()
          },
        },
        h(
          'div',
          { className: 'dsap-modal-card' },
          h('h3', { className: 'dsap-modal-title' }, t('restartTitle')),
          h('p', { className: 'dsap-modal-body' }, t('restartBody')),
          h(
            'div',
            { className: 'dsap-modal-actions' },
            h('button', { type: 'button', className: 'dsap-btn', onClick: props.onClose }, t('cancel')),
            h(
              'button',
              {
                type: 'button',
                className: 'dsap-btn',
                'data-primary': '1',
                onClick: () => {
                  props.onClose()
                  window.location.reload()
                },
              },
              t('reloadNow'),
            ),
          ),
        ),
      )
      if (ReactDOM && typeof ReactDOM.createPortal === 'function') {
        return ReactDOM.createPortal(content, document.body)
      }
      return content
    }

    function SectionIcon() {
      return h(
        'svg',
        {
          width: 16,
          height: 16,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3 }),
        h('circle', { cx: 8.5, cy: 8.5, r: 1.6 }),
        h('path', { d: 'M21 15.5 16 10.5 6 21' }),
      )
    }

    function ComposerToggle() {
      const [collapsed, setCollapsed] = useState(false)
      const [available, setAvailable] = useState(false)
      useEffect(() => {
        const check = () => {
          const seat = document.querySelector('[data-composer-seat]')
          if (!seat) {
            setAvailable(false)
            return
          }
          const rect = seat.getBoundingClientRect()
          setAvailable(rect.height > window.innerHeight * 0.45)
        }
        check()
        const timer = setInterval(check, 1000)
        return () => clearInterval(timer)
      }, [])
      useEffect(() => {
        if (collapsed) document.documentElement.setAttribute('data-dsh-ap-composer-collapsed', '1')
        else document.documentElement.removeAttribute('data-dsh-ap-composer-collapsed')
        // Inline !important beats the host's own variable/rule even if its
        // ordering changes between releases.
        const seat = document.querySelector('[data-composer-seat]')
        const scroll = seat && seat.querySelector("[class*='scroll']")
        if (seat) {
          if (collapsed) seat.style.setProperty('--dsh-composer-text-max-height', '168px', 'important')
          else seat.style.removeProperty('--dsh-composer-text-max-height')
        }
        if (scroll) {
          if (collapsed) scroll.style.setProperty('max-height', '168px', 'important')
          else scroll.style.removeProperty('max-height')
        }
        return () => {
          document.documentElement.removeAttribute('data-dsh-ap-composer-collapsed')
          if (seat) seat.style.removeProperty('--dsh-composer-text-max-height')
          if (scroll) scroll.style.removeProperty('max-height')
        }
      }, [collapsed])
      if (!available && !collapsed) return null
      return h(
        'button',
        {
          type: 'button',
          className: 'dsap-composer-toggle',
          title: collapsed ? t('composerExpand') : t('composerCollapse'),
          onClick: () => setCollapsed((value) => !value),
        },
        h(
          'svg',
          { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
          collapsed ? h('path', { d: 'M18 15l-6-6-6 6' }) : h('path', { d: 'M6 9l6 6 6-6' }),
        ),
      )
    }

    function BalanceWidget(props) {
      const snap = useStore()
      const sessionId = useSessionId()
      const [dialog, setDialog] = useState(false)
      const wide = props && props.wide !== false
      const showUsage = snap.config.ui.showUsage !== false
      const usage = snap.usage || { total: 0, sessions: {}, cost: 0, sessionCost: {} }
      const sessionTokens = sessionId ? Number(usage.sessions[sessionId] || 0) : 0
      const tokenText =
        `${t('today')} ${formatTokens(usage.total)} tok` + (sessionId ? t('sessionPart', { tokens: formatTokens(sessionTokens) }) : '')
      const balanceText = formatBalance(snap.balance)
      const balanceTitle = snap.balanceError || t('balance')
      const dayCost = Number(usage.cost) || 0
      const sessionCost = sessionId ? Number((usage.sessionCost || {})[sessionId] || 0) : null
      const costText = sessionId
        ? t('costPart', { day: formatCost(dayCost), session: formatCost(sessionCost) })
        : t('costPartSolo', { day: formatCost(dayCost) })
      const balanceLine = showUsage ? `${balanceText || t('balanceUnknown')}${costText}` : balanceText || t('balanceUnknown')

      function doRefresh() {
        refreshBalance()
      }

      const buttons = h(
        'div',
        { className: 'dsap-foot-actions' },
        h(
          'button',
          {
            type: 'button',
            className: 'dsap-icon',
            title: t('reloadPage'),
            'aria-label': t('reloadPage'),
            onClick: () => window.location.reload(),
          },
          h(
            'svg',
            { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
            h('path', { d: 'M21 12a9 9 0 1 1-2.64-6.36' }),
            h('path', { d: 'M21 3v6h-6' }),
          ),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dsap-icon',
            title: t('restart'),
            'aria-label': t('restart'),
            onClick: () => setDialog(true),
          },
          h(
            'svg',
            { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
            h('path', { d: 'M18.36 6.64a9 9 0 1 1-12.73 0' }),
            h('path', { d: 'M12 2v10' }),
          ),
        ),
      )

      if (!wide) {
        return h(
          'div',
          { className: 'dsap-foot', 'data-narrow': '1', title: showUsage ? `${tokenText}\n${balanceLine}` : balanceLine },
          h('div', { className: 'dsap-foot-actions' }, buttons),
          dialog ? h(RestartDialog, { onClose: () => setDialog(false) }) : null,
        )
      }

      // With the tokens/cost readout switched off the widget collapses to the
      // two action buttons and only those buttons keep a glass surface.
      return h(
        'div',
        { className: 'dsap-foot', 'data-mini': showUsage ? '0' : '1' },
        showUsage
          ? [
              h('div', { className: 'dsap-foot-meta', title: tokenText }, tokenText),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsap-foot-balance',
                  title: balanceTitle,
                  onClick: doRefresh,
                  style: { border: 0, background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer', color: 'inherit', font: 'inherit' },
                },
                balanceLine,
              ),
              buttons,
            ]
          : h('div', { className: 'dsap-foot-actions', 'data-glass': '1' }, buttons),
        dialog ? h(RestartDialog, { onClose: () => setDialog(false) }) : null,
      )
    }

    /* ------------------------------------------------------------------ */
    /* apply                                                               */
    /* ------------------------------------------------------------------ */

    function apply(ctx) {
      pluginCtx = ctx

      ctx.effect(() => ctx.locale.register(NS, { zh: ZN, en: EN }), 'dsh-appearance: dictionaries')
      try {
        PLUGIN_TRANSLATOR = ctx.locale.bind(NS)
      } catch {
        PLUGIN_TRANSLATOR = null
      }

      ctx.effect(() => installStyles(), 'dsh-appearance: styles')
      ctx.effect(() => startSync(), 'dsh-appearance: sync')
      ctx.effect(() => {
        queueVisuals()
        return () => {
          if (themeDisposer) {
            try {
              themeDisposer()
            } catch {
              /* ignore */
            }
            themeDisposer = null
          }
          for (const dispose of disposers.splice(0)) {
            try {
              dispose()
            } catch {
              /* ignore */
            }
          }
        }
      }, 'dsh-appearance: visuals')

      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          {
            name: 'settings.section',
            id: 'appearance',
            order: 5,
            label: () => t('nav'),
            locale: NS,
            inject: () => ({ t }),
          },
          AppearanceSettings,
        ),
      )

      try {
        ctx.slots.inject('settings.section.icon', () =>
          ctx.slots.register({ name: 'settings.section.icon', id: 'appearance', locale: NS }, SectionIcon),
        )
      } catch {
        /* older hosts fall back to the built-in nav icon */
      }

      try {
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register({ name: 'shell.overlay', id: 'dsh-appearance-composer', order: 0, locale: NS, inject: () => ({ t }) }, ComposerToggle),
        )
      } catch {
        /* overlay slot unavailable */
      }

      ctx.slots.inject('sidebar.footer.action', () =>
        ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'dsh-appearance-balance',
            order: -10,
            locale: NS,
            inject: () => ({ t }),
          },
          BalanceWidget,
        ),
      )
    }

    module.exports = { apply, inject: ['slots', 'locale', 'theme'] }
    return module.exports
  },
})
