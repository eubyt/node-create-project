export default {
    type: "select",
    name: "language",
    message: {
        "pt-BR": "Qual linguagem de programação do seu projeto?",
        "en-US": "What is the programming language of your project?",
    },
    required: true,
    choices: [
        { message: "JavaScript", value: "javascript" },
        { message: "TypeScript", value: "typescript" },
    ],
};
