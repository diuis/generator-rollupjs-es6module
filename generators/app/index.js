var Generator = require("yeoman-generator");

module.exports = class extends Generator {

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname.split(" ").join("-").toLowerCase(),
        store: true
      },
      {
        type: "input",
        name: "namespace",
        message: "Your project namespace",
        store: true
      },
      {
        type: "input",
        name: "author",
        message: "Your name",
        store: true
      },
      {
        type: "input",
        name: "mainClass",
        message: "main class",
        store: true
      },
      {
        type: "input",
        name: "gitEmailDomain",
        message: "git email domain for circleci build",
        store: true
      },
    ]);
  }

  constructor(args, opts) {
    super(args, opts);
  }

  templates() {
    this.fs.copyTpl(
      this.templatePath("escheckrc"),
      this.destinationPath(".escheckrc")
    );
    this.fs.copyTpl(
      this.templatePath("gitignore"),
      this.destinationPath(".gitignore")
    );
    this.fs.copyTpl(
      this.templatePath("npmignore"),
      this.destinationPath(".npmignore")
    );
    this.fs.copyTpl(
      this.templatePath("circleci/config.yml"),
      this.destinationPath(".circleci/config.yml"),
      { gitEmailDomain: this.answers.gitEmailDomain }
    );
    this.fs.copyTpl(
      this.templatePath("verb.md"),
      this.destinationPath(".verb.md")
    );
    this.fs.copyTpl(
      this.templatePath("rollup.config.ts"),
      this.destinationPath("rollup.config.ts"),
      { mainClass: this.answers.mainClass }
    );
    this.fs.copyTpl(
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json")
    );
    this.fs.copyTpl(
      this.templatePath("tslint.json"),
      this.destinationPath("tslint.json")
    );
    this.fs.copyTpl(
      this.templatePath("jest.config.js"),
      this.destinationPath("jest.config.js")
    );
    this.fs.copyTpl(
      this.templatePath("src/Class"),
      this.destinationPath("src/" + this.answers.mainClass + ".ts"),
      { mainClass: this.answers.mainClass }
    );
  }

  pkgJson() {
    const pkgJson = {
      name: "@" + this.answers.namespace + "/" + this.answers.name,
      version: "1.0.0",
      description: this.answers.name,
      private: true,
      author: this.answers.author,
      license: "UNLICENSED",
      engines: {
        "yarn": ">=1.13.0"
      },
      scripts: {
        "start": "rollup -c rollup.config.ts -w",
        "test": "jest --coverage --coverageDirectory=build/coverage --passWithNoTests",
        "test:watch": "jest --coverage --coverageDirectory=build/coverage --passWithNoTests --watch",
        "doc": "typedoc --out build/docs --excludePrivate --excludeExternals --exclude **/*.test.ts --target es6 src",
        "prebuild": "yarn lint",
        "build": "rollup -c rollup.config.ts",
        "postbuild": "yarn escheck ; yarn test ; yarn doc ; yarn generate:readme",
        "build:local": "rollup -c rollup.config.ts --environment BUILD:development",
        "link:list": "node node_modules/yarn-list-link/bin/yarn-list-link.js",
        "escheck": "es-check -v",
        "lint": "tslint --project ./tsconfig.json",
        "build-commit-deploy": "yarn build ; git commit -am \"new version\" ; git push ; yarn deploy-module",
        "deploy-module": "publish-to-git",
        "new:major": "yarn version --no-git-tag-version --major",
        "postnew:major": "yarn build-commit-deploy",
        "new:minor": "yarn version --no-git-tag-version --minor",
        "postnew:minor": "yarn build-commit-deploy",
        "new:patch": "yarn version --no-git-tag-version --patch",
        "postnew:patch": "yarn build-commit-deploy",
        "generate:readme": "verb readme"
      },
      module: "build/" + this.answers.name + ".js",
      types: "build/types/src/" + this.answers.mainClass + ".d.ts",
      repository: {
        "type": "git",
        "url": "git@github.com:@" + this.answers.namespace + "/" + this.answers.name + ".git"
      }
    };

    this.fs.extendJSON(this.destinationPath("package.json"), pkgJson);
  }

  pkgJsonInstall() {
    this.yarnInstall(["@log4js2/core"]);
  }

  pkgJsonInstallDev() {
    this.yarnInstall(["rollup", "rollup-plugin-filesize", "rollup-plugin-json", "rollup-plugin-replace", "rollup-plugin-typescript2"], { "dev": true });
    this.yarnInstall(["@types/jest", "jest", "jest-extended", "ts-jest"], { "dev": true });
    this.yarnInstall(["tslint", "typescript"], { "dev": true });
    this.yarnInstall(["es-check"], { "dev": true });
    this.yarnInstall(["typedoc"], { "dev": true });
    this.yarnInstall(["verb@verbose/verb#dev", "verb-generate-readme"], { "dev": true });
    this.yarnInstall(["yarn-list-link"], { "dev": true });
    this.yarnInstall(["publish-to-git"], { "dev": true });
  }

  pkgJsonInstallPeer() {
  }

};
