export default [
    {
        type: "multiselect",
        name: "dependencies",
        message: {
            "pt-BR":
                "Selecione as ferramentas de Linting ou CodeStyle (Opcional)",
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
                result(value) {
                    return Array(value);
                },
                choices: [
                    {
                        message: "Standard",
                        value: "eslint-standard",
                    },
                    {
                        message: "xo",
                        value: "eslint-xo",
                    },
                ],
            },
        ],
    },
    {
        type: "multiselect",
        name: "dependencies",
        message: {
            "pt-BR": "Selecione as dependências que deseja utilizar (Opcional)",
            "en-US": "Select the dependencies you want to use (Optional)",
        },
        choices: [
            {
                message: "dotenv",
                value: "dotenv",
            },
            {
                message: "Express",
                value: "express",
            },
        ],
    },
];
