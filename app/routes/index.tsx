import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import { Hero } from "~/components/Hero";
import { ProductsHighlights } from "~/components/ProductHighlights";
import { FadeIn } from "~/components/shared/FadeIn";
import type { GetArticlesQuery } from "~/generated/graphql";
import { getArticles } from "~/providers/pages/articles";
import { getWishlist } from "~/providers/products/products";
import { getImageAspectRatio } from "~/shared/utils/getImageAspectRatio";
import type { Product } from "~/types";
type LoaderData = {
  wishlist: string[];
  resources: GetArticlesQuery["articles"]["edges"][number]["node"][];
};

export const loader: LoaderFunction = async ({ request }) => {
  const wishlist = await getWishlist(request);
  const resourcesResponse = await getArticles(
    3,
    "blog_title:'Resurse gratuite pentru dezvoltarea și educația copilului'"
  );
  const resources = resourcesResponse.articles.edges.map(({ node }) => node);
  return json({ wishlist, resources });
};

const Index: React.FC = () => {
  const { wishlist, resources } = useLoaderData<LoaderData>();

  const { products } = useOutletContext<{ products: Product[] }>();

  if (!products) return null;
  return (
    <FadeIn>
      <Hero />
      <ProductsHighlights
        wishlist={wishlist}
        products={products
          .filter((product) => product.availableForSale)
          .slice(0, 3)}
      />
      <section className="mx-auto mt-10 max-w-7xl px-5 lg:px-8 xl:px-20">
        <h3 className="mb-7 text-center text-3xl leading-tight text-primary">
          Resurse gratuite
        </h3>
        <p className="text-center">Pentru dezvoltarea copilului</p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {resources.map((resource) => {
            return (
              <Link
                to={`/blog/${resource.blog.handle}/${resource.handle}`}
                key={resource.id}
                className="mb-5"
              >
                <div className={getImageAspectRatio(resource.image)}>
                  <img
                    src={resource.image?.url}
                    alt={
                      resource.image?.altText ??
                      "cursor-pointer object-cover object-center"
                    }
                  />
                </div>
                <h4 className="mt-3 text-center text-xl leading-tight text-primary">
                  {resource.title}
                </h4>
              </Link>
            );
          })}
        </div>
      </section>
    </FadeIn>
  );
};

export default Index;
