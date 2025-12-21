<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\MercadoPagoConfig;

class MercadoPagoController extends Controller
{
    public function __construct()
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));

        // Nome exato (com o typo oficial):
        MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    }

    /**
     * Cria preferência de pagamento (V0)
     */
    public function createEventPayment(Request $request)
    {
        // DEBUG CRÍTICO
        if (!config('services.mercadopago.access_token')) {
            return response()->json([
                'error' => 'MercadoPago access token não configurado'
            ], 500);
        }

        $client = new PreferenceClient();

        // V0 SIMPLES, ESTÁVEL E ACEITO PELO MP
        $frontendUrl = config('services.frontend.url'); // evita usar env() direto

        $preference = [
            'items' => [
                [
                    'title' => 'Inscrição no evento',
                    'quantity' => 1,
                    'unit_price' => 50.00,
                    'currency_id' => 'BRL',
                ]
            ],

            'back_urls' => [
                'success' => $frontendUrl . '/pagamento/sucesso',
                'failure' => $frontendUrl . '/pagamento/erro',
                'pending' => $frontendUrl . '/pagamento/pendente',
            ],

            'notification_url' => config('app.url') . '/api/mercado-pago/webhook',

            'auto_return' => 'approved',
            'external_reference' => 'create_event_v0',
        ];

        try {
            $response = $client->create($preference);

            return response()->json([
                'init_point' => $response->init_point,
                'id' => $response->id,
            ]);

        } catch (\MercadoPago\Exceptions\MPApiException $e) {

            // DEBUG REAL (não o genérico do SDK)
            Log::error('MercadoPago API error', [
                'status' => $e->getApiResponse()->getStatusCode(),
                'response' => $e->getApiResponse()->getContent(),
            ]);

            return response()->json([
                'message' => 'Erro Mercado Pago',
                'status'  => $e->getApiResponse()->getStatusCode(),
                'error'   => $e->getApiResponse()->getContent(),
            ], 500);
        }
    }

    /**
     * Webhook Mercado Pago
     */
    public function webhook(Request $request)
    {
        // MP manda topic OU type (varia)
        if (
            $request->query('type') !== 'payment' &&
            $request->query('topic') !== 'payment'
        ) {
            return response()->json(['status' => 'ignored']);
        }

        $paymentId = data_get($request->all(), 'data.id');

        if (!$paymentId) {
            return response()->json(['status' => 'no_payment_id']);
        }

        try {
            $paymentClient = new PaymentClient();
            $payment = $paymentClient->get($paymentId);
        } catch (\Exception $e) {
            Log::error('Erro ao buscar pagamento', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'payment_fetch_error'
            ], 500);
        }

        if ($payment->status !== 'approved') {
            return response()->json([
                'status' => 'not_approved',
                'payment_status' => $payment->status
            ]);
        }

        // V0: valida só a referência
        if (!str_starts_with($payment->external_reference ?? '', 'create_event')) {
            return response()->json(['status' => 'invalid_reference']);
        }

        /*
         * A PARTIR DAQUI:
         * - salvar pagamento no banco
         * - criar evento real
         * - associar user
         */

        return response()->json([
            'status'     => 'payment_approved',
            'payment_id' => $paymentId,
        ]);
    }
}
