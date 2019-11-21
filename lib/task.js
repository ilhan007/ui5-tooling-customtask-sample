const resourceFactory = require("@ui5/fs").resourceFactory;

module.exports = async function({workspace, dependencies, options}) {
	const handlebars = await workspace.byGlob("/resources/*.hbs");
	console.log(handlebars); // "/resources/Other.lit.js" is found but should not

	const resources = handlebars.map(async hbs =>  {
		const hbsCode = await hbs.getString();

		const componentNameMatcher = /(\w+)(\.hbs)/gim;
		const result = componentNameMatcher.exec(hbs.getPath());

		if (!result) {
			return Promise.resolve();
		}

		const componentName = result[1];
		const resource = resourceFactory.createResource({
			string: hbsCode,
			path: `/resources/generated/templates/${componentName}.lit.js`
		});

		return workspace.write(resource);
	});

	return Promise.all(resources);
};