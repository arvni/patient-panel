<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\File;

class FileController extends Controller
{
    public function upload()
    {

    }

    public function download(File $file)
    {

        abort_if(!file_exists($file->path), 404);
        return response()
            ->download($file->path, null, [
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ], null);
    }
}
