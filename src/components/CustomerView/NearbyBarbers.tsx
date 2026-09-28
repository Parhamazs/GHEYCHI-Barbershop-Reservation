import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { BarberProfile } from '../../types';
import { formatDistance, CITY_PRESETS } from '../../utils/geo';
import {
  toPersianDigits,
  formatPrice,
  getBarberName,
  getShopName,
  getAddress,
  getBio,
  getServices,
} from '../../utils/i18n';
import { BarberListSkeleton } from '../common/Skeleton';
import {
  MapPin,
  Star,
  Clock,
  Scissors,
  Navigation,
  AlertCircle,
  Search,
  Heart,
  User,
  Tag,
  Sparkles,
  RotateCcw,
  History,
  X,
  Trash2,
  ArrowUpDown,
} from 'lucide-react';

export type PriceRange = 'all' | 'economy' | 'standard' | 'premium';
export type SortOption = 'distance' | 'rating' | 'price_asc';

export interface RecentSearchItem {
  id: string;
  query: string;
  title: string;
  titleFa?: string;
  type: 'location' | 'barber' | 'query';
  cityName?: string;
  timestamp: number;
}

const DEFAULT_RECENT_SEARCHES: RecentSearchItem[] = [
  {
    id: 'rec-loc-jordan',
    query: 'Jordan',
    title: 'Tehran (North - Jordan)',
    titleFa: 'تهران (شمال - جردن)',
    type: 'location',
    cityName: 'Tehran (North - Jordan)',
    timestamp: Date.now() - 60000,
  },
  {
    id: 'rec-barber-kaveh',
    query: 'Gheychi Artisanal Studio',
    title: 'Gheychi Artisanal Studio',
    titleFa: 'استودیو تخصصی پیرایش قیچی',
    type: 'barber',
    timestamp: Date.now() - 120000,
  },
  {
    id: 'rec-barber-reza',
    query: 'Classic Blade Barberia',
    title: 'Classic Blade Barberia',
    titleFa: 'آرایشگاه کلاسیک بلید',
    type: 'barber',
    timestamp: Date.now() - 180000,
  },
];

export function getBarberPriceTier(price: number): 'economy' | 'standard' | 'premium' {
  if (price <= 350000) return 'economy';
  if (price <= 500000) return 'standard';
  return 'premium';
}

interface NearbyBarbersProps {
  onSelectBarber: (barber: BarberProfile) => void;
}

