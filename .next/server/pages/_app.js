/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/SettingsContext.tsx":
/*!**************************************!*\
  !*** ./contexts/SettingsContext.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SettingsProvider: () => (/* binding */ SettingsProvider),\n/* harmony export */   useSettings: () => (/* binding */ useSettings)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst defaultSettings = {\n    aiUrl: \"http://localhost:1234\",\n    searxUrl: \"http://localhost:8080\",\n    selectedModel: \"qwen/qwen3-30b-a3b-2507\",\n    temperature: 0.7,\n    maxTokens: -1,\n    timeout: 60000,\n    systemPromptPrefix: \"\"\n};\nconst SettingsContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nconst useSettings = ()=>{\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(SettingsContext);\n    if (context === undefined) {\n        throw new Error(\"useSettings must be used within a SettingsProvider\");\n    }\n    return context;\n};\nconst SettingsProvider = ({ children })=>{\n    const [settings, setSettings] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(defaultSettings);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    // Load settings from localStorage on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        try {\n            const savedSettings = localStorage.getItem(\"deepsearch-settings\");\n            if (savedSettings) {\n                const parsed = JSON.parse(savedSettings);\n                setSettings({\n                    ...defaultSettings,\n                    ...parsed\n                });\n            }\n        } catch (error) {\n            console.error(\"Failed to load settings from localStorage:\", error);\n        } finally{\n            setIsLoading(false);\n        }\n    }, []);\n    // Save settings to localStorage whenever they change\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (!isLoading) {\n            try {\n                localStorage.setItem(\"deepsearch-settings\", JSON.stringify(settings));\n            } catch (error) {\n                console.error(\"Failed to save settings to localStorage:\", error);\n            }\n        }\n    }, [\n        settings,\n        isLoading\n    ]);\n    const updateSettings = (newSettings)=>{\n        setSettings((prev)=>({\n                ...prev,\n                ...newSettings\n            }));\n    };\n    const resetSettings = ()=>{\n        setSettings(defaultSettings);\n        localStorage.removeItem(\"deepsearch-settings\");\n    };\n    const value = {\n        settings,\n        updateSettings,\n        resetSettings,\n        isLoading\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SettingsContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"/Users/ahmad/fun_projects/searcher/contexts/SettingsContext.tsx\",\n        lineNumber: 91,\n        columnNumber: 5\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9TZXR0aW5nc0NvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBeUY7QUFtQnpGLE1BQU1LLGtCQUE4QjtJQUNsQ0MsT0FBTztJQUNQQyxVQUFVO0lBQ1ZDLGVBQWU7SUFDZkMsYUFBYTtJQUNiQyxXQUFXLENBQUM7SUFDWkMsU0FBUztJQUNUQyxvQkFBb0I7QUFDdEI7QUFFQSxNQUFNQyxnQ0FBa0JaLG9EQUFhQSxDQUFrQ2E7QUFFaEUsTUFBTUMsY0FBYztJQUN6QixNQUFNQyxVQUFVZCxpREFBVUEsQ0FBQ1c7SUFDM0IsSUFBSUcsWUFBWUYsV0FBVztRQUN6QixNQUFNLElBQUlHLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNULEVBQUU7QUFNSyxNQUFNRSxtQkFBb0QsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDNUUsTUFBTSxDQUFDQyxVQUFVQyxZQUFZLEdBQUdsQiwrQ0FBUUEsQ0FBYUU7SUFDckQsTUFBTSxDQUFDaUIsV0FBV0MsYUFBYSxHQUFHcEIsK0NBQVFBLENBQUM7SUFFM0MsMkNBQTJDO0lBQzNDQyxnREFBU0EsQ0FBQztRQUNSLElBQUk7WUFDRixNQUFNb0IsZ0JBQWdCQyxhQUFhQyxPQUFPLENBQUM7WUFDM0MsSUFBSUYsZUFBZTtnQkFDakIsTUFBTUcsU0FBU0MsS0FBS0MsS0FBSyxDQUFDTDtnQkFDMUJILFlBQVk7b0JBQUUsR0FBR2hCLGVBQWU7b0JBQUUsR0FBR3NCLE1BQU07Z0JBQUM7WUFDOUM7UUFDRixFQUFFLE9BQU9HLE9BQU87WUFDZEMsUUFBUUQsS0FBSyxDQUFDLDhDQUE4Q0E7UUFDOUQsU0FBVTtZQUNSUCxhQUFhO1FBQ2Y7SUFDRixHQUFHLEVBQUU7SUFFTCxxREFBcUQ7SUFDckRuQixnREFBU0EsQ0FBQztRQUNSLElBQUksQ0FBQ2tCLFdBQVc7WUFDZCxJQUFJO2dCQUNGRyxhQUFhTyxPQUFPLENBQUMsdUJBQXVCSixLQUFLSyxTQUFTLENBQUNiO1lBQzdELEVBQUUsT0FBT1UsT0FBTztnQkFDZEMsUUFBUUQsS0FBSyxDQUFDLDRDQUE0Q0E7WUFDNUQ7UUFDRjtJQUNGLEdBQUc7UUFBQ1Y7UUFBVUU7S0FBVTtJQUV4QixNQUFNWSxpQkFBaUIsQ0FBQ0M7UUFDdEJkLFlBQVllLENBQUFBLE9BQVM7Z0JBQUUsR0FBR0EsSUFBSTtnQkFBRSxHQUFHRCxXQUFXO1lBQUM7SUFDakQ7SUFFQSxNQUFNRSxnQkFBZ0I7UUFDcEJoQixZQUFZaEI7UUFDWm9CLGFBQWFhLFVBQVUsQ0FBQztJQUMxQjtJQUVBLE1BQU1DLFFBQTZCO1FBQ2pDbkI7UUFDQWM7UUFDQUc7UUFDQWY7SUFDRjtJQUVBLHFCQUNFLDhEQUFDVCxnQkFBZ0IyQixRQUFRO1FBQUNELE9BQU9BO2tCQUM5QnBCOzs7Ozs7QUFHUCxFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGVlcHNlYXJjaC1uZXh0anMvLi9jb250ZXh0cy9TZXR0aW5nc0NvbnRleHQudHN4P2I2MmIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBBSVNldHRpbmdzIHtcbiAgYWlVcmw6IHN0cmluZztcbiAgc2VhcnhVcmw6IHN0cmluZztcbiAgc2VsZWN0ZWRNb2RlbDogc3RyaW5nO1xuICB0ZW1wZXJhdHVyZTogbnVtYmVyO1xuICBtYXhUb2tlbnM6IG51bWJlcjtcbiAgdGltZW91dDogbnVtYmVyO1xuICBzeXN0ZW1Qcm9tcHRQcmVmaXg6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5nc0NvbnRleHRUeXBlIHtcbiAgc2V0dGluZ3M6IEFJU2V0dGluZ3M7XG4gIHVwZGF0ZVNldHRpbmdzOiAobmV3U2V0dGluZ3M6IFBhcnRpYWw8QUlTZXR0aW5ncz4pID0+IHZvaWQ7XG4gIHJlc2V0U2V0dGluZ3M6ICgpID0+IHZvaWQ7XG4gIGlzTG9hZGluZzogYm9vbGVhbjtcbn1cblxuY29uc3QgZGVmYXVsdFNldHRpbmdzOiBBSVNldHRpbmdzID0ge1xuICBhaVVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MTIzNCcsXG4gIHNlYXJ4VXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgc2VsZWN0ZWRNb2RlbDogJ3F3ZW4vcXdlbjMtMzBiLWEzYi0yNTA3JyxcbiAgdGVtcGVyYXR1cmU6IDAuNyxcbiAgbWF4VG9rZW5zOiAtMSxcbiAgdGltZW91dDogNjAwMDAsXG4gIHN5c3RlbVByb21wdFByZWZpeDogJydcbn07XG5cbmNvbnN0IFNldHRpbmdzQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8U2V0dGluZ3NDb250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcblxuZXhwb3J0IGNvbnN0IHVzZVNldHRpbmdzID0gKCkgPT4ge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChTZXR0aW5nc0NvbnRleHQpO1xuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VTZXR0aW5ncyBtdXN0IGJlIHVzZWQgd2l0aGluIGEgU2V0dGluZ3NQcm92aWRlcicpO1xuICB9XG4gIHJldHVybiBjb250ZXh0O1xufTtcblxuaW50ZXJmYWNlIFNldHRpbmdzUHJvdmlkZXJQcm9wcyB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGU7XG59XG5cbmV4cG9ydCBjb25zdCBTZXR0aW5nc1Byb3ZpZGVyOiBSZWFjdC5GQzxTZXR0aW5nc1Byb3ZpZGVyUHJvcHM+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICBjb25zdCBbc2V0dGluZ3MsIHNldFNldHRpbmdzXSA9IHVzZVN0YXRlPEFJU2V0dGluZ3M+KGRlZmF1bHRTZXR0aW5ncyk7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICAvLyBMb2FkIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlIG9uIG1vdW50XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZGVlcHNlYXJjaC1zZXR0aW5ncycpO1xuICAgICAgaWYgKHNhdmVkU2V0dGluZ3MpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShzYXZlZFNldHRpbmdzKTtcbiAgICAgICAgc2V0U2V0dGluZ3MoeyAuLi5kZWZhdWx0U2V0dGluZ3MsIC4uLnBhcnNlZCB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2U6JywgZXJyb3IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIC8vIFNhdmUgc2V0dGluZ3MgdG8gbG9jYWxTdG9yYWdlIHdoZW5ldmVyIHRoZXkgY2hhbmdlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFpc0xvYWRpbmcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdkZWVwc2VhcmNoLXNldHRpbmdzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzYXZlIHNldHRpbmdzIHRvIGxvY2FsU3RvcmFnZTonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9LCBbc2V0dGluZ3MsIGlzTG9hZGluZ10pO1xuXG4gIGNvbnN0IHVwZGF0ZVNldHRpbmdzID0gKG5ld1NldHRpbmdzOiBQYXJ0aWFsPEFJU2V0dGluZ3M+KSA9PiB7XG4gICAgc2V0U2V0dGluZ3MocHJldiA9PiAoeyAuLi5wcmV2LCAuLi5uZXdTZXR0aW5ncyB9KSk7XG4gIH07XG5cbiAgY29uc3QgcmVzZXRTZXR0aW5ncyA9ICgpID0+IHtcbiAgICBzZXRTZXR0aW5ncyhkZWZhdWx0U2V0dGluZ3MpO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdkZWVwc2VhcmNoLXNldHRpbmdzJyk7XG4gIH07XG5cbiAgY29uc3QgdmFsdWU6IFNldHRpbmdzQ29udGV4dFR5cGUgPSB7XG4gICAgc2V0dGluZ3MsXG4gICAgdXBkYXRlU2V0dGluZ3MsXG4gICAgcmVzZXRTZXR0aW5ncyxcbiAgICBpc0xvYWRpbmdcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxTZXR0aW5nc0NvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1NldHRpbmdzQ29udGV4dC5Qcm92aWRlcj5cbiAgKTtcbn07Il0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsImRlZmF1bHRTZXR0aW5ncyIsImFpVXJsIiwic2VhcnhVcmwiLCJzZWxlY3RlZE1vZGVsIiwidGVtcGVyYXR1cmUiLCJtYXhUb2tlbnMiLCJ0aW1lb3V0Iiwic3lzdGVtUHJvbXB0UHJlZml4IiwiU2V0dGluZ3NDb250ZXh0IiwidW5kZWZpbmVkIiwidXNlU2V0dGluZ3MiLCJjb250ZXh0IiwiRXJyb3IiLCJTZXR0aW5nc1Byb3ZpZGVyIiwiY2hpbGRyZW4iLCJzZXR0aW5ncyIsInNldFNldHRpbmdzIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwic2F2ZWRTZXR0aW5ncyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJwYXJzZWQiLCJKU09OIiwicGFyc2UiLCJlcnJvciIsImNvbnNvbGUiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwidXBkYXRlU2V0dGluZ3MiLCJuZXdTZXR0aW5ncyIsInByZXYiLCJyZXNldFNldHRpbmdzIiwicmVtb3ZlSXRlbSIsInZhbHVlIiwiUHJvdmlkZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./contexts/SettingsContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_SettingsContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/SettingsContext */ \"./contexts/SettingsContext.tsx\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_SettingsContext__WEBPACK_IMPORTED_MODULE_2__.SettingsProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/ahmad/fun_projects/searcher/pages/_app.tsx\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/ahmad/fun_projects/searcher/pages/_app.tsx\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQzhCO0FBQ2dDO0FBRS9DLFNBQVNDLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNILHVFQUFnQkE7a0JBQ2YsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZWVwc2VhcmNoLW5leHRqcy8uL3BhZ2VzL19hcHAudHN4PzJmYmUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXG5pbXBvcnQgeyBTZXR0aW5nc1Byb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dHMvU2V0dGluZ3NDb250ZXh0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxTZXR0aW5nc1Byb3ZpZGVyPlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgIDwvU2V0dGluZ3NQcm92aWRlcj5cbiAgKVxufSJdLCJuYW1lcyI6WyJTZXR0aW5nc1Byb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();