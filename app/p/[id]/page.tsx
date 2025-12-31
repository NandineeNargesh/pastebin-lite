import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function ViewPaste({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
  const paste = await prisma.$transaction(async (tx) => {
      // Use "as any" temporarily if TypeScript is being stubborn 
      // but "tx.paste" is the standard way.
      const p = await (tx as any).paste.findUnique({
        where: { id },
      });

      if (!p) return null;

      if (p.expires_at && new Date() > p.expires_at) return null;
      if (p.max_views !== null && p.current_views >= p.max_views) return null;

      return await (tx as any).paste.update({
        where: { id },
        data: { current_views: { increment: 1 } },
      });
    });

    if (!paste) notFound();

    return (
      <main className="min-h-screen bg-linear-to-br from-[#FFF8E1] to-[#FFECB3] p-6 flex justify-center items-start pt-20 font-sans">
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-amber-200">
          <div className="bg-amber-600 p-6 text-white">
            <h1 className="text-2xl font-black uppercase tracking-widest">
              {paste.title || "Untitled Note"}
            </h1>
            <p className="text-amber-100 text-sm font-medium">Securely decrypted and ready to view</p>
          </div>
          
          <div className="p-8">
            <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-mono bg-amber-50/50 p-6 rounded-2xl border border-amber-100 shadow-inner min-h-50">
              {paste.content}
            </pre>

            <div className="mt-8 flex flex-wrap gap-4 items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-700">
              <div className="flex gap-4">
                <span className="bg-amber-100 px-3 py-1 rounded-full">
                  👁️ Views: {paste.current_views} / {paste.max_views || "∞"}
                </span>
                {paste.expires_at && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                    ⏳ Expires: {new Date(paste.expires_at).toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-gray-400">ID: {paste.id}</span>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    notFound();
  }
}