export const i18n = {
  required: {
    "pt-BR": "Este campo é obrigatório.",
    "en-US": "This field is required.",
  },
};

export default {
  type: "select",
  name: "i18n.language",
  message: "Select language for question",
  required: true,
  choices: [
    {
      message: "English",
      value: "en-US",
    },
    {
      message: "Portuguese (Brazil)",
      value: "pt-BR",
    },
  ],
};
