import EditOrderPageClient from "./EditOrderPageClient";

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <EditOrderPageClient orderId={orderId} />;
}
