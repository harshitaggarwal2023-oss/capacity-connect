const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchStr, replaceStr) {
  const fullPath = path.resolve(filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(fullPath, content);
}

replaceInFile('app/(admin)/admin/login/page.tsx', 'res?.error', '(res as any)?.error');
replaceInFile('app/(trainee)/trainee/courses/[id]/EnrollButton.tsx', 'disabled={loading} text={', 'className={loading ? "opacity-50 pointer-events-none" : ""} label={');
replaceInFile('app/(trainee)/trainee/courses/page.tsx', 'index={0}', '');
replaceInFile('app/(trainee)/trainee/results/page.tsx', 'attempt.quiz.questions?.length', '(attempt.quiz as any).questions?.length');
replaceInFile('app/page.tsx', '<LiquidMetalButton>\n                Browse Courses\n              </LiquidMetalButton>', '<LiquidMetalButton label="Browse Courses" />');
replaceInFile('app/page.tsx', '<LiquidMetalButton>Browse Courses</LiquidMetalButton>', '<LiquidMetalButton label="Browse Courses" />');
replaceInFile('app/page.tsx', '<LiquidMetalButton text="Browse Courses" />', '<LiquidMetalButton label="Browse Courses" />');

console.log("Fixes applied");
