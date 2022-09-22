export default [
    {
        type: "multiselect",
        name: "dependencies",
        message: {
            "pt-BR": "Selecione as ferramentas de Linting (Opcional)",
            "en-US": "Select the Linting tools (Optional)",
        },
        hint: {
            "pt-BR": "Use a barra de espaço para selecionar",
            "en-US": "Use the space bar to select",
        },
        choices: [
            {
                message: "ESLint",
                value: "eslint",
            },
            {
                message: "Prettier",
                value: "prettier",
            },
            {
                message: "EditorConfig",
                value: "editorconfig",
            },
        ],
        requiredQuestion: [
            {
                key: "eslint",
                type: "select",
                name: "dependencies",
                message: {
                    "pt-BR":
                        "Qual o estilo de código que você deseja utilizar?",
                    "en-US": "What code style do you want to use?",
                },
                choices: [
                    {
                        message: "Standard",
                        value: "standard",
                    },
                    {
                        message: "xo",
                        value: "xo",
                    },
                ],
            },
        ],
    },
    {
        type: "select",
        name: "dependencies",
        message: {
            "pt-BR": "Qual o estilo de CSS que você deseja utilizar?",
            "en-US": "What CSS style do you want to use?",
        },
        result(value) {
            return Array(value);
        },
        choices: [
            {
                message: "tailwindcss (postcss)",
                value: "tailwindcss-postcss",
            },
        ],
    },
];
