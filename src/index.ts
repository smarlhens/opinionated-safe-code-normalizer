#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { ESLint } from 'eslint';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import * as fs from 'fs';

type RulePatch = (file: SourceFile, transformArgs: Record<string, unknown>) => void;

interface RuleNormalizer {
  [key: string]: RulePatch;
}

export const addPublic: RulePatch = (file: SourceFile, transformArgs: Record<string, unknown>) => {
  const propertyDeclarations = file.getDescendantsOfKind(SyntaxKind.PropertyDeclaration);

  const methodDeclarations = file.getDescendantsOfKind(SyntaxKind.MethodDeclaration);

  const getAccessorDeclarations = file.getDescendantsOfKind(SyntaxKind.GetAccessor);

  const setAccessorDeclarations = file.getDescendantsOfKind(SyntaxKind.SetAccessor);

  [...propertyDeclarations, ...methodDeclarations, ...getAccessorDeclarations, ...setAccessorDeclarations].forEach(
    variableStatement => {
      if (
        !variableStatement.hasModifier(SyntaxKind.PublicKeyword) &&
        !variableStatement.hasModifier(SyntaxKind.PrivateKeyword) &&
        !variableStatement.hasModifier(SyntaxKind.ProtectedKeyword)
      ) {
        variableStatement.toggleModifier('public', true);
      }
    }
  );

  file.saveSync();
};

export const main = async (): Promise<void> => {
  const argv = yargs(hideBin(process.argv)).argv;
  let workingDirectory = Reflect.get(argv, 'wd');
  const lintFilePatterns = ['**/*.ts'];
  const eslintConfig = '.eslintrc.js';
  const ruleNormalizers: RuleNormalizer = {
    '@typescript-eslint/explicit-member-accessibility': addPublic,
  };
  const filePathsByRuleId: Map<string, string[]> = new Map<string, string[]>();

  if (!workingDirectory) {
    console.log('Default working directory is process.cwd().');
    workingDirectory = process.cwd();
  }

  if (!path.isAbsolute(workingDirectory)) {
    console.log('Working directory must be an absolute path.');
  }

  const eslintOptions = {
    cwd: workingDirectory,
    useEslintrc: true,
  };

  try {
    const eslintConfigFileAbsolutePath = path.join(workingDirectory, eslintConfig);
    console.log(eslintConfigFileAbsolutePath);
    if (fs.existsSync(eslintConfigFileAbsolutePath)) {
      console.log('Config file exists.');
      Reflect.set(eslintOptions, 'overrideConfigFile', eslintConfig);
    } else {
      console.log('Config does not exist.');
    }
  } catch (err) {
    console.error(err);
  }

  const eslint = new ESLint(eslintOptions);
  const results = await eslint.lintFiles(lintFilePatterns);
  const errors = results.filter(result => result.errorCount > 0);
  const warnings = results.filter(result => result.warningCount > 0);

  const addFilePathByRuleId = (ruleId: string | null, filePath: string) => {
    if (!ruleId) {
      return;
    }

    if (!filePathsByRuleId.has(ruleId)) {
      filePathsByRuleId.set(ruleId, []);
    }

    filePathsByRuleId.get(ruleId)?.push(filePath);
  };

  [...errors, ...warnings].forEach(result =>
    result.messages.forEach(message => addFilePathByRuleId(message.ruleId, result.filePath))
  );

  const applyPatchForRule = (filePaths: string[], ruleId: string) => {
    const project = new Project();
    const sourceFiles = project.addSourceFilesAtPaths(filePaths);
    sourceFiles.forEach(f => ruleNormalizers[ruleId](f, {}));
    project.saveSync();
  };

  filePathsByRuleId.forEach(applyPatchForRule);
};

main();
