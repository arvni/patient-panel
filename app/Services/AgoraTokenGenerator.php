<?php

namespace App\Services;
class AgoraTokenGenerator
{
    public static function buildTokenWithUserAccount($appID, $appCertificate, $channelName, $userId, $expireTime)
    {
        $data = [
            'appId' => $appID,
            'uid' => $userId,
            'channelName' => $channelName,
            'ts' => time(),
            'salt' => mt_rand(),
            'expiredTs' => $expireTime,
        ];
        $sign = generateSignature($appID, $appCertificate, $channelName, $userId, $expireTime);

// Add the signature to the request body
        $data['signature'] = $sign;

// Convert the request body to JSON
        $jsonData = json_encode($data);


// Set the token server URL
        $url = 'https://api.agora.io/v1/token';

// Send a POST request to the token server
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

// Parse the response
        $responseData = json_decode($response, true);
        dd($responseData);

// Extract the token from the response
        $token = $responseData['data']['token'];
        return $token;
    }
}

function generateSignature($appId, $appCertificate, $channelName, $userId, $expireTime)
{
    $version = '1';
    $ts = (string)time();
    $salt = (string)mt_rand();
    $sign = md5($appId . $appCertificate . $channelName . $userId . $ts . $salt . $version);
    return $sign . ':' . $version . ':' . $ts . ':' . $salt . ':' . $expireTime;
}
