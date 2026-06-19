import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Clave de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-3381176844530260-060510-d05fe2b52d4563444e0c8c084cdb42d0-9565196' });

export async function POST(req: Request) {
  try {
    const { items, idPedido } = await req.json();

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map((i: any) => ({
          title: i.producto.nombre,
          quantity: i.cantidad,
          unit_price: Number(i.producto.precio),
        })),
        // CONFIGURACIÓN CLAVE: Agregamos el retorno automático y las respuestas de estado
        back_urls: {
          success: "https://controlcelmendoza.com.ar/?status=approved", 
          failure: "https://controlcelmendoza.com.ar/?status=failure",
          pending: "https://controlcelmendoza.com.ar/?status=pending",
        },
        auto_return: "approved", // Fuerza a Mercado Pago a redireccionar al instante al terminar de pagar
        external_reference: String(idPedido), 
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear la preferencia' }, { status: 500 });
  }
}