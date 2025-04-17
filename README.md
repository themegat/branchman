# Branch Man

Branch Man is a branch manager for Git that works on a single/multi-folder workspace.

## Features

- Works on a single/multi-folder workspace.
- Pull changes from a `(pre-set)` parent branch to a `(pre-set)` current branch.
- Set the `current` and `parent` branches for a workspace folder.

## Usage

- On **activation** the extension will initialize the branch state and **set the current branch** for each workspace folder.  
- When **checking out** a new branch the extension will **set the current branch** and provide a prompt to **update the parent branch** for the particular workspace folder.

You can then execute any of the following commands:

**Update the child branch**

- Open the command palatte - `Shift + Command + P (Mac)` / `Ctrl + Shift + P (Windows/Linux)`
- Find and select the update child command - `Branch Man: Update Child Branch` / `Update Child Branch`
- Select a workspace folder when prompted
- Confirm the the action when prompted

**Set the branch state**

- Open the command palatte - `Shift + Command + P (Mac)` / `Ctrl + Shift + P (Windows/Linux)`
- Find and select the set branch state command - `Branch Man: Set Branch State` / `Set Branch State`
- Select a workspace folder when prompted
- Select the state field to update, *current* or *parent* branch when prompted
- From the provided list select a branch to set

**Show the branch state/s**

- Open the command palatte - `Shift + Command + P (Mac)` / `Ctrl + Shift + P (Windows/Linux)`
- Find and select the show branch state command - `Branch Man: Show Branch State` / `Show Branch State`


## Release Notes
