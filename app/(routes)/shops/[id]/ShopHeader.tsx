export function ShopHeader({ shop }: any) {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="capitalize text-2xl">{shop.name}</h1>
      <p className="text-gray-600">{shop.description}</p>
    </section>
  );
}
