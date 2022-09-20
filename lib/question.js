import { i18n } from "../plugins/i18n.js";

function placeQuestion(questionObj, i18nLang) {
  const message = (txt) => {
    if (typeof txt === "object") {
      return txt[i18nLang] || txt[Object.keys(txt)[0]];
    } else {
      return txt;
    }
  };

  if (!Array.isArray(questionObj)) {
    questionObj = Array(questionObj);
  }

  return questionObj.map((question) => ({
    key: question.key,
    type: question.type,
    name: question.name,
    message: message(question.message),
    hint: message(question?.hint),
    choices: question?.choices,
    initial: question?.initial,
    loadingFramework: question.type === "select" && question.loadingFramework,
    requiredQuestion: question.requiredQuestion
      ? placeQuestion(question.requiredQuestion, i18nLang)
      : undefined,
    validate(value) {
      if (question?.required && !value) {
        return message(i18n.required);
      }

      if (question?.validate) {
        const result = question.validate(value);
        return typeof result === "boolean" ? result : message(result);
      }

      return true;
    },
  }));
}

export { placeQuestion };
