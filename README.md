# Theminator Theme Generator

This is the README for your extension "theminator-theme-generator". After
writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your
extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project
workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to
> show off your extension! We recommend short, focused animations that are easy
> to follow.

# In Case of Emergency

Color customizations are stored in `~/Library/Application Support/Code/User/settings.json`
under the `workbench.colorCustomizations` key and can be restored with any text editor.

# TODO

- Add a Reset button
- Generate UI theme
- Generate matching syntax theme
- How to add Semantic Highlighting to our theme? Sounds easy. Any reason not to?
- Remove Coding Cat references from the docs example
- Move into a smaller UI, something like the Tweet Feedback thingy that VSCode
  comes with maybe.
- Consider what our command `title` should be in `package.json` for it to be
  easily findable
- Add a checkbox for using our theme or not. "Not" should fall back to whatever
  theme was in use before we started doing our thing. Or just some defaults if
  that's not possible.
- Scope our color customizations so we don't overwrite anything the user has
  done. Mind the Reset button.
- Publish to VSCode Market
- Make generated themes exportable. Or just refer to [this
  documentation](https://code.visualstudio.com/api/extension-guides/color-theme#create-a-new-color-theme)?
- Regenerate theme when user updates color setting. Maybe with some flooding
  protection so we don't regenerate too often?
- Go through PRs and issues in
  <https://github.com/usernamehw/vscode-theme-generator> to see if there's
  something we also need to handle.
