import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Todo App</h1>
      <p className="text-gray-600 mb-8">
        Hono RPC + Next.js BFF 모노레포 아키텍처 예제
      </p>
      <Link
        href="/todos"
        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        할 일 목록으로 이동 →
      </Link>
    </main>
  );
}
