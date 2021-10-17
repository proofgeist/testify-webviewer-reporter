import dynamic from "next/dynamic";
const DynamicComponent = dynamic(
  () => import("../components/test-reporter/Test"),
  { ssr: false }
);

export default function Home() {
  return <DynamicComponent />;
}
