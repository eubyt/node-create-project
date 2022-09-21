function run(fs, project) {
    const { projectName } = project;
    const file = `${projectName}/.vscode/extensions.json`;

    if (!fs.existsSync(file)) {
        return;
    }

    const extensions = fs.readJsonSync(file);
    const settings = fs.readJsonSync(`${projectName}/.vscode/settings.json`);

    extensions.recommendations.push('esbenp.prettier-vscode');

    settings['editor.formatOnSave'] = true;
    settings['editor.defaultFormatter'] = 'esbenp.prettier-vscode';

    fs.writeFileSync(`${projectName}/.vscode/extensions.json`, JSON.stringify(extensions, null, 4));
    fs.writeFileSync(`${projectName}/.vscode/settings.json`, JSON.stringify(settings, null, 4));
}

export default run;
