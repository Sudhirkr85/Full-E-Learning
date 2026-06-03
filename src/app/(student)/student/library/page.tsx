import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeMetadata } from "@/lib/site";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, Calendar, Package } from "lucide-react";

export const metadata: Metadata = makeMetadata({
  title: "My Library | Bookshelf",
  description: "Browse and read your unlocked secure PDF books and learning resources.",
  path: "/student/library",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function StudentLibraryPage() {
  const session = await getSession();

  // Enforce logged in STUDENT role
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch all purchased book/resource items (DIGITAL_RESOURCE or PHYSICAL) for the user from successful orders
  const purchasedBooks = await prisma.orderItem.findMany({
    where: {
      order: {
        userId: session.user.id,
        status: "PAID"
      },
      OR: [
        { productType: "DIGITAL_RESOURCE" },
        { productType: "PHYSICAL" },
        {
          product: {
            assetUrl: { not: null }
          }
        }
      ]
    },
    include: {
      product: true,
      order: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // Helper to generate dynamic harmonic book cover gradients
  const getCoverGradient = (title: string) => {
    const gradients = [
      "from-violet-600 to-indigo-800",
      "from-cyan-600 to-blue-800",
      "from-emerald-600 to-teal-800",
      "from-pink-600 to-purple-800",
      "from-amber-600 to-rose-800",
    ];
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="space-y-6 select-none text-slate-100 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">My Library</h1>
        <p className="text-sm text-slate-400">Your secure bookshelf of purchased digital PDF books and physical learning resources.</p>
      </div>

      {purchasedBooks.length === 0 ? (
        /* Empty Bookshelf State */
        <Card className="bg-white/5 border border-white/10 py-16 text-center rounded-2xl backdrop-blur-md">
          <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto px-4">
            <div className="h-14 w-14 rounded-full bg-slate-900 border border-white/5 text-slate-600 flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-indigo-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-white text-base font-semibold">Your bookshelf is empty</h3>
              <p className="text-xs text-slate-500">
                Premium digital guides and reference books purchased from our store will appear here for instant, secure reading.
              </p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-2 h-10 text-xs font-bold uppercase tracking-wider shadow-lg" asChild>
              <Link href="/store">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Book Store
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        /* Bookshelf Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {purchasedBooks.map((item) => {
            const product = item.product;
            const coverGradient = getCoverGradient(item.productName);
            const purchaseDate = new Date(item.order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            });

            const hasCoverImage = !!product?.coverImageUrl;
            const isPhysical = item.productType === "PHYSICAL";
            const hasDigitalAsset = !!product?.assetUrl;

            return (
              <Card
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group"
              >
                <div>
                  {/* Visual Premium Book Spine / Thumbnail */}
                  <div className={`h-48 w-full ${hasCoverImage ? "" : `bg-gradient-to-br ${coverGradient}`} relative p-5 flex flex-col justify-between overflow-hidden shadow-inner`}>
                    {hasCoverImage && (
                      <img
                        src={product.coverImageUrl!}
                        alt={item.productName}
                        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {/* Gloss / Light reflection overlay */}
                    <div className={`absolute inset-0 ${hasCoverImage ? "bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-black/20" : "bg-gradient-to-tr from-transparent via-white/5 to-white/10"} z-0 pointer-events-none`}></div>

                    <div className="flex justify-between items-start z-10">
                      <span className={`backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-widest uppercase ${isPhysical ? "bg-amber-500/20 border-amber-400/30 text-amber-300" : "bg-white/10 border-white/10"}`}>
                        {isPhysical ? "Physical Book" : "Secure PDF"}
                      </span>
                      {isPhysical ? (
                        <Package className="h-5 w-5 text-amber-400/60 group-hover:scale-110 transition duration-300" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-white/60 group-hover:scale-110 transition duration-300" />
                      )}
                    </div>

                    <div className="z-10 space-y-1">
                      <p className="text-white font-mono text-[9px] tracking-wider uppercase opacity-60">
                        {isPhysical ? "Physical Resource" : "Digital Resource"}
                      </p>
                      <h3 className="text-white text-base font-extrabold tracking-tight leading-tight line-clamp-2 drop-shadow-md">
                        {item.productName}
                      </h3>
                    </div>
                  </div>

                  {/* Book Metadata & Description */}
                  <CardContent className="p-5 space-y-3">
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {product?.description ? product.description : "Comprehensive companion guidebook and placement-ready technical reference manual."}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{isPhysical ? "Purchased" : "Unlocked"}: {purchaseDate}</span>
                    </div>
                  </CardContent>
                </div>

                {/* Read / Status Actions */}
                <div className="p-5 pt-0">
                  {isPhysical && !hasDigitalAsset ? (
                    /* Physical book with no digital copy — show shipping note */
                    <div className="w-full bg-amber-500/10 border border-amber-400/20 text-amber-300 rounded-xl text-xs font-semibold h-11 flex items-center justify-center gap-1.5 px-4">
                      <Package className="h-4 w-4 shrink-0" />
                      <span>Physical copy — check My Orders for shipping</span>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider h-11 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.25)] transition duration-300"
                      asChild
                    >
                      <Link href={`/student/orders/${item.orderId}/pdf-viewer?productId=${item.productId}`}>
                        <BookOpen className="h-4 w-4" />
                        Read Book
                      </Link>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
