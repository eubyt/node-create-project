function exec(fs, project, pluginsMerge) {
    const { projectName, dependencies } = project;

    if (!dependencies.includes('eslint')) {
        return;
    }

    let packageJson = fs.readJsonSync(`${projectName}/package.json`);
    let eslintConfig = fs.readJsonSync(`${projectName}/.eslintrc`);

    // check eslint is installed
    if (!packageJson.devDependencies.eslint) {
        pluginsMerge(eslint.filter((x) => x.includes('eslint')));
    }

    packageJson.devDependencies['eslint-config-prettier'] = '^8.5.0';
    eslintConfig.extends.push('prettier');

    fs.writeJsonSync(`${projectName}/package.json`, packageJson, {
        spaces: 2,
    });

    fs.writeJsonSync(`${projectName}/.eslintrc`, eslintConfig, {
        spaces: 2,
    });
}

export default exec;
