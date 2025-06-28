#!/bin/bash

# Update relative imports to use @ alias
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  -e "s|from '\.\./\.\./types'|from '@/types'|g" \
  -e "s|from '\.\./types'|from '@/types'|g" \
  -e "s|from '\.\./\.\./data/providers/|from '@/data/providers/|g" \
  -e "s|from '\.\./data/providers/|from '@/data/providers/|g" \
  -e "s|from '\.\./\.\./components/|from '@/components/|g" \
  -e "s|from '\.\./components/|from '@/components/|g" \
  -e "s|from '\.\./\.\./contexts/|from '@/contexts/|g" \
  -e "s|from '\.\./contexts/|from '@/contexts/|g" \
  -e "s|from '\.\./\.\./hooks/|from '@/hooks/|g" \
  -e "s|from '\.\./hooks/|from '@/hooks/|g" \
  -e "s|from '\.\./\.\./\.\./types'|from '@/types'|g" \
  -e "s|from '\.\./\.\./\.\./data/providers/|from '@/data/providers/|g" \
  -e "s|from '\.\./\.\./\.\./components/|from '@/components/|g" \
  -e "s|from '\.\./\.\./\.\./contexts/|from '@/contexts/|g" \
  -e "s|from '\.\./\.\./\.\./hooks/|from '@/hooks/|g"

echo "Import paths updated to use @ alias"
