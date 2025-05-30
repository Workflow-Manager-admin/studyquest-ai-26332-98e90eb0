#!/bin/bash
cd /home/kavia/workspace/code-generation/studyquest-ai-26332-98e90eb0/studyquest_ai
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

