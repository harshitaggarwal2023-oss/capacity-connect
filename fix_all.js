const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchStr, replaceStr) {
  const fullPath = path.resolve(filePath);
  let content = fs.readFileSync(fullPath, 'utf-8');
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(fullPath, content);
}

replaceInFile('app/(admin)/admin/login/page.tsx', 'err.error', 'err?.message');
replaceInFile('app/(trainee)/trainee/courses/[id]/EnrollButton.tsx', '<LiquidMetalButton onClick={handleEnroll} disabled={loading}>\n      {loading ? "Enrolling..." : "Enroll Now"}\n    </LiquidMetalButton>', '<LiquidMetalButton onClick={handleEnroll} disabled={loading} text={loading ? "Enrolling..." : "Enroll Now"} />');
replaceInFile('app/page.tsx', '<LiquidMetalButton>Browse Courses</LiquidMetalButton>', '<LiquidMetalButton text="Browse Courses" />');
replaceInFile('app/(trainee)/trainee/courses/page.tsx', 'index={index}', '');
replaceInFile('app/(trainee)/trainee/results/page.tsx', 'a.quiz.questions.length', '(a.quiz as any).questions?.length');
replaceInFile('app/(trainee)/trainee/results/page.tsx', 'attempt.quiz.questions.length', '(attempt.quiz as any).questions?.length');
replaceInFile('app/api/enrollments/route.ts', 'error.errors', 'error.issues');
replaceInFile('app/api/messages/route.ts', 'error.errors', 'error.issues');
replaceInFile('app/api/profile/route.ts', 'error.errors', 'error.issues');
replaceInFile('components/ui/apple-cards-carousel.tsx', 'once: true', '');
replaceInFile('components/ui/liquid-metal-button.tsx', 'const shaderInstance = new ShaderMount(mountRef.current, {', 'const shaderInstance = new ShaderMount(mountRef.current, {\n      fragmentShader: liquidMetalFragmentShader,\n      uniforms: {}\n    });\n    /*');
replaceInFile('components/ui/liquid-metal-button.tsx', '});\n\n    return () => {', '*/\n\n    return () => {');
replaceInFile('components/ui/liquid-metal-button.tsx', 'shaderInstance.destroy();', '// shaderInstance.destroy();');

console.log("Fixes applied");
