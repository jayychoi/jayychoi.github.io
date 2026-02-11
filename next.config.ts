import type { NextConfig } from "next";

const isDev = process.argv.indexOf("dev") !== -1;

// dev 모드에서만 Velite watch 실행 (build는 package.json 스크립트에서 미리 처리)
if (!process.env.VELITE_STARTED && isDev) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: true, clean: false }));
}

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: isProd ? "export" : undefined,
  reactCompiler: true,
  pageExtensions: isProd
    ? ["tsx", "ts", "jsx", "js"]
    : ["tsx", "ts", "jsx", "js", "dev.tsx", "dev.ts"],
};

export default nextConfig;
