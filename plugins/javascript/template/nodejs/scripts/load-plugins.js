import handlebars from "handlebars";
import { objAssign } from "../../../../../util/object.js";

async function exec(fs, project, spinner, pathPlugin) {
    const { projectName, linters, language, framework, eslint, dependencies } =
        Object.assign({}, project);

    let contentsFile = {
        "index.js": {
            import: [],
            var: [],
            functions: [
                "function helloWorld() {",
                "    console.log('Hello World!');",
                "}",
            ],
        },
    };

    let scriptsPlugin = [];
    let configsPlugin = [];

    const prefixSpinnerText = "[Script load-plugins.js]";
    const pluginsMerge = (pluginName) => {
        try {
            spinner.text = `Reading ${pluginName} copy files and merging it with the project files.`;
            const pathPluginMerge = `${pathPlugin}/template/${framework}/plugins/${pluginName}`;
            fs.copySync(pathPluginMerge, projectName, {
                overwrite: false,
                filter: (src, dest) => {
                    spinner.text = `Copying ${src} to ${dest}.`;
                    const filename = src.split("/").pop();
                    // Run Scripts
                    if (src.includes("scripts") && filename.includes(".js")) {
                        scriptsPlugin.push(
                            `${pathPluginMerge}/scripts/${filename}`
                        );
                        return false;
                    }

                    // Run Configs
                    if (filename === "__config__.js") {
                        configsPlugin.push(`${pathPluginMerge}/${filename}`);
                        return false;
                    }

                    // No need to copy package.json
                    if (filename === "_package.json") {
                        return false;
                    }
                    return true;
                },
            });
        } catch (error) {
            spinner.fail(
                `${prefixSpinnerText} Error reading ${pluginName} copy files and merging it with the project files.`
            );
        } finally {
            spinner.succeed(
                `${prefixSpinnerText} Read ${pluginName} copy files and merged it with the project files successfully!`
            );
        }
    };

    // Merge Linters files
    if (linters && linters.length > 0) {
        [...linters, ...Array(eslint).map((x) => `eslint-${x}`)].forEach(
            pluginsMerge
        );
    }

    // Merge other dependencies files
    if (dependencies && dependencies.length > 0) {
        dependencies.forEach(pluginsMerge);
    }

    // Remove scripts folder
    try {
        spinner.text = `Removing scripts folder.`;
        fs.removeSync(`${projectName}/scripts`);
    } catch (error) {
        spinner.fail(`${prefixSpinnerText} Error removing scripts folder.`);
    } finally {
        spinner.succeed(`${prefixSpinnerText} Removed scripts folder.`);
    }

    // Run Scripts plugins
    if (scriptsPlugin.length > 0) {
        spinner.text = `Running scripts plugins.`;
        await Promise.all(
            scriptsPlugin.map(
                async (file) =>
                    await import(file).then((module) => {
                        spinner.text = `Running ${file} script.`;
                        const result = module.default(fs, {
                            ...project,
                            contentsFile,
                        });

                        if (result && result.contentsFile) {
                            objAssign(result.contentsFile, contentsFile);
                        }

                        spinner.succeed(
                            `${prefixSpinnerText} Run ${file} script successfully!`
                        );
                    })
            )
        );
    }

    // Load Configs plugins
    await Promise.all(
        configsPlugin.map(
            async (file) =>
                await import(file).then((module) => {
                    spinner.text = `Loading ${file} config.`;
                    const { variables } = module.default;
                    if (variables) {
                        objAssign(variables, contentsFile);
                    }
                    spinner.succeed(
                        `${prefixSpinnerText} Loaded ${file} config successfully!`
                    );
                })
        )
    );

    // Rename all files with .ejs extension in the project
    try {
        spinner.text = `Renaming all files with .ejs extension in the project.`;
        fs.readdirSync(projectName).forEach((file) => {
            if (file.includes(".ejs")) {
                const newFile = file.replace(".ejs", ".js");
                fs.renameSync(
                    `${projectName}/${file}`,
                    `${projectName}/${newFile}`
                );
            }
        });
    } catch (error) {
        spinner.fail(
            `${prefixSpinnerText} Error renaming all files with .ejs extension in the project.`
        );
    } finally {
        spinner.succeed(
            `${prefixSpinnerText} Renamed all files with .ejs extension in the project successfully!`
        );
    }

    // Template files with handlebars
    Object.keys(contentsFile)
        .map((fileName) => `${projectName}/${fileName}`)
        .forEach((fileName) => {
            // Template variables
            spinner.text = `Template variables in ${fileName} file.`;
            const file = fs.readFileSync(fileName, "utf8");
            if (!file) {
                return;
            }
            const templateIndexJs = handlebars.compile(file);
            let content = contentsFile[fileName.split("/").pop()];
            Object.keys(content).forEach((key) => {
                content[key] = content[key].join("\n");
            });

            try {
                fs.writeFileSync(fileName, templateIndexJs(content));
            } catch (error) {
                spinner.fail(
                    `${prefixSpinnerText} Error templating variables in ${fileName} file.`
                );
            } finally {
                spinner.succeed(
                    `${prefixSpinnerText} Template variables in ${fileName} file successfully!`
                );
            }
        });
}

export default exec;
