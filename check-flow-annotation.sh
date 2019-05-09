#!/usr/bin/env bash

echo "Checking all files under src/ begin with the flow annotation..."

set -e

errorArray=()
files=()

while IFS=  read -r -d $'\0'; do
  files+=("$REPLY")
done < <(find src -name "*.js" -print0)

for file in "${files[@]}"; do
#  echo ${file}

  # Ignore test files :
  if [[ $file == *"__tests__"* ]]; then
    continue
  fi

  line=`head -n1 ${file}`

#  echo ${line};

  if [[ ("$line" != "// @flow") && ("$line" != "// check-flow-annotation-disable-file") ]]; then
    errorArray+=("File $file should begin with // @flow, but it begins with $line")
  fi

done

if [ ${#errorArray[@]} -eq 0 ]; then
  echo "All good !"
  exit 0
else
  echo "ERROR ! Following files should being with // @flow :"
  for err in "${errorArray[@]}"; do
    echo $err
  done
  exit 1
fi
