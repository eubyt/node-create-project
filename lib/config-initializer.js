import enquirer from "enquirer";
import { mountProject } from "./mount.js";
import { placeQuestion } from "./question.js";

async function loadingPromt(file, lang = "pt-BR", callback) {
  try {
    file = `../plugins/${file}`;
    await import(file).then((configFile) => {
      let answer;
      let questions = placeQuestion(configFile.default, lang);

      const prompt = () =>
        enquirer.prompt(questions[0]).then(async (currAnswer) => {
          const { requiredQuestion, loadingFramework } = questions[0];
          const getValue = (obj) => {
            const value = Object.values(obj)[0];
            return typeof value === "object" ? getValue(value) : value;
          };

          answer = {
            ...answer,
            ...currAnswer,
          };

          questions.shift();

          if (requiredQuestion) {
            const listRequiredQuestion = requiredQuestion.filter((question) => {
              if (Array.isArray(getValue(currAnswer))) {
                return getValue(currAnswer).includes(question.key);
              } else {
                return getValue(currAnswer) === question.key;
              }
            });

            if (listRequiredQuestion.length) {
              questions = [...listRequiredQuestion, ...questions];
            }
          }

          if (loadingFramework) {
            await import(
              `${file}/../template/${getValue(
                currAnswer
              )}/configure-template.js`
            ).then((framework) => {
              questions = [
                ...placeQuestion(framework.default, lang),
                ...questions,
              ];
            });
          }

          if (questions.length > 0) {
            prompt();
          } else {
            return callback(answer);
          }
        });

      return prompt();
    });
  } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND") {
      console.error(`Error: File config ${file} not found.`, error.code);
    } else {
      console.error(error);
    }
  }
}

function initializeConfig() {
  return loadingPromt("i18n.js", null, ({ i18n }) =>
    loadingPromt("project-language.js", i18n.language, ({ language }) =>
      loadingPromt(`${language}/configure.js`, i18n.language, (project) => {
        mountProject({ ...project, language, i18n });
      })
    )
  );
}

export { initializeConfig };
