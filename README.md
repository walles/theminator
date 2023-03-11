# Theminator Theme Generator

Theme generator for Visual Studio Code.

The goal is to generate good looking themes based only on a background color.

Initially inspired by wanting to lowlight
`invalid.deprecated.line-too-long.git-commit` and
`invalid.illegal.line-too-long.git-commit` for [my Git Commit Messages
extension](https://github.com/walles/git-commit-message-plus).

FIXME: Imagine an animated-webp demo here

# In Case of Emergency

Color customizations are stored in `~/Library/Application Support/Code/User/settings.json`
under the `workbench.colorCustomizations` key and can be restored with any text editor.

# TODO

- Give tab text some color that's readable vs the tab background
- Give not-selected editor tabs a color with some (but not too much) contrast vs
  the editor background color
- Generate UI theme
- Generate matching syntax theme
- How to add Semantic Highlighting to our theme? Sounds easy. Any reason not to?
- Remove Coding Cat references from the docs example
- Scope our color customizations so we don't overwrite anything the user has
  done. Mind the Reset button.
- Move into a smaller UI, something like the Tweet Feedback thingy that VSCode
  comes with maybe.
- Consider what our command `title` should be in `package.json` for it to be
  easily findable
- Add a checkbox for using our theme or not. "Not" should fall back to whatever
  theme was in use before we started doing our thing. Or just some defaults if
  that's not possible.
- Publish to VSCode Market
- Make generated themes exportable. Or just refer to [this
  documentation](https://code.visualstudio.com/api/extension-guides/color-theme#create-a-new-color-theme)?
- Regenerate theme when user updates color setting. Maybe with some flooding
  protection so we don't regenerate too often?
- Go through PRs and issues in
  <https://github.com/usernamehw/vscode-theme-generator> to see if there's
  something we also need to handle.

## Done

- Make sure all background colors are close to the requested one, not just in
  intensity but also in hue. Ask for a red background and see what happens.
- Pick white as the background color. Figure out how to make the UI white rather
  than red in this case.
- Make sure all background colors are of similar (but not necessarily the same)
  saturation and intensity as the base background color
- Only generate colors we have explicit rules for, log warnings about the others
- Give the selected editor tab the same background as the editor itself
