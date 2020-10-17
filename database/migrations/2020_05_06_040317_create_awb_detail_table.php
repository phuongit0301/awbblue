<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAwbDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('awb_detail', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('awb');
            $table->string('agent');
            $table->float('weight', 8, 2);
            $table->jsonb('image_link');
            $table->integer('total_piece');
            $table->index(['awb', 'agent']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('awb_detail');
    }
}
