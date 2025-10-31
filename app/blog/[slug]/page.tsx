import { connectDB } from "@/app/lib/db/mongoose";
import { Post } from "@/app/lib/models";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  
  try {
    await connectDB();
    post = await Post.findOne({ slug })
      .populate('categoryId', 'name')
      .populate('authorId', 'name')
      .lean();
  } catch (error) {
    console.error('Error fetching post:', error);
  }
  
  if (!post || !post.published) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Maqola topilmadi</h1>
        <p className="text-slate-600">Kechirasiz, bu maqola mavjud emas</p>
      </div>
    );
  }
  
  const category = post.categoryId as any;
  
  return (
    <article className="prose prose-emerald max-w-none">
      <h1>{post.title}</h1>
      {post.coverUrl && <img src={post.coverUrl} alt={post.title} />}
      <p className="text-sm text-slate-600">
        {category?.name || 'Umumiy'} — {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
