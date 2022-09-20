import semver from "semver";

export default [
    {
        key: "nodejs",
        type: "input",
        name: "projectName",
        hint: {
            "pt-BR": "meu-projeto",
            "en-US": "my-project",
        },
        message: {
            "pt-BR": "Qual o nome do seu projeto?",
            "en-US": "What is the name of your project?",
        },
        required: true,
        validate(value) {
            if (value.length > 50) {
                return {
                    "pt-BR":
                        "O nome do projeto deve ter no máximo 50 caracteres.",
                    "en-US":
                        "The project name must be at most 50 characters long.",
                };
            }

            if (!value.match(/^[a-z0-9-]+$/)) {
                return {
                    "pt-BR":
                        "O nome do projeto deve conter apenas letras minúsculas, números e hífens.",
                    "en-US":
                        "The project name must contain only lowercase letters, numbers and hyphens.",
                };
            }
            return true;
        },
    },
    {
        key: "nodejs",
        type: "input",
        name: "projectDesc",
        hint: {
            "pt-BR": "Meu projeto é mágico.",
            "en-US": "My project is magic.",
        },
        message: {
            "pt-BR": "Qual a descrição do seu projeto?",
            "en-US": "What is the description of your project?",
        },
        required: true,
    },
    {
        key: "nodejs",
        type: "input",
        name: "projectVersion",
        message: {
            "pt-BR": "Qual a versão inicial do seu projeto?",
            "en-US": "What is the initial version of your project?",
        },
        initial: "0.0.1",
        validate(value) {
            if (!semver.valid(value)) {
                return {
                    "pt-BR":
                        "A versão deve ser no formato semver (https://semver.org/).",
                    "en-US":
                        "The version must be in semver format (https://semver.org/).",
                };
            }
            return true;
        },
    },
    {
        key: "nodejs",
        type: "select",
        name: "framework",
        message: {
            "pt-BR": "Qual framework deseja utilizar?",
            "en-US": "Which framework do you want to use?",
        },
        choices: [
            {
                message: "none",
                value: "nodejs",
            },
            {
                message: "ReactJS",
                value: "reactjs",
            },
        ],
        loadingFramework: true,
    },
];
