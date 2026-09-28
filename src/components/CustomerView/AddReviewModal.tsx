import React, { useState } from 'react';
import { BarberProfile } from '../../types';
import { useApp } from '../../store/AppContext';
import { getShopName, getBarberName, toPersianDigits } from '../../utils/i18n';
import { Star, X, Check, MessageSquare, ThumbsUp, Scissors } from 'lucide-react';

interface AddReviewModalProps {
  barber: BarberProfile;
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_TAGS = [
  { id: 'tag-fade', labelFa: 'اسکین فید و سایه‌زنی', labelEn: 'Skin Fade' },
  { id: 'tag-scissors', labelFa: 'اصلاح با قیچی کلاسیک', labelEn: 'Scissors Cut' },
  { id: 'tag-beard', labelFa: 'مرتب‌سازی و خط ریش', labelEn: 'Beard Detailing' },
  { id: 'tag-spa', labelFa: 'ماساژ و اسپا پوست سر', labelEn: 'Scalp Massage' },
  { id: 'tag-hospitality', labelFa: 'برخورد و پذیرایی عالی', labelEn: 'Great Hospitality' },
  { id: 'tag-punctual', labelFa: 'شروع دقیق سر وقت', labelEn: 'On-time Precision' },
];

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  barber,
  isOpen,
  onClose,
}) => {
  const { currentUser, addReview, addToast, language } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>(['tag-fade', 'tag-punctual']);
  const [comment, setComment] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>(currentUser.fullName || 'علی راد');

  if (!isOpen) return null;

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const getRatingLabel = (score: number) => {
    if (language === 'fa') {
      switch (score) {
        case 5: return 'عالی و فوق‌العاده حرفه‌ای ★★★★★';
        case 4: return 'بسیار خوب و رضایت‌بخش ★★★★';
        case 3: return 'متوسط و معمولی ★★★';
        case 2: return 'نیاز به بهبود دارد ★★';
        case 1: return 'ضعیف و نامناسب ★';
        default: return '';
      }
    } else {
      switch (score) {
        case 5: return 'Outstanding & Master Craftsmanship ★★★★★';
        case 4: return 'Very Good & Recommended ★★★★';
        case 3: return 'Average / Acceptable ★★★';
        case 2: return 'Needs Improvement ★★';
        case 1: return 'Disappointing ★';
        default: return '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // Append tags to comment if any
    const chosenTagLabels = selectedTags
      .map((tagId) => SERVICE_TAGS.find((s) => s.id === tagId))
      .filter(Boolean)
      .map((s) => (language === 'fa' ? s?.labelFa : s?.labelEn))
      .join(' · ');

    const finalComment = chosenTagLabels
      ? `${comment.trim()}\n[${language === 'fa' ? 'نقاط قوت:' : 'Strengths:'} ${chosenTagLabels}]`
      : comment.trim();

    addReview(barber.id, rating, finalComment);

    addToast({
      type: 'success',
      title: language === 'fa' ? 'نظر و امتیاز شما با موفقیت ثبت شد' : 'Review Submitted Successfully',
      message: language === 'fa'
        ? `سپاس از بازخورد ارزشمند شما درباره ${getShopName(barber, 'fa')}.`
        : `Thank you for your feedback on ${barber.shopName}.`,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg my-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <Star className="h-5 w-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {language === 'fa' ? 'ثبت نظر و امتیاز تجربه پیرایش' : 'Rate & Review Your Experience'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {getShopName(barber, language)} ({getBarberName(barber, language)})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Interactive Star Rating Selection */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-4 text-center space-y-2">
            <span className="text-slate-600 dark:text-slate-300 font-semibold block">
              {language === 'fa' ? 'امتیاز کلی شما به کیفیت اصلاح و خدمات:' : 'Your Overall Rating:'}
            </span>

            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isFilled = (hoverRating || rating) >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starValue)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
              {getRatingLabel(hoverRating || rating)}
            </p>
          </div>

          {/* Service Quality Tags */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              {language === 'fa' ? 'نقاط قوت و خدمات برجسته سالن:' : 'Service Highlights:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-300 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-blue-600 dark:text-amber-400" />}
                    <span>{language === 'fa' ? tag.labelFa : tag.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              {language === 'fa' ? 'نام و نام خانوادگی شما:' : 'Your Name:'}
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={language === 'fa' ? 'نام شما' : 'Your name'}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-amber-500/30 text-xs sm:text-sm"
            />
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {language === 'fa' ? 'متن تجربه و دیدگاه شما:' : 'Your Review Comment:'}
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {language === 'fa' ? toPersianDigits(comment.length) : comment.length}/۵۰۰
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                language === 'fa'
                  ? 'تجربه خود را از اصلاح، دقت آرایشگر، بهداشت محیط و زمان‌بندی بنویسید...'
                  : 'Share your experience regarding haircut precision, hygiene, hospitality, or timing...'
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-amber-500/30 text-xs sm:text-sm resize-none leading-relaxed"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              {language === 'fa' ? 'انصراف' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 font-bold shadow-md hover:bg-blue-700 dark:hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{language === 'fa' ? 'ثبت و انتشار نظر' : 'Publish Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
