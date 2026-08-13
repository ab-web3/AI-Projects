import React, { useState } from 'react';
import { ResourceItem, ResourceCategory } from '../types';
import {
  BookOpen,
  Search,
  Download,
  FileText,
  Bookmark,
  BookmarkCheck,
  Eye,
  Tag,
  CheckCircle2,
  Sparkles,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';

interface ResourceVaultProps {
  resources: ResourceItem[];
}

export const ResourceVault: React.FC<ResourceVaultProps> = ({ resources }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(
    resources.reduce((acc, r) => ({ ...acc, [r.id]: r.downloadCount }), {})
  );
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const categories: (ResourceCategory | 'All')[] = [
    'All',
    'AI & Tech',
    'Pedagogy',
    'Research & Grants',
    'OBE & Assessment',
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bId) => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleDownload = (res: ResourceItem) => {
    setDownloadCounts((prev) => ({
      ...prev,
      [res.id]: (prev[res.id] || res.downloadCount) + 1,
    }));

    // Trigger dummy download file creation
    const dummyContent = `FDP 2026 OFFICIAL RESOURCE:\n\nTitle: ${res.title}\nCategory: ${res.category}\nAuthor: ${res.author}\nDate: ${res.dateAdded}\n\n${res.description}\n\nPREVIEW SNIPPET:\n${res.previewText || 'Full material included in FDP participant vault.'}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${res.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Downloaded "${res.title}" successfully!`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PPTX':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DOCX':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ZIP':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center space-x-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Hero Vault Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              FDP Repository
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">Faculty Resource Vault</h2>
            <p className="text-slate-300 text-xs max-w-xl">
              Download lecture slides, macro-enabled OBE calculation templates, AI prompt guides, and grant proposal master documents curated by FDP experts.
            </p>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center min-w-[180px]">
            <p className="text-xs text-slate-400">Total Materials</p>
            <p className="text-2xl font-bold text-indigo-300">{resources.length} Modules</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{bookmarkedIds.length} Saved Bookmarks</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guide, author, or keyword..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-bold text-sm">No resources found</p>
            <p className="text-slate-500 text-xs">Try selecting a different category or clearing your search query.</p>
          </div>
        ) : (
          filteredResources.map((res) => {
            const isBookmarked = bookmarkedIds.includes(res.id);
            const currentDownloads = downloadCounts[res.id] || res.downloadCount;

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-indigo-200"
              >
                <div className="space-y-3">
                  {/* Category & Format Tag */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {res.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getFormatBadge(
                          res.format
                        )}`}
                      >
                        {res.format}
                      </span>
                      <button
                        onClick={() => toggleBookmark(res.id)}
                        className={`p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer ${
                          isBookmarked ? 'text-amber-500' : 'text-slate-400'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{res.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {res.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer stats & Download Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>By {res.author}</span>
                    <span>{res.fileSize} • {currentDownloads} downloads</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreviewResource(res)}
                      className="flex-1 py-1.5 px-3 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownload(res)}
                      className="flex-1 py-1.5 px-3 bg-indigo-600 text-white font-bold rounded-lg text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resource Document Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  {previewResource.category} • {previewResource.format} ({previewResource.fileSize})
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{previewResource.title}</h3>
                <p className="text-xs text-slate-500">Author: {previewResource.author} • Added: {previewResource.dateAdded}</p>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-indigo-700">
                Document Overview
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {previewResource.description}
              </p>

              {previewResource.previewText && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900">Sample Excerpt / Template Snippet</h4>
                  <pre className="text-xs font-mono bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {previewResource.previewText}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewResource);
                  setPreviewResource(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
