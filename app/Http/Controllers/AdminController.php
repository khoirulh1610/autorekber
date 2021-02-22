<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;

class AdminController extends Controller
{
    public function whatsapp(Request $request)
    {
        $admin = Admin::get();
        return view('admin.whatsapp',compact('admin'));
    }
}
