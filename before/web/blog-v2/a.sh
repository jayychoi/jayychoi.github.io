#!/bin/bash

# 현재 디렉토리 및 하위 디렉토리의 모든 .md 파일을 찾음
find . -type f -name "*.md" | while read -r file; do
  # 'draft'를 'published: true'로 변경
  sed -i '' 's/^category:$/category: blog2/g' "$file"
  echo "Updated: $file"
done

echo "All markdown files have been updated."
