#!/bin/bash

getHooksConfig=$(git config --get core.hooksPath)
if [ -z "$getHooksConfig" ]; then
  git config core.hooksPath .gitconfig/hooks
  echo -e "\n\t\e[38;5;220mGit hooks activated ! path: .gitconfig/hooks\e[m\n"
else
  echo -e "\n\t\e[32mGit hooks already activated: path($getHooksConfig)\e[m\n"
fi