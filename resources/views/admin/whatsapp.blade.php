@extends('adminlte::page')

@section('title', ENV('APP_NAME','AUTOREKBER'))

@section('content_header')
    <h1 class="m-0 text-dark">Whatsapp Admin</h1>
@stop

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <button class="btn btn-success"><i class="fa fa-plus"></i> </button>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-bordered">
                        <thead>
                            <th>ID</th>
                            <th>No Whatsapp</th>
                            <th>Nama</th>
                            <th>Status</th>
                            <th>#</th>                            
                        </thead>
                        <tbody>
                            @foreach ($admin as $item)
                                <tr>
                                    <td>{{$item->id}}</td>
                                    <td>{{$item->whatsapp}}</td>
                                    <td>{{$item->nama}}</td>                                    
                                    <td>{{$item->status=='1'?'Active':'Disable'}}</td>
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
