'use client';

import React, { useEffect, useState, useMemo } from 'react';

// Adjust path if needed!
import festivalsData from '../../data/festivals.json';

type Festival = {
  id: string;
  name: string;
  country: string;
  city: string;
  region: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  duration_days: number;
  family_friendly: boolean;
  camping: boolean;
  glamping: boolean;
  weather_profile: string[];
  vibe: string[];
  website: string;
  status: string;
  min_age: number;
  ticket_official_url: string;
};

type Filters = {
  search: string;
  genres: string[];
  months: string[];
  regions: string[];
  priceMin: number;
  priceMax: number;
  family: boolean | null;
  camping: boolean | null;
};

const getUnique = (arr: string[][] | string[]) =>
  Array.from(new Set(Array.isArray(arr[0]) ? (arr as string[][]).flat() : (arr as string[]))).filter(Boolean);

export default function PremiumFestivalExplorer() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    genres: [],
    months: [],
    regions: [],
    priceMin: 0,
    priceMax: 5000,
    family: null,
    camping: null,
  });
  const [sort, setSort] = useState<'name'|'price'|'duration'|'audience'>('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  // Load festivals (local import or fetch)
  useEffect(() => {
    setFestivals(festivalsData as Festival[]);
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const fav = JSON.parse(localStorage.getItem('festi_favs') || '[]');
    setFavorites(fav);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('festi_favs', JSON.stringify(favorites));
  }, [favorites]);

  const allGenres = useMemo(() => getUnique(festivals.map(f => f.genres)), [festivals]);
  const allMonths = useMemo(() => getUnique(festivals.map(f => f.months)), [festivals]);
  const allRegions = useMemo(() => getUnique(festivals.map(f => f.region)), [festivals]);

  const filtered = useMemo(() => {
    return festivals.filter(fest => {
      if (filters.search && !fest.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.genres.length && !filters.genres.some(g => fest.genres.includes(g))) return false;
      if (filters.months.length && !filters.months.some(m => fest.months.includes(m))) return false;
      if (filters.regions.length && !filters.regions.includes(fest.region)) return false;
      if (filters.family !== null && fest.family_friendly !== filters.family) return false;
      if (filters.camping !== null && fest.camping !== filters.camping) return false;
      const min = fest.estimated_cost_usd.min;
      const max = fest.estimated_cost_usd.max;
      if (max < filters.priceMin || min > filters.priceMax) return false;
      return true;
    });
  }, [festivals, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'price') arr.sort((a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min);
    if (sort === 'duration') arr.sort((a, b) => b.duration_days - a.duration_days);
    if (sort === 'audience') {
      const order = { 'massive': 3, 'large': 2, 'medium': 1, 'small': 0 };
      arr.sort(
        (a, b) =>
          (order[b.audience_size as keyof typeof order] || 0) -
          (order[a.audience_size as keyof typeof order] || 0)
      );
    }
    return arr;
  }, [filtered, sort]);

  function toggleFavorite(id: string) {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  }

  function toggleCompare(id: string) {
    setCompare(prev => prev.includes(id) ? prev.filter(f => f !== id) : (prev.length < 3 ? [...prev, id] : prev));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] to-[#E3ECFF] p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-indigo-800">Festival Explorer <span className="bg-amber-300 px-3 py-1 rounded-full text-xs align-middle ml-2 font-bold text-yellow-900">Premium</span></h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">Explore, filter, favorite and compare 100+ of the world’s greatest music festivals. Upgrade your adventure and find the perfect event for you!</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Search festival name"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
          <select className="border rounded px-3 py-2 text-sm"
            value={filters.genres[0] || ''}
            onChange={e => setFilters(f => ({ ...f, genres: e.target.value ? [e.target.value] : [] }))}>
            <option value="">All Genres</option>
            {allGenres.map(g => <option key={g}>{g}</option>)}
          </select>
          <select className="border rounded px-3 py-2 text-sm"
            value={filters.months[0] || ''}
            onChange={e => setFilters(f => ({ ...f, months: e.target.value ? [e.target.value] : [] }))}>
            <option value="">All Months</option>
            {allMonths.map(m => <option key={m}>{m}</option>)}
          </select>
          <select className="border rounded px-3 py-2 text-sm"
            value={filters.regions[0] || ''}
            onChange={e => setFilters(f => ({ ...f, regions: e.target.value ? [e.target.value] : [] }))}>
            <option value="">All Regions</option>
            {allRegions.map(r => <option key={r}>{r}</option>)}
          </select>
          <span className="flex items-center gap-2 text-sm">
            <label>Family:</label>
            <select className="border rounded px-2 py-1"
              value={filters.family === null ? '' : filters.family ? 'yes' : 'no'}
              onChange={e => setFilters(f => ({ ...f, family: e.target.value === '' ? null : e.target.value === 'yes' }))}>
              <option value="">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <label>Camping:</label>
            <select className="border rounded px-2 py-1"
              value={filters.camping === null ? '' : filters.camping ? 'yes' : 'no'}
              onChange={e => setFilters(f => ({ ...f, camping: e.target.value === '' ? null : e.target.value === 'yes' }))}>
              <option value="">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <label>Price ($):</label>
            <input type="number" min="0" max="5000" className="w-20 border rounded px-2 py-1"
              value={filters.priceMin} onChange={e => setFilters(f => ({ ...f, priceMin: Number(e.target.value) }))} />
            <span>-</span>
            <input type="number" min="0" max="5000" className="w-20 border rounded px-2 py-1"
              value={filters.priceMax} onChange={e => setFilters(f => ({ ...f, priceMax: Number(e.target.value) }))} />
          </span>
          <span className="flex items-center gap-2 text-sm">
            <label>Sort by:</label>
            <select className="border rounded px-2 py-1"
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="duration">Duration</option>
              <option value="audience">Audience Size</option>
            </select>
          </span>
          <button className="ml-2 border px-3 py-2 rounded text-xs bg-gray-100 hover:bg-gray-200"
            onClick={() => setFilters({
              search: '',
              genres: [],
              months: [],
              regions: [],
              priceMin: 0,
              priceMax: 5000,
              family: null,
              camping: null
            })}>
            Reset Filters
          </button>
        </div>

        {/* Compare Bar */}
        {compare.length > 0 && (
          <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="mb-2 sm:mb-0 font-semibold text-amber-900">
              Comparing: {compare.map(id => festivals.find(f => f.id === id)?.name).join(', ')}
            </div>
            <button className="border px-3 py-1 rounded bg-amber-200 hover:bg-amber-300"
              onClick={() => setCompare([])}>
              Clear Comparison
            </button>
          </div>
        )}

        {/* Comparison Table */}
        {compare.length > 0 && (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border text-xs bg-white rounded-lg shadow">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left font-bold">Feature</th>
                  {compare.map(id => {
                    const fest = festivals.find(f => f.id === id);
                    return <th key={id} className="px-4 py-2 font-bold">{fest?.name}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {['country', 'city', 'region', 'months', 'genres', 'audience_size', 'duration_days', 'family_friendly', 'camping', 'glamping', 'weather_profile', 'vibe', 'min_age', 'estimated_cost_usd', 'website', 'ticket_official_url'].map((key) => (
                  <tr key={key} className="border-t">
                    <td className="font-semibold px-2 py-2">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                    {compare.map(id => {
                      const fest = festivals.find(f => f.id === id);
                      let value = fest ? (fest as any)[key] : '';
                      if (Array.isArray(value)) value = value.join(', ');
                      if (key === 'estimated_cost_usd' && fest) value = `$${fest.estimated_cost_usd.min} - $${fest.estimated_cost_usd.max}`;
                      if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
                      if (key === 'website' && fest) value = <a href={fest.website} target="_blank" className="text-indigo-600 underline">Website</a>;
                      if (key === 'ticket_official_url' && fest) value = <a href={fest.ticket_official_url} target="_blank" className="text-indigo-800 underline">Tickets</a>;
                      return <td key={id} className="px-4 py-2">{value}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Festival Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map(fest => (
            <div key={fest.id} className="bg-white rounded-xl shadow hover:shadow-xl border p-5 relative flex flex-col">
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                <button
                  className={`text-xl hover:scale-125 transition ${favorites.includes(fest.id) ? 'text-yellow-400' : 'text-gray-300'}`}
                  title="Favorite"
                  onClick={() => toggleFavorite(fest.id)}>
                  ★
                </button>
                <button
                  className={`text-xs border px-2 py-1 rounded ${compare.includes(fest.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => toggleCompare(fest.id)}>
                  {compare.includes(fest.id) ? 'In Compare' : (compare.length < 3 ? 'Compare' : 'Max 3')}
                </button>
              </div>
              <a href={fest.website} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-indigo-700 hover:underline mb-2">{fest.name}</a>
              <div className="flex flex-wrap gap-2 mb-2 text-sm">
                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded">{fest.country}</span>
                <span className="bg-pink-50 text-pink-600 px-2 py-1 rounded">{fest.city}</span>
                <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">{fest.region.replace('-', ' ')}</span>
                {fest.family_friendly && <span className="bg-green-50 text-green-700 px-2 py-1 rounded">Family</span>}
                {fest.camping && <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Camping</span>}
              </div>
              <div className="text-sm text-gray-700 mb-1"><b>Genres:</b> {fest.genres.join(', ')}</div>
              <div className="text-sm text-gray-700 mb-1"><b>Months:</b> {fest.months.join(', ')}</div>
              <div className="text-sm text-gray-700 mb-1"><b>Vibe:</b> {fest.vibe.join(', ')}</div>
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded">Min age: {fest.min_age}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Duration: {fest.duration_days} days</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Audience: {fest.audience_size}</span>
              </div>
              <div className="text-lg font-bold text-indigo-900 mb-2">${fest.estimated_cost_usd.min} - ${fest.estimated_cost_usd.max}</div>
              <div className="flex-1"></div>
              <a href={fest.ticket_official_url} target="_blank" rel="noopener noreferrer" className="mt-3 w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold transition">Official Tickets</a>
            </div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center text-gray-500 mt-20 text-xl">No festivals match your filters. Try adjusting your criteria.</div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3 text-indigo-900">Your Favorites</h2>
            <div className="flex flex-wrap gap-4">
              {favorites.map(fid => {
                const fest = festivals.find(f => f.id === fid);
                if (!fest) return null;
                return (
                  <div key={fest.id} className="bg-white border px-4 py-3 rounded shadow flex items-center justify-between w-full">
                    <a href={fest.website} className="font-semibold text-indigo-700 hover:underline">{fest.name}</a>
                    <button className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded" onClick={() => toggleFavorite(fest.id)}>Remove</button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}