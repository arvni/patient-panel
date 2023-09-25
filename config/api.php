<?php
return [
    "server_url" => env("SERVER_URL", ""),
    "acceptances_path" => env("ACCEPTANCES_PATH", "acceptances/"),
    "login_path" => env("LOGIN_PATH", "login/"),
    "report_path" => env("REPORT_PATH", "reports/"),
    "email" => env("API_LOGIN_EMAIL",""),
    "password" => ENV("API_LOGIN_PASSWORD","")
];
