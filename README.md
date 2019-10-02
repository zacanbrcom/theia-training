# Exercise 1: Implement Quick File

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/akosyakov/theia-training/tree/exercise-1)

In this exercise, you learn:
- frontend and backend application lifecycle and contributions;
- how to register commands, keybindings and menus;
- how to use the command palette and the status bar;
- how to open files.

### Task 1: Register a command
- Add `Open Quick File...` command in `TheiaTrainingFrontendContribution.registerCommand`.
- The command should call `this.open` for the first workspace root, i.e. `this.workspaceService.tryGetRoots()[0]`.
- If there is no workspace root then the command should not be visible and enabled.

### Task 2: Register a keybinding
- Add `ctrlcmd+k f` keybinding for `Open Quick File...` command in `TheiaTrainingFrontendContribution.registerKeybindings`.

### Task 3: Register a menu
- Add `Open Quick File...` menu item in `CommonMenus.FILE_OPEN` menu path in `TheiaTrainingFrontendContribution.registerMenus`

### Task 4: Add a status bar item
- Add `Open Quick File...` status bar item with file icon aligned left in `TheiaTrainingFrontendContribution.onStart`.

## Bonus

### Task 5: Implement a quick open handler
- Reimplement `TheiaTrainingFrontendContribution` as `QuickOpenHandler`, see `TheiaTrainingFrontendContribution.registerQuickOpenHandlers`.