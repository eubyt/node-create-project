import { objAssign } from "../../../../../util/object.js";

function exec(fs, project, spinner, pathPlugin) {
    const {
        projectName,
        projectDesc,
        projectVersion,
        linters,
        framework,
        eslint,
        dependencies,
    } = project;

    const prefixSpinnerText = "[Script edit-packagejson.js]";
    let packageJson = fs.readJsonSync(`${projectName}/package.json`);

    const pluginPackageJson = (pluginName) => {
        spinner.text = `Reading ${pluginName} package.json and merging it with the project package.json.`;

        const packageJsonLinter = fs.readJsonSync(
            `${pathPlugin}/template/${framework}/plugins/${pluginName}/_package.json`
        );
        objAssign(packageJsonLinter, packageJson);

        spinner.succeed(
            `${prefixSpinnerText} Read ${pluginName} package.json and merged it with the project package.json successfully!`
        );
    };

    // Base package.json
    spinner.text = `Updating package.json for ${projectName} project.`;

    packageJson.name = projectName;
    packageJson.description = projectDesc;
    packageJson.version = projectVersion;

    spinner.succeed(
        `${prefixSpinnerText} Updated package.json for ${projectName} project.`
    );

    // Check linters dependencies package.json
    if (linters && linters.length > 0) {
        linters
            .map((value) =>
                value.includes("eslint") ? `eslint-${eslint}` : value
            )
            .forEach(pluginPackageJson);
    }

    // Check other dependencies package.json
    if (dependencies && dependencies.length > 0) {
        dependencies.forEach(pluginPackageJson);
    }

    // Write package.json
    try {
        spinner.text = `Writing package.json for ${projectName} project.`;
        fs.writeJsonSync(`${projectName}/package.json`, packageJson, {
            spaces: 2,
        });
    } catch (err) {
        spinner.fail(
            `${prefixSpinnerText} Failed to write package.json for ${projectName} project!`
        );
        console.error(err);
    } finally {
        spinner.succeed(
            `${prefixSpinnerText} Updated package.json for ${projectName} project.`
        );
    }
}

export default exec;
