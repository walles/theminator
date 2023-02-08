import * as vscode from "vscode";

// This file is heavily influenced by this documentation:
// https://code.visualstudio.com/api/extension-guides/webview

const viewType = "themeGenerator";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "theminator-theme-generator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "theminator-theme-generator.toggleGenerateThemePanel",
    () => {
      // FIXME: Toggle UI off if it was already visible

      const panel = vscode.window.createWebviewPanel(
        viewType,
        "Theme Generator",
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent();

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "generate":
              console.log("Received Generate request: %o", message);
              regenerateTheme(message.backgroundColor);
              return;
            default:
              console.error(
                "Received unsupported message request: %o",
                message
              );
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposable);
}

function regenerateTheme(backgroundColor: string) {
  vscode.window.showErrorMessage(backgroundColor);

  // Fill in workbench.colorCustomizations:
  // https://code.visualstudio.com/api/extension-guides/color-theme#workbench-colors
  const config = vscode.workspace.getConfiguration();

  // FIXME: Generate these!
  const newColorCustomizations = {
    "sideBar.background": backgroundColor,
  };

  config.update(
    "workbench.colorCustomizations",
    newColorCustomizations,
    vscode.ConfigurationTarget.Global
  );

  // FIXME: Fill in editor.tokenColorCustomizations:
  // https://code.visualstudio.com/api/extension-guides/color-theme#syntax-colors

  // FIXME: Consider Semantic Highlighting as well?
  // https://code.visualstudio.com/api/extension-guides/color-theme#semantic-colors
}

function getWebviewContent() {
  return `<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
	</head>
	<body>
	  <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
	  <div>
      <label><input type="color" id="backgroundColor"> Background Color</label>
	  </div>
	  <div>
      <button id="generate" type="button" onclick="generate()">Generate Theme</button>
	  </div>

	  <script>
		  const vscode = acquireVsCodeApi();

      function generate() {
        vscode.postMessage({
          command: 'generate',
          backgroundColor: document.getElementById('backgroundColor').value
        })
      }
	  </script>
	</body>
	</html>`;
}
