const fs = require("fs");
const path = require("path");

// package.json에서 버전 읽기
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const packageVersion = packageJson.version;

// version.ts에서 버전 읽기
const versionTsPath = path.join(__dirname, "..", "constants", "version.ts");
const versionTsContent = fs.readFileSync(versionTsPath, "utf8");
const versionMatch = versionTsContent.match(/export const version = '([^']+)'/);

if (!versionMatch) {
  console.error("Error: Could not find version in constants/version.ts");
  process.exit(1);
}

const versionTs = versionMatch[1];

// 버전 비교
if (packageVersion !== versionTs) {
  // 버전이 다르면 자동으로 version.ts를 업데이트
  const updatedContent = versionTsContent.replace(
    /export const version = '([^']+)'/,
    `export const version = '${packageVersion}'`
  );

  // version.ts 파일에 새 내용 쓰기
  fs.writeFileSync(versionTsPath, updatedContent);

  console.log(
    `Version synchronized: constants/version.ts updated to ${packageVersion}`
  );
} else {
  console.log(`Version check passed: ${packageVersion}`);
}
