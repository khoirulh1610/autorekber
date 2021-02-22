<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Fee;
use Str;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request,$urlkey)
    {
        $data = Transaction::where('urlkey',$urlkey??'')->first(); 
        $secret_code = false;
        if ($data) {
            $secret_code = $data->secret_code;
        }       
        return view('welcome',compact('secret_code'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // return $request->all();
        // $validatedData = $request->validate([
        //     'type' => ['required'],
        //     '_name' => ['required'],
        // ],
        // [
        //     'type.required' => 'Type is required',
        //     '_name.required' => 'Nama harus diisi',
        // ]);
       
        if($request->type=='Seller'){
            $transaction = new Transaction();
            $transaction->seller_name = $request->_name;
            $transaction->seller_whatsapp = $request->_whatsapp;
            $transaction->type_produk = $request->type_produk;
            $transaction->nama_produk = $request->nama_produk;
            $harga_produk=str_replace('.', '', $request->harga_produk);
            $harga_produk=str_replace(',', '', $harga_produk);
            $transaction->harga_produk = $harga_produk;
            $fee = Fee::where('batas_fee','>',$harga_produk)->orderBy('batas_fee','asc')->first();
            $nilai_fee = $fee->nilai==1?($harga_produk*1/100):$fee->nilai;
            $transaction->fee = $nilai_fee>600000?600000:$nilai_fee;
            $urlkey = Str::random(6);  
            $transaction->urlkey = $urlkey;            
            $transaction->save();
            $secret_code = 'Rekber#'.$transaction->id;
            $transaction->secret_code = $secret_code;
            // $transaction->admin_whatsapp = '082143524920';
            $transaction->status = 'N';
            $transaction->message = 'Selamat datang Kak ini adalah link untuk pembeli / Buyer : '.url($urlkey)."#cta";
            $transaction->save();
            return redirect()->to(url($urlkey)."#cta");

        }else{
            $transaction = Transaction::where('secret_code',$request->secret_code)->where('status','G')->whereNull('buyer_name')->first();
            if($transaction){
                $transaction->buyer_name = $request->_name;
                $transaction->buyer_whatsapp = $request->_whatsapp;                
                $transaction->message = 
                "Hallo kak, Perkenalkan saya adalah *BOT* yang akan membantu transaksi jual beli kakak sekalian dengan *Aman dan Nyaman*\r\n".
                "Berikut ini rincian produk yang sudah diisi melalui form pada website \r\n".url('/')."\r\n".
                "===Seller==\r\n\r\n".
                "Nama : ".$transaction->seller_name."\r\n".
                "Whatsapp : ".$transaction->seller_whatsapp."\r\n".
                "Nama Produk : ".$transaction->nama_produk."\r\n".
                "Type Produk : ".$transaction->type_produk."\r\n".
                "Harga Produk : Rp.".number_format($transaction->harga_produk)."\r\n\r\n".
                "===Buyer==="."\r\n\r\n".
                "Nama : ".$request->_name."\r\n".
                "Whatsapp :".$request->_whatsapp;
                $transaction->save();
                return redirect()->back();
            }
        }
        return redirect()->back();
    }

    public function cekwa(Request $request)
    {
        if(strlen($request->phone) >= 10 ){
            $Contact = Contact::where('phone',$request->phone)->first();
            if(!$Contact){
                $Contact = new Contact();
                $Contact->phone = $request->phone;
                $Contact->save();
            }            
            $x=0;
            while ($x <= 30) {
                $Contact = Contact::where('phone',$request->phone)->where('status','<>','N')->first();
                if($Contact){
                    $x=30;
                }else{
                    sleep(1);
                    $x++;
                }                
            }
            if($Contact){
                return array('phone'=>$request->phone,'is_whatsapp'=>$Contact->wa==1?true:false,'whatsapp'=>'');
            }
            return array('phone'=>$request->phone,'is_whatsapp'=>null,'whatsapp'=>'Not Runing');
        }else{
            return array('phone'=>$request->phone,'is_whatsapp'=>null,'whatsapp'=>'');
        }
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
