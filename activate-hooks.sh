#!/bin/bash

#unsetHooksConfig=$(git config --unset core.hooksPath)
getHooksConfig=$(git config --get core.hooksPath)
if [ -z "$getHooksConfig" ]; then
  git config core.hooksPath .githooks
  echo -e "\n\t\e[38;5;220mGit hooks activated ! path: .githooks\e[m\n"
else
  echo -e "\n\t\e[32mGit hooks already activated: path($getHooksConfig)\e[m\n"
fi