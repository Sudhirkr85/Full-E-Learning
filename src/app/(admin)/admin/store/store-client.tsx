"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, ToggleLeft, ToggleRight, Plus, Search, Loader2, PackageOpen } from "lucide-react";
import { ProductStatus, ProductType } from "@prisma/client";
import { deleteProductAction, toggleProductStatusAction } from "./actions";

type StoreClientProps = {
  initialProducts: any[];
};

export function StoreClient({ initialProducts }: StoreClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Sync products state if initialProducts changes
  if (JSON.stringify(products.map(p => p.id + p.status)) !== JSON.stringify(initialProducts.map(p => p.id + p.status))) {
    setProducts(initialProducts);
  }

  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const targetId = productToDelete;
    setProductToDelete(null);
    setLoadingProductId(targetId);
    try {
      const res = await deleteProductAction(targetId);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== targetId));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleToggleStatus = async (productId: string, currentStatus: ProductStatus) => {
    setLoadingProductId(productId);
    try {
      const res = await toggleProductStatusAction(productId, currentStatus);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, status: currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED" }
              : p
          )
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProductId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === "ALL" || product.productType === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: ProductType) => {
    switch (type) {
      case "DIGITAL_RESOURCE":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">PDF Book</Badge>;
      case "PHYSICAL":
        return <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">Physical Product</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Active</Badge>;
      case "DRAFT":
      default:
        return <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Store Catalog</h1>
          <p className="text-sm text-slate-400">Manage premium in-app PDF books and physical merchandise catalog.</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)] shrink-0 h-11 self-start sm:self-center">
          <Link href="/admin/store/new" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {/* Filter Tabs and Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#090d20]/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "DIGITAL_RESOURCE", "PHYSICAL"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTypeFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-200 ${
                selectedTypeFilter === tab
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30"
                  : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              {tab === "ALL" && "All Items"}
              {tab === "DIGITAL_RESOURCE" && "PDF Books"}
              {tab === "PHYSICAL" && "Physical Products"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by product name..."
            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 pl-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Catalog Table */}
      {filteredProducts.length === 0 ? (
        <Card className="bg-[#090d20]/40 border-white/5 py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <PackageOpen className="h-10 w-10 text-slate-500" />
            <h3 className="text-white text-base font-semibold">No products found</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {searchQuery || selectedTypeFilter !== "ALL"
                ? "No items match your active filters or search terms."
                : "Your store shelf is currently empty. Create your very first catalog offering."}
            </p>
            {(!searchQuery && selectedTypeFilter === "ALL") && (
              <Button asChild className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl mt-2">
                <Link href="/admin/store/new">Add first product</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/5 bg-[#090d20]/60 backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                    <td className="px-6 py-4 font-semibold text-white max-w-xs truncate">
                      {product.title}
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(product.productType)}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-white">
                      ₹{(product.priceCents / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 text-center font-mono">
                      {product.productType === "PHYSICAL" ? product.stockQuantity ?? 0 : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {loadingProductId === product.id ? (
                          <Loader2 className="h-4.5 w-4.5 text-indigo-400 animate-spin mr-4" />
                        ) : (
                          <>
                            {/* Publish/Unpublish toggle icon button */}
                            <button
                              onClick={() => handleToggleStatus(product.id, product.status)}
                              title={product.status === "PUBLISHED" ? "Switch to Draft" : "Switch to Active"}
                              className="text-slate-400 hover:text-white p-1.5 transition-colors duration-150"
                            >
                              {product.status === "PUBLISHED" ? (
                                <ToggleRight className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <ToggleLeft className="h-5 w-5" />
                              )}
                            </button>

                            {/* Edit button */}
                            <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5 hover:text-indigo-400">
                              <Link href={`/admin/store/${product.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>

                            {/* Delete button */}
                            <Button
                              onClick={() => handleDeleteClick(product.id)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-slate-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="block md:hidden space-y-4 px-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-4 hover:border-white/10 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">Catalog Offering</span>
                    <div>{getTypeBadge(product.productType)}</div>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-relaxed pt-1">
                    {product.title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium block">Price</span>
                    <span className="text-white font-bold font-mono text-sm">
                      ₹{(product.priceCents / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium block">Status</span>
                    <div>{getStatusBadge(product.status)}</div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-slate-400 font-medium">Inventory Stock:</span>
                    <span className="text-slate-200 font-bold font-mono ml-2">
                      {product.productType === "PHYSICAL" ? product.stockQuantity ?? 0 : "Unlimited (Digital)"}
                    </span>
                  </div>
                </div>

                {/* Mobile tap actions row */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      title={product.status === "PUBLISHED" ? "Switch to Draft" : "Switch to Active"}
                      className="text-slate-400 hover:text-white p-2 transition-colors duration-150"
                    >
                      {product.status === "PUBLISHED" ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
                          <ToggleRight className="h-5.5 w-5.5" /> Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold font-mono">
                          <ToggleLeft className="h-5.5 w-5.5" /> Draft
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {loadingProductId === product.id ? (
                      <Loader2 className="h-5 w-5 text-indigo-400 animate-spin mr-2" />
                    ) : (
                      <>
                        <Button asChild size="sm" className="h-9 px-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-wider gap-1.5 flex items-center justify-center">
                          <Link href={`/admin/store/${product.id}`}>
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(product.id)}
                          size="sm"
                          variant="ghost"
                          className="h-9 w-9 p-0 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-slate-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Centered Glassmorphic Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d20] border border-red-500/20 rounded-2xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.15)] relative animate-in fade-in zoom-in duration-200 text-left overflow-hidden">
            {/* Top red laser glow bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            
            <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping inline-block" />
              Delete Product Offering?
            </h3>
            
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to delete this product? This action is permanent, completely clears the product details, and cannot be undone.
            </p>
            
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProductToDelete(null)}
                className="flex-1 rounded-xl h-11 border-slate-800 hover:bg-slate-900 bg-transparent text-sm font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl h-11 text-sm shadow-[0_0_15px_rgba(239,68,68,0.25)] border-0"
              >
                Delete Offering
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
