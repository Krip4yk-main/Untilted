import typescriptEslint from "@typescript-eslint/eslint-plugin";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';


export default tseslint.config({
    files: ['**/*.ts'],
    ignores: ["**/environment.ts", "**/environment.prod.ts", "node_modules/**/*",],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },
    rules: {
        "array-callback-return": "error",
        "for-direction": "off",
        "no-constant-binary-expression": "error",

        "no-constant-condition": ["error", {
            checkLoops: false,
        }],

        "no-constructor-return": "error",
        "no-control-regex": "off",
        "no-duplicate-imports": "error",
        "no-promise-executor-return": "error",
        "no-template-curly-in-string": "warn",
        "no-unmodified-loop-condition": "error",
        "no-unreachable-loop": "error",
        "no-unused-private-class-members": "error",
        "no-use-before-define": "off",
        "require-atomic-updates": "error",
        "accessor-pairs": "error",
        "arrow-body-style": ["error", "as-needed"],
        "block-scoped-var": "error",
        "camelcase": "warn",
        "curly": "error",
        "default-case-last": "error",
        "default-param-last": ["error"],
        "eqeqeq": ["error", "always"],
        "grouped-accessor-pairs": "error",
        "max-classes-per-file": "warn",
        "no-alert": "warn",
        "no-confusing-arrow": "error",

        "no-console": ["error", {
            allow: ["warn", "error", "info"],
        }],

        "no-else-return": ["error", {
            allowElseIf: false,
        }],

        "no-empty": "error",

        "no-empty-function": ["error", {
            allow: ["constructors"],
        }],

        "no-extra-boolean-cast": "error",
        "no-extra-semi": "error",
        "no-floating-decimal": "error",
        "no-invalid-this": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-mixed-operators": "error",
        "no-multi-assign": "error",
        "no-multi-str": "error",
        "no-octal": "error",
        "no-return-assign": "error",
        "no-shadow": "off",
        "no-unneeded-ternary": "error",
        "no-var": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "array-bracket-spacing": ["error", "never"],
        "array-element-newline": ["error", "consistent"],
        "arrow-parens": ["error", "always"],

        "arrow-spacing": ["error", {
            before: true, after: true,
        }],

        "block-spacing": ["error", "always"],
        "brace-style": ["error", "1tbs"],
        "comma-dangle": ["error", "always-multiline"],

        "comma-spacing": ["error", {
            before: false, after: true,
        }],

        "comma-style": ["error", "last"],
        "computed-property-spacing": ["error", "never"],
        "dot-location": ["error", "property"],
        "eol-last": ["error", "always"],
        "func-call-spacing": ["error", "never"],
        "function-call-argument-newline": ["error", "consistent"],
        "function-paren-newline": ["error", "multiline"],
        "implicit-arrow-linebreak": ["error", "beside"],
        "indent": ["error", 4],
        "jsx-quotes": ["error", "prefer-double"],

        "key-spacing": ["error", {
            beforeColon: false, afterColon: true, mode: "strict",
        }],

        "keyword-spacing": ["error", {
            before: true, after: true,
        }],

        "line-comment-position": "off",

        "lines-around-comment": ["error", {
            beforeBlockComment: true,
            beforeLineComment: true,
            allowBlockStart: true,
            allowBlockEnd: true,
            allowClassStart: true,
            allowClassEnd: true,
            allowObjectStart: true,
            allowObjectEnd: true,
            allowArrayStart: true,
            allowArrayEnd: true,
        }],

        "lines-between-class-members": ["error", "always", {
            exceptAfterSingleLine: true,
        }],

        "max-len": ["error", {
            code: 140, comments: 100,
        }],

        "max-statements-per-line": ["error", {
            max: 1,
        }],

        "multiline-ternary": ["error", "always-multiline"],
        "new-parens": ["error", "always"],
        "newline-per-chained-call": "error",
        "no-extra-parens": "off",
        "no-mixed-spaces-and-tabs": "error",
        "no-multi-spaces": "error",

        "no-multiple-empty-lines": ["error", {
            max: 1,
        }],

        "no-trailing-spaces": "error",
        "no-whitespace-before-property": "error",
        "nonblock-statement-body-position": ["error", "beside"],

        "object-curly-newline": ["error", {
            consistent: true,
        }],

        "object-curly-spacing": ["error", "always"],

        "object-property-newline": ["error", {
            allowAllPropertiesOnSameLine: true,
        }],

        "operator-linebreak": ["error", "after"],

        "padded-blocks": ["error", {
            blocks: "never", classes: "always", switches: "never",
        }],

        "quotes": ["error", "single", {
            avoidEscape: false, allowTemplateLiterals: true,
        }],

        "rest-spread-spacing": ["error", "never"],

        "semi": ["error", "always", {
            omitLastInOneLineBlock: false, omitLastInOneLineClassBody: true,
        }],

        "semi-spacing": "error",
        "semi-style": ["error", "last"],
        "space-before-blocks": "error",
        "space-before-function-paren": ["error", "never"],
        "space-in-parens": ["error", "never"],
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "switch-colon-spacing": "error",
        "template-curly-spacing": "error",
        "template-tag-spacing": ["error", "always"],
        "@typescript-eslint/no-empty-object-type": "error",
        "@typescript-eslint/no-unsafe-function-type": "error",
        "@typescript-eslint/no-wrapper-object-types": "error",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-shadow": "error",

        "@typescript-eslint/typedef": ["error", {
            arrayDestructuring: true,
            arrowParameter: true,
            memberVariableDeclaration: true,
            objectDestructuring: false,
            parameter: true,
            propertyDeclaration: true,
            variableDeclaration: false,
            variableDeclarationIgnoreFunction: true,
        }],
        "@typescript-eslint/no-inferrable-types": "off",
    },
}, {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
});
