<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

use App\AwbDetail;
use App\AwbHistory;

class AwbController extends Controller
{
    public function index(Request $request)
    {
        try {
            $rowsPerPage = $request->get('rowsPerPage') ? $request->get('rowsPerPage') : 5;
            $page = $request->get('page') ? $request->get('page') : 0;
            $offset = $page ? $rowsPerPage*$page : 0;

            $datas = AwbDetail::skip($offset)->take($rowsPerPage)->orderBy('created_at', 'desc')->get();
            $total = AwbDetail::count();
            $totalPages = ceil($total/$rowsPerPage);

            return response()->json([
                'success' => true,
                'data' => $datas,
                'total' => $total,
                'totalPages' => $totalPages,
                'page' => $page,
                'rowsPerPage' => $rowsPerPage,
                'message' => ''
            ]);
        } catch(Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetch data: ' .$e->getMessage()
            ]);
        }
    }

    public function store(Request $request) {
        $data = [];
        
        $validator = Validator::make($request->all(), [
            'awb' => 'required',
            'agent' => 'required',
            'weight' => 'required',
            'image' => 'required',
            'image.*' => 'image|mimes:jpeg,jpg,png|max:10000',
            // 'image' => 'max:'.env('IMAGES_NUMBER_UPLOAD'),
            'total_piece' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->messages()
            ]);
       }
       
        $files = $request->file('image');
        $imagesNumberUpload = env('IMAGES_NUMBER_UPLOAD');
        if(isset($file) && count($file) > (int)$imagesNumberUpload) {
            return response()->json([
                'success' => false,
                'message' => 'Images should be less than or equal to '.$imagesNumberUpload
            ]);
        }

        $awb = $request->get('awb');
        $awbNumberUpload = env('AWB_NUMBER_UPLOAD');
        $countAwb = AwbDetail::where('awb', $awb)->count();
        if((int)$awbNumberUpload < $countAwb) {
            return response()->json([
                'success' => false,
                'message' => 'Awb should be less than or equal to '.$awbNumberUpload
            ]);
        }

        try {
            $images = [];
            $awsUrl = env('AWS_URL');
            if(!empty($files)) {
                foreach($files as $file) {
                    $ext = $file->extension();
                    $name = Str::random(20).'.'.$ext ;
                    $dateTime = date('Y-m-d-H-i-s');
                    $filePath = 'media/'.$awb.'/'.$awb . '-' . $dateTime . '/' . $name;
                    $saveImage = Storage::disk('s3')->put($filePath, file_get_contents($file), 'public');
    
                    if($saveImage){
                        array_push($images, ['image' => Storage::disk('s3')->url($filePath)]);
                    }
                }
            }
            $model = new AwbDetail();
            $model->awb = $awb;
            $model->agent = $request->get('agent');
            $model->weight = $request->get('weight');
            $model->image_link = json_encode($images);
            $model->total_piece = $request->get('total_piece');
            if($model->save()) {
                $modelHistory = new AwbHistory();
                $modelHistory->awb = $awb;
                $modelHistory->times_change = $countAwb;
                $modelHistory->save();

                $data = [
                    'success' => true,
                    'message' => 'Awb created!'
                ];
            }
        } catch(\Exception $e) {
            $data = [
                'success' => false,
                'message' => 'Error Upload File: '. $e->getMessage()
            ];
        }
        
        return response()->json($data);
    }
}
