import nodejs from "./nodejs.js";

export default [
    {
        type: "select",
        name: "ambientExecution",
        message: {
            "pt-BR": "Selecione o ambiente de execução",
            "en-US": "Select the execution environment",
        },
        choices: [
            {
                message: "NodeJS",
                value: "nodejs",
            },
        ],
        requiredQuestion: [...nodejs],
    },
];
