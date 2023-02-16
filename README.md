# tic-tac-toe

Things I learned:
- Ctrl + Shift + L for multi-line select in VSCode makes life easier.
- Using closures to make private variables in factory functions
- To make modules, you use IIFE and return an object with functions and variables you want to show.

Objective: Have as little global code as possible.
- If I need one of something (eg. gameBoard) --> module
- If I need multiple of something (eg. players) --> factory

Requirements:
X   Allow Players to add marks to a specific spot on the board
X   Keep players from playing in spots already taken
X   Build the logic that checks for when the game is over (3-in-a-row or tie)
X   Clean the interface to allow players to put in the names
X   Buton to start/restart the game
X   Display element that congratulates the winning player