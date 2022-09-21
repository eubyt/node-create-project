function run(fs, project) {
    const { projectName } = project;
    const file = `${projectName}/.vscode/extensions.json`;

    if (!fs.existsSync(file)) {
        return;
    }

    const extensions = fs.readJsonSync(file);

    extensions.recommendations.push("mikestead.dotenv");
    fs.writeFileSync(
        `${projectName}/.vscode/extensions.json`,
        JSON.stringify(extensions, null, 4)
    );
}

export default run;