export const NearbyBarbers: React.FC<NearbyBarbersProps> = ({ onSelectBarber }) => {
  const {
    barbers,
    userCoords,
    setUserCoords,
    requestBrowserLocation,
    locationLoading,
    expiredWarningMessage,
    clearExpiredWarning,
    favoriteBarberIds,
    toggleFavoriteBarber,
    isBarberFavorite,
    setIsProfileModalOpen,
    language,
    direction,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityChangeLoading, setCityChangeLoading] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('all');
  const [priceFilterLoading, setPriceFilterLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('distance');

  // Recent Searches state: stores last 3 search locations or barber names
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const saved = localStorage.getItem('gheychi_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 3);
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  // Helper to persist and deduplicate recent searches (maximum 3 items)
  const addRecentSearch = (item: RecentSearchItem) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (p) =>
          p.id !== item.id &&
          p.query.toLowerCase() !== item.query.toLowerCase() &&
          p.title.toLowerCase() !== item.title.toLowerCase()
      );
      const updated = [item, ...filtered].slice(0, 3);
      try {
        localStorage.setItem('gheychi_recent_searches', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save recent searches', err);
      }
      return updated;
    });
  };

  const handleRemoveRecentSearch = (id: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('gheychi_recent_searches', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save recent searches', err);
      }
      return updated;
    });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('gheychi_recent_searches');
    } catch (err) {
      console.error('Failed to clear recent searches', err);
    }
  };

  // Quick jump back to a recent search
  const handleSelectRecentSearch = (item: RecentSearchItem) => {
    setPriceFilterLoading(true);

    if (item.type === 'location' && item.cityName) {
      handleCityChange(item.cityName);
      setSearchQuery('');
    } else {
      setSearchQuery(item.query);
    }

    // Refresh timestamp and move to head of recent searches
    addRecentSearch({
      ...item,
      timestamp: Date.now(),
    });

    setTimeout(() => {
      setPriceFilterLoading(false);
    }, 220);
  };

  // Record manual search submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    const matchingBarber = barbers.find(
      (b) =>
        b.shopName.toLowerCase().includes(trimmed.toLowerCase()) ||
        (b.shopNameFa && b.shopNameFa.toLowerCase().includes(trimmed.toLowerCase())) ||
        b.barberName.toLowerCase().includes(trimmed.toLowerCase()) ||
        (b.barberNameFa && b.barberNameFa.toLowerCase().includes(trimmed.toLowerCase()))
    );

    const matchingCity = CITY_PRESETS.find((c) =>
      c.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    addRecentSearch({
      id: `search-${Date.now()}`,
      query: trimmed,
      title: matchingBarber
        ? matchingBarber.shopName
        : matchingCity
        ? matchingCity.name
        : trimmed,
      titleFa: matchingBarber
        ? matchingBarber.shopNameFa
        : matchingCity
        ? matchingCity.name
        : trimmed,
      type: matchingBarber ? 'barber' : matchingCity ? 'location' : 'query',
      cityName: matchingCity ? matchingCity.name : undefined,
      timestamp: Date.now(),
    });
  };

  // Sort barbers according to selected sort criteria
  const sortedBarbers = [...barbers].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.ratingAvg - a.ratingAvg;
    }
    if (sortBy === 'price_asc') {
      return a.pricePerSlot - b.pricePerSlot;
    }
    // Default: 'distance'
    return (a.distanceKm ?? 999) - (b.distanceKm ?? 999);
  });

  // Calculate counts for each price tier across all available barbers
  const countEconomy = sortedBarbers.filter((b) => getBarberPriceTier(b.pricePerSlot) === 'economy').length;
  const countStandard = sortedBarbers.filter((b) => getBarberPriceTier(b.pricePerSlot) === 'standard').length;
  const countPremium = sortedBarbers.filter((b) => getBarberPriceTier(b.pricePerSlot) === 'premium').length;

  const query = searchQuery.toLowerCase().trim();
  const filteredBarbers = sortedBarbers.filter((b) => {
    // 1. Favorites filter
    if (showOnlyFavorites && !favoriteBarberIds.includes(b.id)) {
      return false;
    }

    // 2. Price range filter ('economy' | 'standard' | 'premium')
    if (selectedPriceRange !== 'all') {
      const tier = getBarberPriceTier(b.pricePerSlot);
      if (tier !== selectedPriceRange) {
        return false;
      }
    }

    // 3. Search query filter
    if (!query) return true;
    const shop = getShopName(b, language).toLowerCase();
    const barber = getBarberName(b, language).toLowerCase();
    const rawShop = b.shopName.toLowerCase();
    const rawBarber = b.barberName.toLowerCase();
    const services = getServices(b, language).map((s) => s.toLowerCase());
    return (
      shop.includes(query) ||
      barber.includes(query) ||
      rawShop.includes(query) ||
      rawBarber.includes(query) ||
      services.some((s) => s.includes(query))
    );
  });

  const formatDistanceLocalized = (dist?: number) => {
    const raw = formatDistance(dist);
    if (language === 'fa') {
      if (dist === undefined || isNaN(dist)) return '-- کیلومتر';
      if (dist < 1) {
        return `${toPersianDigits(Math.round(dist * 1000))} متر فاصله`;
      }
      return `${toPersianDigits(dist.toFixed(1))} کیلومتر فاصله`;
    }
    return raw;
  };

  const handleCityChange = (cityName: string) => {
    const found = CITY_PRESETS.find((c) => c.name === cityName);
    if (found) {
      setCityChangeLoading(true);
      setUserCoords({ lat: found.lat, lng: found.lng, cityName: found.name });
      setTimeout(() => {
        setCityChangeLoading(false);
      }, 300);

      // Record selected location into recent searches
      addRecentSearch({
        id: `loc-${found.name}`,
        query: found.name,
        title: found.name,
        titleFa: found.name,
        type: 'location',
        cityName: found.name,
        timestamp: Date.now(),
      });
    }
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    if (range === selectedPriceRange) return;
    setPriceFilterLoading(true);
    setSelectedPriceRange(range);
    setTimeout(() => {
      setPriceFilterLoading(false);
    }, 220);
  };

  const handleBarberCardSelect = (barber: BarberProfile) => {
    // Record barber into recent searches
    addRecentSearch({
      id: `barber-${barber.id}`,
      query: barber.shopName,
      title: barber.shopName,
      titleFa: barber.shopNameFa,
      type: 'barber',
      timestamp: Date.now(),
    });
    onSelectBarber(barber);
  };

  const isShowingSkeleton = locationLoading || cityChangeLoading || priceFilterLoading;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mandatory Red Warning Alert if 15m payment expires */}
      {expiredWarningMessage && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-red-500/40 bg-red-950/70 p-4 text-sm text-red-200 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-red-300">{t.reservationExpired}</p>
              <p className="text-xs text-red-200/90 leading-relaxed">{expiredWarningMessage}</p>
            </div>
          </div>
          <button
            onClick={clearExpiredWarning}
            className="self-stretch sm:self-center flex items-center justify-center min-h-[44px] rounded-xl bg-red-900/60 px-4 py-2 text-xs font-semibold text-red-100 hover:bg-red-800 active:scale-95 transition-all touch-manipulation cursor-pointer"
          >
            {t.dismiss}
          </button>
        </div>
      )}

      {/* Geolocation Discovery & Search Header (Collapsible Grid on Mobile) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-4 sm:p-5 md:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 items-center">
          <div className="md:col-span-5 lg:col-span-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">{t.discoverNearby}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-amber-400 shrink-0" />
              <span>{t.searchOrigin}</span>
              <span className="font-semibold text-blue-600 dark:text-amber-300">{userCoords.cityName}</span>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">·</span>
              <span className="font-mono text-slate-400 text-[11px] hidden sm:inline" dir="ltr">
                ({language === 'fa' ? toPersianDigits(userCoords.lat.toFixed(3)) : userCoords.lat.toFixed(3)}, {language === 'fa' ? toPersianDigits(userCoords.lng.toFixed(3)) : userCoords.lng.toFixed(3)})
              </span>
            </div>
          </div>

          {/* Location & Sorting Controls: 2-column or 3-column responsive grid */}
          <div className="md:col-span-7 lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {/* Live GPS button with smooth pulse instead of spinner */}
            <button
              onClick={requestBrowserLocation}
              disabled={locationLoading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-3 py-2.5 min-h-[44px] text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all touch-manipulation shadow-sm cursor-pointer disabled:opacity-80"
            >
              {locationLoading ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-amber-400 animate-ping" />
                  <span className="whitespace-nowrap">{t.detectingGps}</span>
                </div>
              ) : (
                <>
                  <Navigation className="h-4 w-4 text-blue-600 dark:text-amber-400 shrink-0" />
                  <span className="whitespace-nowrap">{t.liveGps}</span>
                </>
              )}
            </button>

            {/* City Preset Location Dropdown */}
            <select
              value={userCoords.cityName}
              onChange={(e) => handleCityChange(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 min-h-[44px] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-amber-500/50 cursor-pointer"
            >
              {CITY_PRESETS.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>

            {/* Sort by Dropdown Menu */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label={language === 'fa' ? 'مرتب‌سازی نتایج' : 'Sort results'}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 min-h-[44px] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-amber-500/50 cursor-pointer font-medium"
              >
                <option value="distance">
                  {language === 'fa' ? 'نزدیک‌ترین فاصله' : 'Nearest Distance'}
                </option>
                <option value="rating">
                  {language === 'fa' ? 'بالاترین امتیاز' : 'Highest Rated'}
                </option>
                <option value="price_asc">
                  {language === 'fa' ? 'کمترین قیمت' : 'Lowest Price'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Input Filter with Touch Height and Clear/Submit Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/95 ps-10 pe-20 py-3 min-h-[46px] text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 dark:focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-amber-500/30 transition-all"
          />

          <div className="absolute inset-y-0 end-0 flex items-center pe-2 gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'fa' ? 'پاک کردن متن' : 'Clear search text'}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold shadow-sm hover:opacity-95 cursor-pointer"
            >
              {language === 'fa' ? 'جستجو' : 'Search'}
            </button>
          </div>
        </form>

        {/* Recent Searches Section (Displays Last 3 search locations or barber names) */}
        {recentSearches.length > 0 && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <History className="h-3.5 w-3.5 text-blue-600 dark:text-amber-400" />
                <span>{language === 'fa' ? 'جستجوهای اخیر (۳ مورد آخر):' : 'Recent Searches (Last 3):'}</span>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                  {language === 'fa' ? 'جهت پرش سریع روی هر مورد کلیک کنید' : 'Click to jump back instantly'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearRecentSearches}
                className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>{language === 'fa' ? 'پاک کردن تاریخچه' : 'Clear history'}</span>
              </button>
            </div>

            {/* Interactive Chips for the last 3 items */}
            <div className="flex flex-wrap gap-2">
              {recentSearches.slice(0, 3).map((item) => {
                const isSelected =
                  (item.type === 'location' && userCoords.cityName === item.cityName) ||
                  (item.query && searchQuery.toLowerCase().trim() === item.query.toLowerCase().trim());

                return (
                  <div
                    key={item.id}
                    className={`group inline-flex items-center gap-1.5 rounded-xl border text-xs px-2.5 py-1.5 transition-all shadow-sm ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-900 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-300 font-bold ring-1 ring-blue-400/30 dark:ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectRecentSearch(item)}
                      className="flex items-center gap-1.5 text-start cursor-pointer"
                      title={language === 'fa' ? 'پرش به این جستجو' : 'Jump back to this search'}
                    >
                      {item.type === 'location' ? (
                        <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-amber-400 shrink-0" />
                      ) : item.type === 'barber' ? (
                        <Scissors className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Search className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      )}
                      <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]">
                        {language === 'fa' && item.titleFa ? item.titleFa : item.title}
                      </span>
                      <span className="text-[10px] opacity-70 px-1 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 font-mono">
                        {item.type === 'location'
                          ? (language === 'fa' ? 'موقعیت' : 'Location')
                          : item.type === 'barber'
                          ? (language === 'fa' ? 'آرایشگاه' : 'Salon')
                          : (language === 'fa' ? 'عبارت' : 'Query')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRecentSearch(item.id);
                      }}
                      title={language === 'fa' ? 'حذف این مورد' : 'Remove item'}
                      className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors ms-0.5 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Price-Range Filter: Economy, Standard, Premium */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-amber-400" />
              <span>{language === 'fa' ? 'فیلتر بر اساس رده قیمت خدمات:' : 'Service Price Range Filter:'}</span>
            </span>

            {selectedPriceRange !== 'all' && (
              <button
                onClick={() => handlePriceRangeChange('all')}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{language === 'fa' ? 'نمایش همه قیمت‌ها' : 'Reset price filter'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* All */}
            <button
              type="button"
              onClick={() => handlePriceRangeChange('all')}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedPriceRange === 'all'
                  ? 'border-blue-600 bg-blue-50/90 text-blue-900 dark:border-amber-500 dark:bg-amber-500/15 dark:text-amber-300 font-bold shadow-sm ring-1 ring-blue-500/30 dark:ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col text-start">
                <span className="font-bold">{language === 'fa' ? 'همه قیمت‌ها' : 'All Ranges'}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'fa' ? 'تمامی سالن‌ها' : 'All salons'}
                </span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {language === 'fa' ? toPersianDigits(sortedBarbers.length) : sortedBarbers.length}
              </span>
            </button>

            {/* Economy */}
            <button
              type="button"
              onClick={() => handlePriceRangeChange('economy')}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedPriceRange === 'economy'
                  ? 'border-emerald-500 bg-emerald-50/90 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold shadow-sm ring-1 ring-emerald-500/40'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col text-start">
                <span className="font-bold flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  {language === 'fa' ? 'اقتصادی (Economy)' : 'Economy'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'fa' ? 'تا ۳۵۰ هزار تومان' : 'Up to 350k Toman'}
                </span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                {language === 'fa' ? toPersianDigits(countEconomy) : countEconomy}
              </span>
            </button>

            {/* Standard */}
            <button
              type="button"
              onClick={() => handlePriceRangeChange('standard')}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedPriceRange === 'standard'
                  ? 'border-blue-600 bg-blue-50/90 text-blue-900 dark:border-amber-500 dark:bg-amber-500/20 dark:text-amber-300 font-bold shadow-sm ring-1 ring-blue-500/40 dark:ring-amber-500/40'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col text-start">
                <span className="font-bold flex items-center gap-1 text-blue-700 dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-amber-400 shrink-0" />
                  {language === 'fa' ? 'استاندارد (Standard)' : 'Standard'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'fa' ? '۳۵۰ تا ۵۰۰ هزار تومان' : '350k - 500k Toman'}
                </span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-amber-950 text-blue-700 dark:text-amber-300 font-bold">
                {language === 'fa' ? toPersianDigits(countStandard) : countStandard}
              </span>
            </button>

            {/* Premium */}
            <button
              type="button"
              onClick={() => handlePriceRangeChange('premium')}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                selectedPriceRange === 'premium'
                  ? 'border-purple-500 bg-purple-50/90 text-purple-900 dark:border-purple-500 dark:bg-purple-500/20 dark:text-purple-300 font-bold shadow-sm ring-1 ring-purple-500/40'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col text-start">
                <span className="font-bold flex items-center gap-1 text-purple-700 dark:text-purple-400">
                  <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400 shrink-0" />
                  {language === 'fa' ? 'پریمیوم (Premium)' : 'Premium'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {language === 'fa' ? '+۵۰۰ هزار تومان لوکس' : '+500k Toman VIP'}
                </span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                {language === 'fa' ? toPersianDigits(countPremium) : countPremium}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Filter: All vs Favorites & Profile Shortcut */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowOnlyFavorites(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !showOnlyFavorites
                  ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{language === 'fa' ? 'همه سالن‌ها' : 'All Barbers'}</span>
              <span className="text-[10px] opacity-80">({toPersianDigits(sortedBarbers.length)})</span>
            </button>

            <button
              onClick={() => setShowOnlyFavorites(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showOnlyFavorites
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${showOnlyFavorites ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
              <span>{language === 'fa' ? 'علاقه‌مندی‌های من' : 'My Favorites'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono">
                {language === 'fa' ? toPersianDigits(favoriteBarberIds.length) : favoriteBarberIds.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <User className="h-3.5 w-3.5" />
            <span>{language === 'fa' ? 'بخش علاقه‌مندی‌ها در پروفایل من' : 'My Favorites Profile'}</span>
          </button>
        </div>
      </div>

      {/* Barbers Grid or Skeleton Loading State */}
      {isShowingSkeleton ? (
        <BarberListSkeleton count={6} />
      ) : filteredBarbers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 sm:p-12 text-center text-xs sm:text-sm text-slate-500 space-y-3">
          <p>
            {showOnlyFavorites
              ? (language === 'fa'
                  ? 'هیچ سالنی در لیست علاقه‌مندی‌های شما با این مشخصات یافت نشد.'
                  : 'No favorite barbers match this criteria.')
              : selectedPriceRange !== 'all'
              ? (language === 'fa'
                  ? `هیچ آرایشگاهی در رده قیمتی انتخاب‌شده یافت نشد. می‌توانید فیلتر قیمت را تغییر دهید.`
                  : 'No barbers found in this price range. Try selecting another tier or clear the filter.')
              : (language === 'fa'
                  ? 'هیچ آرایشگاهی با این مشخصات یافت نشد. لطفاً عبارت دیگری را جستجو کنید.'
                  : 'No barbers found matching your search. Try adjusting the query or location.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {selectedPriceRange !== 'all' && (
              <button
                onClick={() => handlePriceRangeChange('all')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-bold shadow cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{language === 'fa' ? 'نمایش همه قیمت‌ها' : 'Reset Price Filter'}</span>
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-bold shadow cursor-pointer"
              >
                <span>{language === 'fa' ? 'پاک کردن عبارت جستجو' : 'Clear Search Query'}</span>
              </button>
            )}
            {showOnlyFavorites && (
              <button
                onClick={() => setShowOnlyFavorites(false)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 px-4 py-2 text-xs font-bold shadow cursor-pointer"
              >
                <span>{language === 'fa' ? 'مشاهده همه آرایشگاه‌ها' : 'Browse All Barbers'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBarbers.map((barber) => {
            const priceTier = getBarberPriceTier(barber.pricePerSlot);

            return (
              <div
                key={barber.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                {/* Image / Gallery Preview (Touch-friendly click opens modal) */}
                <div
                  onClick={() => handleBarberCardSelect(barber)}
                  className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer"
                >
                  {barber.images.length > 0 ? (
                    <img
                      src={barber.images[0].imageUrl}
                      alt={getShopName(barber, language)}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400">
                      <Scissors className="h-8 w-8 opacity-40" />
                    </div>
                  )}

                  {/* Scrim for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Price Tier Floating Badge on image */}
                  <div className="absolute top-3 start-3 z-10">
                    {priceTier === 'economy' && (
                      <span className="flex items-center gap-1 font-bold text-[10px] bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-lg shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{language === 'fa' ? 'اقتصادی' : 'Economy'}</span>
                      </span>
                    )}
                    {priceTier === 'standard' && (
                      <span className="flex items-center gap-1 font-bold text-[10px] bg-blue-950/80 dark:bg-slate-900/80 backdrop-blur-md text-blue-300 dark:text-amber-300 border border-blue-500/40 dark:border-amber-500/40 px-2 py-0.5 rounded-lg shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-amber-400" />
                        <span>{language === 'fa' ? 'استاندارد' : 'Standard'}</span>
                      </span>
                    )}
                    {priceTier === 'premium' && (
                      <span className="flex items-center gap-1 font-bold text-[10px] bg-purple-950/85 backdrop-blur-md text-purple-200 border border-purple-400/50 px-2 py-0.5 rounded-lg shadow-sm">
                        <Sparkles className="h-2.5 w-2.5 text-purple-300" />
                        <span>{language === 'fa' ? 'پریمیوم' : 'Premium'}</span>
                      </span>
                    )}
                  </div>

                  {/* Heart Icon Button to Save to My Favorites */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteBarber(barber.id);
                    }}
                    title={
                      isBarberFavorite(barber.id)
                        ? (language === 'fa' ? 'حذف از علاقه‌مندی‌ها' : 'Remove from Favorites')
                        : (language === 'fa' ? 'افزودن به علاقه‌مندی‌های من' : 'Add to My Favorites')
                    }
                    aria-label={
                      isBarberFavorite(barber.id)
                        ? 'Remove from Favorites'
                        : 'Add to My Favorites'
                    }
                    className={`absolute top-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition-all active:scale-90 shadow-md cursor-pointer ${
                      isBarberFavorite(barber.id)
                        ? 'bg-black/70 text-rose-500 border border-rose-500/50'
                        : 'bg-black/50 text-white/90 border border-white/20 hover:text-rose-400 hover:bg-black/70'
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isBarberFavorite(barber.id) ? 'fill-rose-500 scale-110' : 'hover:scale-110'
                      }`}
                    />
                  </button>

                  {/* Distance & Rating Badges */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-mono text-amber-300 font-semibold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      <Navigation className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatDistanceLocalized(barber.distanceKm)}</span>
                    </span>

                    <span className="flex items-center gap-1.5 text-white font-semibold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      <span>
                        {language === 'fa' ? toPersianDigits(barber.ratingAvg.toFixed(1)) : barber.ratingAvg.toFixed(1)}{' '}
                        ({language === 'fa' ? toPersianDigits(barber.reviewCount) : barber.reviewCount})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                        {getShopName(barber, language)}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
                        {getBarberName(barber, language)}
                      </p>
                    </div>
                    <div className="text-end shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-[10px] text-slate-400 block">{t.from}</span>
                        {priceTier === 'economy' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            {language === 'fa' ? 'اقتصادی' : 'Economy'}
                          </span>
                        )}
                        {priceTier === 'standard' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-amber-950/80 text-blue-700 dark:text-amber-300 border border-blue-300 dark:border-amber-800">
                            {language === 'fa' ? 'استاندارد' : 'Standard'}
                          </span>
                        )}
                        {priceTier === 'premium' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center gap-0.5">
                            <Sparkles className="h-2.5 w-2.5 text-purple-600 dark:text-purple-400" />
                            <span>{language === 'fa' ? 'پریمیوم' : 'Premium'}</span>
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap mt-0.5">
                        {formatPrice(barber.pricePerSlot, language)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {getBio(barber, language)}
                  </p>

                  {/* Services list */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {getServices(barber, language).slice(0, 3).map((service, idx, arr) => (
                      <React.Fragment key={service}>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{service}</span>
                        {idx < arr.length - 1 && <span className="text-slate-300 dark:text-slate-600">·</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Location & Working Hours */}
                  <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800/80 space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-4 w-4 shrink-0 text-blue-600 dark:text-amber-400/80" />
                      <span className="truncate">{getAddress(barber, language)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                      <span className="font-mono" dir="ltr">
                        {language === 'fa' ? toPersianDigits(barber.workingHoursStart) : barber.workingHoursStart} -{' '}
                        {language === 'fa' ? toPersianDigits(barber.workingHoursEnd) : barber.workingHoursEnd}
                      </span>
                    </div>
                  </div>

                  {/* Large 48px Touch Target Accessible Button */}
                  <div className="mt-5 pt-1">
                    <button
                      onClick={() => handleBarberCardSelect(barber)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 dark:bg-amber-500 px-4 py-3 min-h-[48px] text-xs sm:text-sm font-bold text-white dark:text-slate-950 shadow-md hover:bg-blue-700 dark:hover:bg-amber-400 active:scale-[0.98] transition-all touch-manipulation cursor-pointer"
                    >
                      <Scissors className="h-4 w-4" />
                      <span>{t.viewAndBook} {t.viewAndBookSub}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
