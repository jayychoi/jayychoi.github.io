import AboutEditor from "@/components/admin/about-editor";

export default function EditAboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="mb-6 font-semibold text-xl">소개 수정</h1>
      <AboutEditor />
    </div>
  );
}
