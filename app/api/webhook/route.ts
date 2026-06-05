// app/api/webhook/route.ts
import { supabase } from '@/lib/supabase'; // Ajusta la ruta a tu cliente de supabase

export async function POST(req: Request) {
  const body = await req.json();
  
  // Mercado Pago envía el ID del pago
  if (body.type === 'payment' && body.data.id) {
    // Consultamos a Mercado Pago para confirmar que el pago es real
    const payment = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
      headers: { Authorization: `Bearer TU_ACCESS_TOKEN` }
    }).then(res => res.json());

    // Actualizamos el pedido en Supabase
    await supabase
      .from('pedidos_web')
      .update({ estado: 'pagado' })
      .eq('id', payment.external_reference);
  }
  
  return new Response(null, { status: 200 });
}