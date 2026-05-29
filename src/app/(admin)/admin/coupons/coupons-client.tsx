"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, 
  Loader2, Tag, Calendar, Users, HelpCircle, X, ShieldAlert 
} from "lucide-react";
import { toast } from "sonner";
import { CouponType } from "@prisma/client";

type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  couponType: CouponType;
  discountValue: number;
  minimumOrderAmountCents: number | null;
  maxDiscountCents: number | null;
  maxRedemptions: number | null;
  perUserLimit: number | null;
  redeemedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  appliesTo: string;
  appliesToIds: string[];
};

type CouponsClientProps = {
  initialCoupons: any[];
  products: any[];
  courses: any[];
};

export function CouponsClient({ initialCoupons, products, courses }: CouponsClientProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCouponId, setEditCouponId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    couponType: "PERCENTAGE",
    discountValue: 0,
    minimumOrderAmountCents: "",
    maxDiscountCents: "",
    maxRedemptions: "",
    perUserLimit: 1,
    startsAt: "",
    endsAt: "",
    appliesTo: "ALL",
    appliesToIds: [] as string[],
    isActive: true
  });

  // Usages drawer state
  const [showUsagesModal, setShowUsagesModal] = useState(false);
  const [usagesCoupon, setUsagesCoupon] = useState<Coupon | null>(null);
  const [usages, setUsages] = useState<any[]>([]);
  const [usagesLoading, setUsagesLoading] = useState(false);

  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  // Sync initialCoupons reactively
  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  // Calculated Metrics Vitals
  const totalCouponsCount = coupons.length;
  const activeCount = coupons.filter(c => c.isActive).length;
  const expiredCount = coupons.filter(c => c.endsAt && new Date(c.endsAt) < new Date()).length;
  const totalUsesCount = coupons.reduce((sum, c) => sum + c.redeemedCount, 0);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive })
      });
      if (res.ok) {
        setCoupons(prev => 
          prev.map(c => c.id === id ? { ...c, isActive: !currentActive } : c)
        );
        toast.success(`Coupon status updated successfully.`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditCouponId(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      couponType: "PERCENTAGE",
      discountValue: 0,
      minimumOrderAmountCents: "",
      maxDiscountCents: "",
      maxRedemptions: "",
      perUserLimit: 1,
      startsAt: "",
      endsAt: "",
      appliesTo: "ALL",
      appliesToIds: [],
      isActive: true
    });
    setShowFormModal(true);
  };

  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      const pad = (num: number) => String(num).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  };

  const handleOpenEdit = (c: Coupon) => {
    setIsEditing(true);
    setEditCouponId(c.id);
    setFormData({
      code: c.code,
      name: c.name,
      description: c.description || "",
      couponType: c.couponType,
      discountValue: c.couponType === "PERCENTAGE" ? c.discountValue : c.discountValue / 100,
      minimumOrderAmountCents: c.minimumOrderAmountCents ? (c.minimumOrderAmountCents / 100).toString() : "",
      maxDiscountCents: c.maxDiscountCents ? (c.maxDiscountCents / 100).toString() : "",
      maxRedemptions: c.maxRedemptions ? c.maxRedemptions.toString() : "",
      perUserLimit: c.perUserLimit || 1,
      startsAt: formatDateForInput(c.startsAt),
      endsAt: formatDateForInput(c.endsAt),
      appliesTo: c.appliesTo,
      appliesToIds: c.appliesToIds || [],
      isActive: c.isActive
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || formData.discountValue <= 0) {
      toast.error("Voucher Code, Title, and Value are required fields.");
      return;
    }

    // Convert values appropriately
    const payload = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      couponType: formData.couponType,
      discountValue: formData.couponType === "PERCENTAGE" ? formData.discountValue : Math.round(formData.discountValue * 100),
      minimumOrderAmountCents: formData.minimumOrderAmountCents ? Math.round(parseFloat(formData.minimumOrderAmountCents) * 100) : null,
      maxDiscountCents: formData.maxDiscountCents ? Math.round(parseFloat(formData.maxDiscountCents) * 100) : null,
      maxRedemptions: formData.maxRedemptions ? parseInt(formData.maxRedemptions) : null,
      perUserLimit: Number(formData.perUserLimit),
      startsAt: formData.startsAt || null,
      endsAt: formData.endsAt || null,
      appliesTo: formData.appliesTo,
      appliesToIds: formData.appliesToIds,
      isActive: formData.isActive
    };

    try {
      const url = isEditing ? `/api/admin/coupons/${editCouponId}` : "/api/admin/coupons";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isEditing ? "Coupon edited successfully!" : "Coupon created successfully!");
        setShowFormModal(false);
        // Refresh local state lists
        const syncRes = await fetch("/api/admin/coupons");
        const syncData = await syncRes.json();
        if (syncData.coupons) setCoupons(syncData.coupons);
      } else {
        toast.error(data.error || "Failed to save coupon.");
      }
    } catch {
      toast.error("Failed to connect to the server.");
    }
  };

  const handleDeleteClick = (id: string) => {
    setCouponToDelete(id);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    const id = couponToDelete;
    setCouponToDelete(null);
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons(prev => prev.filter(c => c.id !== id));
        toast.success("Coupon deleted completely.");
      } else {
        toast.error("Failed to delete coupon.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleViewUsages = async (c: Coupon) => {
    setUsagesCoupon(c);
    setShowUsagesModal(true);
    setUsagesLoading(true);
    setUsages([]);
    try {
      const res = await fetch(`/api/admin/coupons/${c.id}/usage`);
      if (res.ok) {
        const data = await res.json();
        setUsages(data.usages || []);
      }
    } catch {
      toast.error("Failed to load usages logs.");
    } finally {
      setUsagesLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      {/* Top Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Voucher Center</h1>
          <p className="text-sm text-slate-400">Design, audit, and regulate promo campaigns across course passes and digital resources.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)] shrink-0 h-11 self-start sm:self-center">
          <Plus className="h-4 w-4 mr-1.5" /> Create Coupon
        </Button>
      </div>

      {/* Premium Vitametrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Coupons", val: totalCouponsCount, color: "text-indigo-400" },
          { label: "Active Promos", val: activeCount, color: "text-emerald-400" },
          { label: "Expired Campaigns", val: expiredCount, color: "text-rose-400" },
          { label: "Total Redemptions", val: totalUsesCount, color: "text-amber-400" }
        ].map((item, idx) => (
          <Card key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md">
            <CardContent className="p-0 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{item.label}</span>
              <span className={`text-2xl font-bold tracking-tight mt-2 ${item.color}`}>{item.val}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Filter row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#090d20]/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Campaign Catalogs</h3>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code or title..."
            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 pl-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Vouchers Table */}
      {filteredCoupons.length === 0 ? (
        <Card className="bg-[#090d20]/40 border-white/5 py-12 text-center rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <Tag className="h-10 w-10 text-slate-500" />
            <h3 className="text-white text-base font-semibold">No coupons found</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {searchQuery ? "No coupons match your search queries." : "Start your study promos by adding your first voucher code."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#090d20]/60 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Voucher Code</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Scope Scope</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Redeemed</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.01] transition-colors duration-150">
                  <td className="px-6 py-4 font-mono font-bold text-white tracking-wider">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">{coupon.name}</p>
                      <p className="text-[10px] text-indigo-400">
                        {coupon.couponType === "PERCENTAGE" 
                          ? `${coupon.discountValue}% Off ${coupon.maxDiscountCents ? `(Up to ₹${coupon.maxDiscountCents / 100})` : ""}`
                          : `Flat ₹${coupon.discountValue / 100} Off`}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="text-[9px] font-mono tracking-wider border-white/10 uppercase bg-slate-900/60">
                      {coupon.appliesTo.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {coupon.isActive ? (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Active</Badge>
                    ) : (
                      <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">Disabled</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-medium">
                    {coupon.redeemedCount} {coupon.maxRedemptions ? `/ ${coupon.maxRedemptions}` : ""}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {loadingId === coupon.id ? (
                        <Loader2 className="h-4 w-4 text-indigo-400 animate-spin mr-3" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                            className="p-1 text-slate-400 hover:text-white transition"
                            title={coupon.isActive ? "Deactivate" : "Activate"}
                          >
                            {coupon.isActive ? (
                              <ToggleRight className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                          </button>
                          
                          <Button 
                            onClick={() => handleOpenEdit(coupon)}
                            size="sm" 
                            variant="ghost" 
                            className="h-8 rounded-lg hover:bg-white/5 hover:text-indigo-400 text-[10px]"
                          >
                            Edit
                          </Button>

                          <Button 
                            onClick={() => handleViewUsages(coupon)}
                            size="sm" 
                            variant="ghost" 
                            className="h-8 rounded-lg hover:bg-white/5 text-[10px] text-amber-400"
                          >
                            Logs
                          </Button>

                          <Button
                            onClick={() => handleDeleteClick(coupon.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-rose-500/10 text-rose-400"
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
      )}

      {/* Create / Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d20] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
            {/* Form Column */}
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? `Modify Campaign ${formData.code}` : "New Campaign Voucher"}
              </h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-3 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Voucher Code *</label>
                    <input
                      type="text"
                      required
                      disabled={isEditing}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase() })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      placeholder="SUPER90"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Voucher Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Grand Launch pass"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 uppercase font-semibold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Short copy explaining coupon limits..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Type</label>
                    <select
                      value={formData.couponType}
                      onChange={(e) => setFormData({ ...formData, couponType: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="PERCENTAGE" className="bg-[#090d20]">Percentage</option>
                      <option value="FIXED_AMOUNT" className="bg-[#090d20]">Flat Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">
                      {formData.couponType === "PERCENTAGE" ? "Percentage Value (%)" : "Flat Value (₹)"}
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.discountValue || ""}
                      onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Min Order value (₹)</label>
                    <input
                      type="number"
                      value={formData.minimumOrderAmountCents}
                      onChange={(e) => setFormData({ ...formData, minimumOrderAmountCents: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 299"
                    />
                  </div>
                </div>

                {formData.couponType === "PERCENTAGE" && (
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Maximum Discount cap (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscountCents}
                      onChange={(e) => setFormData({ ...formData, maxDiscountCents: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Unlimited if blank"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Global Usage Limit</label>
                    <input
                      type="number"
                      value={formData.maxRedemptions}
                      onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Per User usage limit</label>
                    <input
                      type="number"
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({ ...formData, perUserLimit: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Starts At</label>
                    <input
                      type="datetime-local"
                      value={formData.startsAt}
                      onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase tracking-wide uppercase tracking-wider block mb-1">Ends At</label>
                    <input
                      type="datetime-local"
                      value={formData.endsAt}
                      onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Scope Selection fields */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-[9px] text-slate-400 uppercase font-semibold">Coupon Scope Target</label>
                  <select
                    value={formData.appliesTo}
                    onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value, appliesToIds: [] })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL" className="bg-[#090d20]">Applies to Everything (All products & courses)</option>
                    <option value="STORE" className="bg-[#090d20]">Store Purchase only</option>
                    <option value="COURSES" className="bg-[#090d20]">Courses enrollment only</option>
                    <option value="SPECIFIC_COURSES" className="bg-[#090d20]">Specific Courses only</option>
                    <option value="SPECIFIC_PRODUCTS" className="bg-[#090d20]">Specific Store products only</option>
                  </select>
                </div>

                {/* Specific Multi Select List */}
                {formData.appliesTo === "SPECIFIC_COURSES" && (
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Select Courses</label>
                    <div className="max-h-24 overflow-y-auto border border-white/10 p-2 rounded-xl bg-white/5 space-y-1.5">
                      {courses.map(c => (
                        <label key={c.id} className="flex items-center gap-2 text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={formData.appliesToIds.includes(c.id)}
                            onChange={(e) => {
                              const ids = e.target.checked
                                ? [...formData.appliesToIds, c.id]
                                : formData.appliesToIds.filter(id => id !== c.id);
                              setFormData({ ...formData, appliesToIds: ids });
                            }}
                            className="rounded border-white/10 bg-transparent text-indigo-600 focus:ring-indigo-500"
                          />
                          {c.title}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.appliesTo === "SPECIFIC_PRODUCTS" && (
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] text-slate-400 uppercase font-semibold">Select Products</label>
                    <div className="max-h-24 overflow-y-auto border border-white/10 p-2 rounded-xl bg-white/5 space-y-1.5">
                      {products.map(p => (
                        <label key={p.id} className="flex items-center gap-2 text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={formData.appliesToIds.includes(p.id)}
                            onChange={(e) => {
                              const ids = e.target.checked
                                ? [...formData.appliesToIds, p.id]
                                : formData.appliesToIds.filter(id => id !== p.id);
                              setFormData({ ...formData, appliesToIds: ids });
                            }}
                            className="rounded border-white/10 bg-transparent text-indigo-600 focus:ring-indigo-500"
                          />
                          {p.title}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="px-4 py-2 border border-white/10 text-slate-300 rounded-lg text-xs hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    {isEditing ? "Save Changes" : "Deploy Coupon"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="w-full md:w-56 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
              <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider mb-3 text-left">Live Preview Card</span>
              <div className="border border-white/10 bg-white/5 rounded-2xl p-4 space-y-4 shadow-lg text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                <div className="h-10 w-10 mx-auto bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                  <Tag className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-base font-extrabold text-white tracking-widest uppercase">
                    {formData.code || "VOUCHERCODE"}
                  </p>
                  <p className="text-[10px] text-indigo-300 font-semibold">
                    {formData.couponType === "PERCENTAGE" 
                      ? `${formData.discountValue || 0}% Discount` 
                      : `Flat ₹${formData.discountValue || 0} Discount`}
                  </p>
                </div>
                <div className="border-t border-white/5 pt-3 text-[10px] text-slate-400 space-y-1">
                  <p className="text-white font-medium truncate">{formData.name || "Launch offer title"}</p>
                  <p>Min order: ₹{formData.minimumOrderAmountCents || 0}</p>
                  <Badge variant="outline" className="text-[8px] font-mono border-white/10 scale-90 uppercase mt-1">
                    {formData.appliesTo.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Usage Detail Drawer Modal */}
      {showUsagesModal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d20] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                <span>Redemptions audit: {usagesCoupon?.code}</span>
              </h3>
              <button onClick={() => setShowUsagesModal(false)} className="text-slate-400 hover:text-white p-1 rounded-full">
                <X className="h-4 w-4" />
              </button>
            </div>

            {usagesLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-500">Retrieving usage history...</p>
              </div>
            ) : usages.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                <ShieldAlert className="h-8 w-8 text-slate-600 mx-auto mb-2.5" />
                No users have redeemed this voucher campaign yet.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[50vh]">
                {usages.map((u, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs">
                    <div className="space-y-1 text-left">
                      <p className="font-bold text-white">{u.userName}</p>
                      <p className="text-[10px] text-slate-400">{u.userEmail}</p>
                      <p className="text-[9px] font-mono text-slate-500">
                        {new Date(u.usedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold font-mono">
                        -₹{(u.discountCents / 100).toFixed(0)}
                      </Badge>
                      <p className="text-[9px] text-slate-400">
                        {u.orderId ? `Order: ${u.orderId.slice(0, 8)}` : `Course ID: ${u.enrollmentId?.slice(0, 8)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              <Button onClick={() => setShowUsagesModal(false)} size="sm" className="bg-white/10 text-white hover:bg-white/5 rounded-lg px-4">
                Close Logs
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {couponToDelete && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d20] border border-red-500/20 rounded-2xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.15)] relative animate-in fade-in zoom-in duration-200 text-left overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <h3 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping inline-block" />
              Delete Campaign Voucher?
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to delete this coupon? This deletes the coupon code, invalidates active vouchers, and drops usage ledger listings forever.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCouponToDelete(null)}
                className="flex-1 rounded-xl h-11 border-slate-800 hover:bg-slate-900 bg-transparent text-sm font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl h-11 text-sm shadow-[0_0_15px_rgba(239,68,68,0.25)] border-0"
              >
                Delete Voucher
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
