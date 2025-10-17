import { connectDB } from "@/app/lib/db/mongoose";
import { Post } from "@/app/lib/models";

export default async function Blog() {
  let posts: any[] = [];
  
  try {
    await connectDB();
    posts = await Post.find({ published: true })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
  
  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-2xl">📰</span>
            <span className="text-sm font-semibold text-white">Tibbiy yangiliklar</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Blog va Maqolalar
          </h1>
          <p className="text-xl text-purple-50 max-w-2xl">
            Sog&apos;liqni saqlash, tibbiyot va shifokorlar haqida foydali maqolalar
          </p>
          {posts.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg">
              <span className="text-2xl font-bold text-purple-600">{posts.length}</span>
              <span className="text-slate-600 font-medium">ta maqola</span>
            </div>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl border-2 border-dashed border-slate-200 p-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hozircha maqolalar yo&apos;q</h3>
            <p className="text-slate-600">Tez orada qiziqarli maqolalar paydo bo&apos;ladi</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p: any) => {
            const category = p.categoryId as any;
            return (
              <a 
                key={p._id.toString()} 
                href={`/blog/${p.slug}`} 
                className="group relative overflow-hidden bg-white border-2 border-purple-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold border border-purple-300">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {category?.name || 'Umumiy'}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-slate-700 line-clamp-3 font-medium">{p.excerpt}</p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm group-hover:text-purple-800">
                      <span>O&apos;qish</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  )
}
