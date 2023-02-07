import * as vscode from "vscode";
import { GenerateThemePanel } from "./generateThemePanel";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "darklight-theme-generator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "darklight-theme-generator.toggleGenerateThemePanel",
    () => {
      // The code you place here will be executed every time your command is executed
      GenerateThemePanel.toggle(context.extensionUri);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
