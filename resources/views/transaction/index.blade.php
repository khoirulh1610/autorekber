@extends('adminlte::page')

@section('title', ENV('APP_NAME','AUTOREKBER'))

@section('content_header')
    <h1 class="m-0 text-dark">Transaction List</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead>
                            <th>Secret Code</th>
                            <th>Seller</th>
                            <th>Seller Whatsapp</th>
                            <th>Produk</th>
                            <th>Price</th>
                            <th>Buyer</th>
                            <th>Buyer Whatsapp</th>
                            <th>Status</th>
                            <th></th>
                        </thead>
                        <tbody>
                            @foreach ($Transaction as $item)
                                <tr>
                                    <td>{{$item->secret_code}}</td>
                                    <td>{{$item->seller_name}}</td>
                                    <td>{{$item->seller_whatsapp}}</td>
                                    <td>{{$item->nama_produk}}</td>
                                    <td>{{number_format($item->harga_produk)}}</td>
                                    <td>{{$item->buyer_name}}</td>
                                    <td>{{$item->buyer_whatsapp}}</td>
                                    <td>{{$item->status=='G'?'New':$item->status}}</td>
                                    <td>
                                        <ul class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                              Action
                                            </a>
                                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                              <a class="dropdown-item" href="{{url('transaction/show/'.$item->id)}}">Detail</a>
                                              <a class="dropdown-item" href="{{url('transaction/edit/'.$item->id)}}">Edit</a>
                                              <div class="dropdown-divider"></div>
                                              <a class="dropdown-item" href="{{url('transaction/delete/'.$item->id)}}">Delete</a>
                                            </div>
                                        </ul>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@stop
