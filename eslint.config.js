import vueTsConfig from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';

export default [
    { ignores: ['dist/**', 'node_modules/**', 'public/static/**', 'src/**/*.d.ts'] },
    ...pluginVue.configs['flat/essential'],
    ...vueTsConfig(),
    {
        rules: {
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
        },
    },
];
