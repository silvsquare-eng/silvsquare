import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewsProps {
  productId: string;
  initialReviews: Review[];
  initialRating: number;
}

export function Reviews({ productId, initialReviews, initialRating }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    // Load reviews from local storage, fallback to initial mock reviews
    const stored = localStorage.getItem(`reviews_${productId}`);
    if (stored) {
      setReviews(JSON.parse(stored));
    } else {
      setReviews(initialReviews || []);
    }
  }, [productId, initialReviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const newReview: Review = {
      id: Math.random().toString(36).substring(7),
      author: newAuthor,
      rating: newRating,
      text: newText,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    
    setNewAuthor('');
    setNewText('');
    setNewRating(5);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : initialRating;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-primary-dark">التقييمات والآراء</h2>
        <div className="flex items-center gap-1 bg-neutral-100 px-3 py-1 rounded-lg">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-lg">{avgRating}</span>
          <span className="text-sm text-neutral-500">({reviews.length})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Review List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-neutral-500">لا توجد تقييمات حتى الآن. كن أول من يشاركنا رأيه!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border-b border-neutral-100 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary-dark">{review.author}</span>
                  <span className="text-xs text-neutral-400">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-200 fill-neutral-200'}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{review.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Review Form */}
        <div className="bg-neutral-50 p-6 rounded-2xl h-fit">
          <h3 className="font-semibold text-primary-dark mb-4">أضف تقييمك</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">الاسم:</label>
              <input 
                type="text" 
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-accent" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">التقييم:</label>
              <select 
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-accent"
              >
                <option value="5">5 نجوم - ممتاز</option>
                <option value="4">4 نجوم - جيد جداً</option>
                <option value="3">3 نجوم - جيد</option>
                <option value="2">نجمتين - مقبول</option>
                <option value="1">نجمة واحدة - ضعيف</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">تعليقك:</label>
              <textarea 
                required
                rows={3}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-accent resize-none" 
              />
            </div>
            <button type="submit" className="w-full btn-primary py-2.5 text-sm">
              إرسال التقييم
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
