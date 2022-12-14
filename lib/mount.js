import fse from "fs-extra";
import ora from "ora";
import { packagePath } from "../util/path.js";

async function mountProject(project) {
    console.log("\n\n");

    const { projectName, language, framework } = project;
    const pluginPath = `${packagePath}plugins/${language}`;
    const spinner = ora("Loading unicorns").start();
    spinner.color = "green";
    spinner.text = `Mounting ${projectName} project...`;

    fse.mkdirSync(projectName);

    try {
        fse.copySync(
            `${pluginPath}/template/${framework}/boilerplate`,
            projectName,
            {
                overwrite: true,
                filter(src, dest) {
                    spinner.text = `Copying ${src} to ${dest}.`;
                    return true;
                },
            }
        );
    } catch (err) {
        spinner.fail("Failed to copy files!");
        console.error(err);
    } finally {
        spinner.succeed("Copied files successfully!");
    }

    const files = fse
        .readdirSync(`${pluginPath}/template/${framework}/scripts`)
        .map((file) => `${pluginPath}/template/${framework}/scripts/${file}`);

    // All Freeze objects in variables
    Object.keys(project).forEach((key) => {
        project[key] = Object.freeze(project[key]);
    });

    await Promise.all(
        files.map(
            async (file) =>
                await import(file).then(async (script) => {
                    spinner.text = `Running ${file} script.`;
                    try {
                        await script.default(fse, project, spinner, pluginPath);
                    } catch (err) {
                        spinner.fail(`Failed to run ${file} script!`);
                        console.error(err);
                    } finally {
                        spinner.succeed(`Ran ${file} script successfully!`);
                    }
                })
        )
    );
    spinner.succeed(
        `Project ${projectName} mounted successfully!\n  Good luck! 🚀\n  Happy coding! 🤓`
    );
    console.log("\n\n");

    spinner.stop();
}

export { mountProject };
