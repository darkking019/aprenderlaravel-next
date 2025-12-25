<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {Schema::create('payments', function (Blueprint $table) {
    $table->id();

    $table->string('provider'); // mercadopago
    $table->string('payment_id')->unique(); // id do pagamento no MP
    $table->string('external_reference')->index();

    $table->string('status'); // pending | approved | rejected
    $table->decimal('amount', 10, 2);

    $table->json('payload'); // resposta completa do MP

    $table->timestamps();
});

       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
