"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FileText,
  Trash2,
  ExternalLink,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

interface DocumentItem {
  id: string;
  title: string;
  desc: string;
  category: "FAQ" | "Policy" | "Rooms" | "Maintenance" | "Services" | "Internal";
  updated: string;
  chunks: number;
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Hotel FAQs",
    desc: "Frequently asked questions about our hotel, check-in, and amenities",
    category: "FAQ",
    updated: "Aug 28, 2026",
    chunks: 14,
  },
  {
    id: "doc-2",
    title: "Booking Policy",
    desc: "Cancellation, refunds, modification, and payment terms",
    category: "Policy",
    updated: "Aug 20, 2026",
    chunks: 9,
  },
  {
    id: "doc-3",
    title: "Room Information",
    desc: "Specifications and pricing for Deluxe Room, Tech Suite, and Penthouse",
    category: "Rooms",
    updated: "Aug 18, 2026",
    chunks: 18,
  },
  {
    id: "doc-4",
    title: "Maintenance Guide",
    desc: "Standard operating procedures for HVAC errors, Wi-Fi, and smart IoT fixes",
    category: "Maintenance",
    updated: "Aug 15, 2026",
    chunks: 22,
  },
  {
    id: "doc-5",
    title: "Restaurant Information",
    desc: "Culinary menus, chef hours, and in-room dining dispatch SLA",
    category: "Services",
    updated: "Aug 10, 2026",
    chunks: 8,
  },
  {
    id: "doc-6",
    title: "Company Handbook",
    desc: "Internal staff operations, VIP escalation thresholds, and audit rules",
    category: "Internal",
    updated: "Aug 5, 2026",
    chunks: 35,
  },
];

export default function KnowledgePage() {
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredDocs = docs.filter((d) => {
    if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !d.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <AdminHeader
        title="Knowledge Base (RAG)"
        subtitle="Manage vectorized documents for grounded AI responses"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Company Knowledge & SOPs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Parsed, normalized, and indexed into Supabase pgvector embeddings.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document</span>
          </button>
        </div>

        {/* Search & Category Filter Row */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, policies, SOPs..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="FAQ">FAQ</option>
              <option value="Policy">Policy</option>
              <option value="Rooms">Rooms</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Services">Services</option>
              <option value="Internal">Internal</option>
            </select>
          </div>
        </div>

        {/* Knowledge Documents Table (Matching Screen 6 in mockup) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-4 px-6">Document Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Vector Chunks</th>
                  <th className="py-4 px-6">Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-indigo-50/40 transition-colors"
                  >
                    {/* Title & Desc */}
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {doc.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 max-w-md">
                            {doc.desc}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {doc.category}
                      </span>
                    </td>

                    {/* Chunks */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {doc.chunks} chunks
                      </span>
                    </td>

                    {/* Updated */}
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {doc.updated}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => alert(`View chunks for ${doc.title}`)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Document Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Upload Knowledge Document
              </h3>
              <p className="text-xs text-slate-500">
                Uploaded PDFs or Markdown documents are automatically split into 500-token chunks and embedded with text-embedding-3-small.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 block">
                  Click to choose a file (.pdf, .txt, .md)
                </span>
                <span className="text-[10px] text-slate-400">
                  Maximum file size: 10MB
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Document ingested and vector embeddings generated!");
                    setIsUploadOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Ingest to Vector DB
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

