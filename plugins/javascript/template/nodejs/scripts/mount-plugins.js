import handlebars from "handlebars";
import shell from "child_process";
import { objAssign } from "../../../../../util/object.js";

const prefixSpinnerText = "[Script load-plugins.js]";

async function exec(fs, project, spinner, pathPlugin) {
    const { projectName, framework, dependencies, packageManager } =
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
            console.error(error);
        } finally {
            spinner.succeed(
                `${prefixSpinnerText} Read ${pluginName} copy files and merged it with the project files successfully!`
            );
        }
    };

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
                        const result = module.default(
                            fs,
                            {
                                ...project,
                                contentsFile,
                            },
                            (pluginName) => pluginsMerge(pluginName)
                        );

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

    const renameFiles = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const pathFile = `${dir}/${file}`;
            if (fs.statSync(pathFile).isDirectory()) {
                renameFiles(pathFile);
            } else if (file.includes(".ejs")) {
                spinner.text = `Rename ${pathFile} file.`;
                fs.renameSync(pathFile, pathFile.replace(".ejs", ".js"));
                spinner.succeed(
                    `${prefixSpinnerText} Renamed ${pathFile} file successfully!`
                );
            }
        });
    };

    renameFiles(projectName);

    // Template files with handlebars
    Object.keys(contentsFile).forEach((fileName) => {
        const pathFile = `${projectName}/${fileName}`;
        // Check if file exists
        if (!fs.existsSync(pathFile)) {
            return;
        }

        spinner.text = `Template variables in ${pathFile} file.`;

        const file = fs.readFileSync(pathFile, "utf8");
        const templateIndexJs = handlebars.compile(file);

        let content = {};
        Object.keys(contentsFile[fileName]).forEach((key) => {
            content[key] = contentsFile[fileName][key].join("\n");
        });

        try {
            fs.writeFileSync(pathFile, templateIndexJs(content));
        } catch (error) {
            spinner.fail(
                `${prefixSpinnerText} Error templating variables in ${fileName} file.`
            );
            console.error(error);
        } finally {
            spinner.succeed(
                `${prefixSpinnerText} Template variables in ${fileName} file successfully!`
            );
        }
    });

    // Package Manager
    let command = [`cd ${projectName}`];
    switch (packageManager) {
        case "npm":
            command.push("npm install");
            break;
        case "yarn":
            command.push("yarn install");
            break;
        case "pnpm":
            command.push("pnpm install");
            break;
        default:
            break;
    }

    spinner.text = `Running ${command} command.`;
    shell.execSync(command.join(" && "), { stdio: "inherit" });
}

export default exec;
