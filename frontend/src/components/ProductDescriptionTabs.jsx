import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductReviews from "./ProductReviews";

export default function ProductDescriptionTabs({ product }) {
  return (
    <section className="mt-24 mb-30">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="h-auto rounded-none border bg-transparent p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-r px-8 py-4 text-sm data-[state=active]:bg-white data-[state=active]:shadow-none"
          >
            Description
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="rounded-none px-8 py-4 text-sm data-[state=active]:bg-white data-[state=active]:shadow-none"
          >
            Reviews ({product.numReviews})
          </TabsTrigger>
        </TabsList>

        <div className="border border-t-0 p-8 text-sm leading-7 text-gray-600">
          <TabsContent value="description" className="mt-0 space-y-5">
            <p>{product.description}</p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <ProductReviews product={product} />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
