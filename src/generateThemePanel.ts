import * as vscode from "vscode";

export class GenerateThemePanel {
  public static readonly viewType = "themeGenerator";

  public static toggle(extensionUri: vscode.Uri) {
    // FIXME: Move this view into the left hand side bar
    const panel = vscode.window.createWebviewPanel(
      GenerateThemePanel.viewType,
      "Theme Generator",
      vscode.ViewColumn.Two,
      {}
    );

    // FIXME: Toggle this off if it was already on

    panel.webview.html = getWebviewContent();
  }
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
  </body>
  </html>`;
}
