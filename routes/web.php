<?php

use Illuminate\Support\Facades\Route;
use App\Models\Transaction;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



// Auth::routes();

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Auth::routes();

// Route::get('/home', function() {
//     return view('home');
// })->name('home')->middleware('auth');

Route::middleware(['auth'])->group(function () {
    Route::get('/home', function () {
        return view('home');
    });

    Route::get('transaction',[App\Http\Controllers\TransactionController::class,'index']);
});

Route::get('/{urlkey?}', function ($urlkey = null)
{
    $data = Transaction::where('urlkey',$urlkey??'')->first(); 
        $secret_code = false;
        if ($data) {
            $secret_code = $data->secret_code;
        }       
    return view('welcome',compact('secret_code'));
});